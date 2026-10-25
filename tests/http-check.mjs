// Explicit opt-in integration check against the built loopback Worker only.
// Simulates trusted Sites identity headers; never sends them to a hosted origin.
import assert from "node:assert/strict";
import http from "node:http";
const base = process.env.SYNERA_TEST_URL;
if (!base || !["127.0.0.1", "localhost"].includes(new URL(base).hostname))
  throw Error("Set SYNERA_TEST_URL to the local dev server.");
const identity = {
  "oai-authenticated-user-id": "synera-local-http-test",
  "oai-authenticated-user-email": "synera-test@example.invalid",
};
function request(path, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : JSON.stringify(body);
    const req = http.request(
      new URL(path, base),
      {
        method: data ? "POST" : "GET",
        agent: false,
        headers: {
          "User-Agent": "SYNERA-local-integration-check",
          Accept: "application/json",
          ...headers,
          ...(data
            ? { "Content-Length": Buffer.byteLength(data) }
            : { "Content-Length": 0 }),
        },
      },
      (res) => {
        let text = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (text += chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            json: async () => JSON.parse(text),
          }),
        );
      },
    );
    req.setTimeout(15000, () =>
      req.destroy(new Error("HTTP timeout: " + path)),
    );
    req.on("error", reject);
    req.end(data);
  });
}
const get = (path) => request(path, { headers: identity });
const original = await (await get("/api/demo")).json();
let state = original;
async function post(
  action,
  payload = {},
  version = state.version,
  origin = base,
) {
  const r = await request("/api/demo", {
    headers: {
      ...identity,
      Origin: origin,
      "Content-Type": "application/json",
    },
    body: { action, payload, version },
  });
  return { status: r.status, body: await r.json() };
}
let count = 0;
try {
  const anonymous = await request("/api/demo");
  assert.equal(anonymous.status, 401);
  count++;
  const switched = await post("role", { role: "warehouse" });
  assert.equal(switched.status, 200);
  state = switched.body;
  const forbidden = new Set([
    "price",
    "total",
    "cod",
    "discount",
    "declaredValue",
    "finance",
    "debt",
    "carrierHolding",
    "received",
  ]);
  function walk(o) {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      assert.ok(!forbidden.has(k), k);
      walk(v);
    }
  }
  walk(state);
  assert.ok(!state.customers);
  assert.ok(!state.carriers);
  count++;
  assert.equal((await post("purchase", { id: "SP01", qty: 10 })).status, 403);
  count++;
  assert.equal((await post("quote", { orderId: "DH1028" })).status, 403);
  count++;
  assert.equal(
    (await post("role", { role: "owner" }, state.version - 1)).status,
    409,
  );
  count++;
  assert.equal(
    (
      await post(
        "role",
        { role: "owner" },
        state.version,
        "https://foreign.invalid",
      )
    ).status,
    403,
  );
  count++;
  const track = await get("/api/demo?tracking=demo-binh-minh-1025");
  assert.equal(track.status, 200);
  const t = await track.json();
  walk(t);
  assert.ok(t.phone.includes("••••"));
  count++;
  assert.equal((await get("/api/demo?tracking=not-a-valid-token")).status, 404);
  count++;
  for (const path of [
    "/server/domain.mjs",
    "/server/domain.mjs?raw",
    "/db/schema.ts",
    "/drizzle/0000_brief_gertrude_yorkes.sql",
  ]) {
    assert.ok([403, 404].includes((await get(path)).status), path);
  }
  count++;
  const owner = await post("role", { role: "owner" });
  state = owner.body;
  assert.equal(owner.status, 200);
  const quote = await post("quote", {
    customerId: "KH01",
    lines: [{ productId: "SP01", qty: 2 }],
  });
  assert.equal(quote.status, 200);
  assert.ok(!("base" in quote.body.quotes[0]));
  assert.equal(quote.body.quotes.find((c) => c.id === "C").eligible, false);
  count++;
  console.log(
    `${count} HTTP checks passed: auth, projection, permission, stale writes, origin, scoped tracking, source boundaries, quotes.`,
  );
} finally {
  const latest = await (await get("/api/demo")).json();
  if (latest.role !== original.role) {
    const restored = await post(
      "role",
      { role: original.role },
      latest.version,
    );
    assert.equal(restored.status, 200);
  }
}
