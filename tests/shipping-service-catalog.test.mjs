import test from "node:test";
import assert from "node:assert/strict";
import { createDemo, act, sampleServiceQuotes, fingerprint, project, publicTracking } from "../server/domain.mjs";
import { rankShippingServices } from "../components/synera/shipping/recommendation/ranking.mjs";

function fixture() {
  const state = act(createDemo(), "packing", { id: "DH1028" });
  return { state, order: state.orders.find((order) => order.id === "DH1028") };
}

test("Three distinct service tiers contain the four requested sample carriers without leaking another tier", () => {
  const { state, order } = fixture();
  const quotes = sampleServiceQuotes(state, order.customerId, order.lines, order.parcels);
  assert.equal(quotes.length, 12);
  const seen = new Set();
  for (const tier of ["standard", "economy", "fast"]) {
    const { ranked, unavailable } = rankShippingServices(quotes, tier);
    const group = [...ranked.map(({ quote }) => quote), ...unavailable];
    assert.equal(group.length, 4);
    assert.deepEqual(group.map((quote) => quote.name).sort(), ["GHN", "GHTK", "Grab", "SPX"].sort());
    for (const quote of group) {
      assert.equal(quote.serviceTier, tier);
      assert.ok(!seen.has(quote.id)); seen.add(quote.id);
      assert.equal(quote.sample, true);
      assert.equal(quote.evidence, null);
    }
  }
  assert.equal(rankShippingServices(quotes, "economy").ranked[0].quote.id, "spx:economy");
  assert.equal(rankShippingServices(quotes, "fast").ranked[0].quote.id, "ghn:fast");
  assert.ok(rankShippingServices(quotes, "fast").unavailable.some((quote) => quote.id === "grab:fast"));
});

test("Sample service booking revalidates the actual service ID, price, expiry and package constraints", () => {
  const { state, order } = fixture();
  const response = act(state, "quote", { orderId: order.id });
  const quote = response.serviceQuotes.find((quote) => quote.id === "ghn:fast");
  assert.ok(quote.eligible);
  assert.equal(response.quotes.length, 3); // Existing preliminary consumers stay compatible.
  assert.ok(response.serviceQuotes.every((quote) => !("base" in quote) && !("perKg" in quote)));
  const payload = { id: order.id, carrierId: quote.id, quotedAt: Date.now(), fingerprint: response.fingerprint };
  assert.throws(() => act(state, "book", { ...payload, carrierId: "grab:fast" }));
  assert.throws(() => act(state, "book", { ...payload, carrierId: "ghn:made-up" }));
  assert.throws(() => act(state, "book", { ...payload, fingerprint: "stale" }));
  assert.throws(() => act(state, "book", { ...payload, quotedAt: Date.now() - 900001 }));
  const booked = act(state, "book", { ...payload, fee: 1 });
  const saved = booked.orders.find((item) => item.id === order.id);
  assert.equal(saved.status, "booked");
  assert.equal(saved.quoteSnapshot.id, "ghn:fast");
  assert.equal(saved.quoteSnapshot.fee, quote.fee);
  assert.equal(project(booked).orders.find((item) => item.id === order.id).carrierName, "GHN");
  assert.equal(publicTracking(booked, saved.trackingToken).carrier, "GHN");
  assert.equal(fingerprint(order.customerId, order.lines, order.parcels), response.fingerprint);
});

test("Warehouse permissions and projection remain intact for the new sample services", () => {
  const { state, order } = fixture();
  state.role = "warehouse";
  assert.throws(() => act(state, "quote", { orderId: order.id }));
  state.warehouseShipping = true;
  const response = act(state, "quote", { orderId: order.id });
  const booked = act(state, "book", { id: order.id, carrierId: "spx:economy", quotedAt: Date.now(), fingerprint: response.fingerprint });
  const safe = project(booked), safeOrder = safe.orders.find((item) => item.id === order.id);
  assert.equal(safeOrder.carrierName, "SPX");
  assert.ok(!("freight" in safeOrder)); assert.ok(!("finance" in safeOrder));
  assert.ok(!("carriers" in safe));
});
