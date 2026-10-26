export const SHIPPING_STRATEGIES = Object.freeze([
  { id: "standard", label: "Giao hàng tiêu chuẩn", description: "Cân bằng chi phí và thời gian trong nhóm dịch vụ giao hàng tiêu chuẩn.", recommended: true },
  { id: "economy", label: "Giao hàng tiết kiệm", description: "Ưu tiên chi phí thấp trong các dịch vụ đủ điều kiện vận chuyển." },
  { id: "fast", label: "Giao hàng nhanh", description: "Ưu tiên thời gian giao nhanh nhất trong các dịch vụ phù hợp." },
]);
// Compatibility is an eligibility gate, not a fabricated variable safety score.
// Reliability data in today's API is explicitly unverified: display, do not score.
export const STRATEGY_WEIGHTS = Object.freeze({
  standard: Object.freeze({ price: 30, speed: 25 }),
  balanced: Object.freeze({ price: 30, speed: 25 }),
  economy: Object.freeze({ price: 55, speed: 10 }),
  fast: Object.freeze({ price: 10, speed: 55 }),
});
