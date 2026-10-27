# Shipping selection in SYNERA

The booking workspace is recreated from the user's Wizard 3 screenshot using existing SYNERA primitives. It does not use React Bits Pro code or a paid package. White workspace, thin numbered progress, stacked native radio rows, a live neutral summary, and one original confirmation CTA.

## Three distinct service groups

The user explicitly chose sample services for Grab, SPX, GHN and GHTK, grouped by **standard**, **economy**, and **fast**. `server/shipping-service-catalog.mjs` contains twelve unique service IDs. Names of tiers, tariffs, times and acceptance policies are prototype fixtures, not verified offerings or real carrier commitments. No external carrier request is made.

The existing `quote` API keeps its legacy `quotes` field for preliminary screens/saved orders and adds `serviceQuotes` for this workspace. The latter exposes only safe quote fields. Both use the existing package, liquid, zone, weight and dimension eligibility calculation. The booking endpoint revalidates the exact service ID, fingerprint, expiry, eligibility and server-calculated fee. Legacy A/B/C bookings remain compatible; no data migration is necessary. Names for new bookings resolve from the saved quote snapshot.

## Ranking and selection

- `eligibility.mjs`: only `eligible === true` enters ranking. Unavailable services keep their reason and cannot be selected.
- `strategies.mjs`: standard 30:25 price/speed weights, economy 55:10, fast 10:55. `balanced` remains an internal compatibility alias for older untagged quotes.
- `scoring.mjs`: compares fees and quoted upper delivery bounds. Missing dimensions are excluded consistently. No reliability percentage or safety metric is fabricated.
- `ranking.mjs`: filters the service tier **before** eligibility and scoring, then sorts deterministically by score, relevant tie break and service ID. No other tier appears in the group, including in the unavailable section.

OrderDetail owns the controlled selected service ID. Changing tiers clears a choice from the previous tier, so the CTA cannot book a hidden service. Selection immediately updates the summary; before selection, the summary previews the group's leading recommendation and confirmation stays disabled. Switching tiers never refetches quotes. Existing confirmation, payload, permissions, validation, status transitions and timeout handling remain in place.

Native radios provide Tab/arrow/Space navigation and visible row focus. Background transitions last 150ms and are removed by `prefers-reduced-motion`. The desktop grid is approximately 62/38; it stacks at smaller widths, with a full-width mobile CTA. There are no springs, glass, gradients or decorative banners.

Validation: `npm.cmd run build:render`, `npm.cmd run check`, and `node --test tests/domain.test.mjs tests/shipping-recommendation.test.mjs tests/shipping-service-catalog.test.mjs tests/render.test.mjs`. Browser checks cover all three groups, selection clearing, exact summary/confirmation, keyboard focus and desktop/mobile layouts.
