import { getEligibleShippingServices } from "./eligibility.mjs";
import { scoreShippingServices, deliveryDays } from "./scoring.mjs";

export function getRecommendationReasons(quote, eligible, strategy, dimensions) {
  const reasons = [];
  if (dimensions.includes("price") && quote.fee === Math.min(...eligible.map((item) => item.fee))) reasons.push("Giá thấp nhất trong các dịch vụ phù hợp");
  if (dimensions.includes("speed") && deliveryDays(quote.days) === Math.min(...eligible.map((item) => deliveryDays(item.days)))) reasons.push("Thời gian giao ngắn nhất trong các dịch vụ phù hợp");
  if (!reasons.length && ["balanced", "standard"].includes(strategy)) reasons.push("Cân đối chi phí và thời gian giao");
  reasons.push("Đáp ứng điều kiện kiện hàng và vùng giao");
  return reasons.slice(0, 3);
}

export function rankShippingServices(quotes = [], strategy = "balanced") {
  // A tier is a set of services, not just different weights for the same set.
  // Untagged legacy quotes remain compatible with preliminary quote screens.
  const group = quotes.some((quote) => quote.serviceTier)
    ? quotes.filter((quote) => quote.serviceTier === (strategy === "balanced" ? "standard" : strategy))
    : quotes;
  const { eligible, unavailable } = getEligibleShippingServices(group);
  const { scored, dimensions } = scoreShippingServices(eligible, strategy);
  const ranked = [...scored].sort((a, b) => b.score - a.score ||
    (strategy === "fast" && dimensions.includes("speed") ? a.speed - b.speed : dimensions.includes("price") ? a.price - b.price : 0) ||
    String(a.quote.id).localeCompare(String(b.quote.id), "en"));
  return { dimensions, unavailable, ranked: ranked.map((item, index) => ({ quote: item.quote, rank: index + 1,
    reasons: getRecommendationReasons(item.quote, eligible, strategy, dimensions) })) };
}
