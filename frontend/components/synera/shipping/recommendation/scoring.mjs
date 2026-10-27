import { STRATEGY_WEIGHTS } from "./strategies.mjs";

export function deliveryDays(estimate) {
  if (typeof estimate !== "string") return null;
  const text = estimate.trim().toLocaleLowerCase("vi");
  if (text === "trong ngày") return 1;
  const match = text.match(/^(\d+(?:[.,]\d+)?)\s*(?:[–—-]\s*(\d+(?:[.,]\d+)?))?\s*ngày$/u);
  if (!match) return null;
  const lower = Number(match[1].replace(",", ".")), upper = Number((match[2] || match[1]).replace(",", "."));
  return lower >= 0 && upper >= lower ? upper : null;
}

export function scoreShippingServices(eligible, strategy = "balanced") {
  const config = STRATEGY_WEIGHTS[strategy] || STRATEGY_WEIGHTS.balanced;
  const values = eligible.map((quote) => ({ quote, price: Number.isFinite(quote.fee) && quote.fee >= 0 ? quote.fee : null, speed: deliveryDays(quote.days) }));
  // Compare the same dimensions for every candidate. If any value is missing,
  // omit that dimension globally and normalize the remaining configured weights.
  const dimensions = Object.keys(config).filter((key) => values.length && values.every((item) => item[key] !== null));
  const ranges = Object.fromEntries(dimensions.map((key) => [key, {
    min: Math.min(...values.map((item) => item[key])), max: Math.max(...values.map((item) => item[key])),
  }]));
  const totalWeight = dimensions.reduce((sum, key) => sum + config[key], 0);
  return { dimensions, scored: values.map((item) => ({ ...item, score: dimensions.reduce((sum, key) => {
    const { min, max } = ranges[key];
    return sum + (max === min ? 1 : (max - item[key]) / (max - min)) * config[key] / totalWeight;
  }, 0) })) };
}
