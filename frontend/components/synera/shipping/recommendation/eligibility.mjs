export function getEligibleShippingServices(quotes = []) {
  // The quote API alone owns package, liquid, zone, weight and dimension checks.
  return { eligible: quotes.filter((quote) => quote.eligible === true), unavailable: quotes.filter((quote) => quote.eligible !== true) };
}
