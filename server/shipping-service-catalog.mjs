// Explicit prototype fixtures requested by the user. These are NOT the carriers'
// published products, tariffs, delivery commitments or acceptance policies.
// No external carrier API or real waybill is created by this catalog.
const tiers = {
  standard: "Giao hàng tiêu chuẩn",
  economy: "Giao hàng tiết kiệm",
  fast: "Giao hàng nhanh",
};
const rows = [
  ["grab", "Grab", "standard", "A", 28500, 1900, "1–2 ngày"],
  ["spx", "SPX", "standard", "A", 21500, 1550, "2–3 ngày"],
  ["ghn", "GHN", "standard", "A", 24500, 1700, "1–2 ngày"],
  ["ghtk", "GHTK", "standard", "A", 22500, 1600, "2–3 ngày"],
  ["grab", "Grab", "economy", "B", 21000, 1450, "3–4 ngày"],
  ["spx", "SPX", "economy", "B", 16500, 1200, "3–5 ngày"],
  ["ghn", "GHN", "economy", "B", 19000, 1350, "2–4 ngày"],
  ["ghtk", "GHTK", "economy", "B", 17500, 1250, "3–4 ngày"],
  ["grab", "Grab", "fast", "C", 32000, 2100, "Trong ngày"],
  ["spx", "SPX", "fast", "A", 29000, 1900, "1–2 ngày"],
  ["ghn", "GHN", "fast", "A", 33000, 2000, "1 ngày"],
  ["ghtk", "GHTK", "fast", "A", 30500, 1950, "1–2 ngày"],
];
export const SAMPLE_SHIPPING_SERVICES = Object.freeze(rows.map(([providerId, name, serviceTier, policyKey, base, perKg, days]) => Object.freeze({
  id: `${providerId}:${serviceTier}`, providerId, name, serviceTier,
  service: tiers[serviceTier], policyKey, base, perKg, days,
  liquid: policyKey !== "C", evidence: null, sample: true,
})));
