import test from "node:test";
import assert from "node:assert/strict";
import { createDemo, quotes } from "../backend/server/domain.mjs";
import { rankShippingServices } from "../frontend/components/synera/shipping/recommendation/ranking.mjs";
import { deliveryDays } from "../frontend/components/synera/shipping/recommendation/scoring.mjs";
const source = () => {
  const s = createDemo(), o = s.orders.find((item) => item.id === "DH1028");
  return quotes(s, o.customerId, o.lines, o.parcels);
};
test("Real compatible quotes reorder by strategy, while the liquid-incompatible carrier never ranks", () => {
  const items = source(), before = JSON.stringify(items);
  assert.equal(rankShippingServices(items, "balanced").ranked[0].quote.id, "B");
  assert.equal(rankShippingServices(items, "economy").ranked[0].quote.id, "B");
  assert.equal(rankShippingServices(items, "fast").ranked[0].quote.id, "A");
  for (const strategy of ["balanced", "economy", "fast"]) {
    const result = rankShippingServices(items, strategy);
    assert.equal(result.ranked.some(({ quote }) => quote.id === "C"), false);
    assert.equal(result.unavailable.find((quote) => quote.id === "C").eligible, false);
    for (const { quote } of result.ranked) assert.ok(items.includes(quote));
  }
  assert.equal(JSON.stringify(items), before);
});
test("A free same-day incompatible quote is never eligible; unknown eligibility is not permission", () => {
  const items = source();
  const result = rankShippingServices([...items, { id: "bad", fee: 0, days: "Trong ngày", eligible: false }, { id: "unknown", fee: 0, days: "Trong ngày" }], "fast");
  assert.ok(result.ranked.every(({ quote }) => quote.eligible === true));
  assert.equal(result.unavailable.length, 3);
});
test("Available non-liquid services include real same-day delivery without invented estimates", () => {
  const s = createDemo(), o = s.orders.find((item) => item.id === "DH1025");
  const items = quotes(s, o.customerId, o.lines, o.parcels);
  const fastest = rankShippingServices(items, "fast").ranked[0].quote;
  assert.equal(fastest.id, "C"); assert.equal(fastest.days, "Trong ngày");
  assert.equal(deliveryDays("1–2 ngày"), 2);
  assert.equal(deliveryDays("2–3 ngày"), 3);
  assert.equal(deliveryDays("Trong ngày"), 1);
  assert.equal(deliveryDays("Chưa xác nhận"), null);
});
test("Missing speed is excluded and weights normalized consistently; unverified history is not scored", () => {
  const items = source().map((item) => ({ ...item, days: item.id === "A" ? "Chưa xác nhận" : item.days }));
  const result = rankShippingServices(items, "fast");
  assert.deepEqual(result.dimensions, ["price"]);
  assert.equal(result.ranked[0].quote.id, "B");
  const changedEvidence = source().map((item) => ({ ...item, evidence: { onTime: 0, total: 1000000 } }));
  assert.deepEqual(rankShippingServices(changedEvidence).ranked.map(({ quote }) => quote.id), rankShippingServices(source()).ranked.map(({ quote }) => quote.id));
});
test("Ties are deterministic independent of input order and raw fees/times remain unchanged", () => {
  const items = [{ id: "Z", fee: 40000, days: "1–2 ngày", eligible: true }, { id: "D", fee: 40000, days: "1–2 ngày", eligible: true }];
  assert.deepEqual(rankShippingServices(items).ranked.map(({ quote }) => quote.id), ["D", "Z"]);
  assert.deepEqual(rankShippingServices([...items].reverse()).ranked.map(({ quote }) => quote.id), ["D", "Z"]);
  assert.ok(rankShippingServices(items).ranked.every(({ quote }) => quote.fee === 40000 && quote.days === "1–2 ngày"));
  assert.deepEqual(rankShippingServices([]).ranked, []);
});
