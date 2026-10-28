/** Largest whitespace rectangle inside the audience strip, padded away from text/icons. */
export function findAudienceTruckZone(width, height, obstacles, vehicle = { width: 72, height: 63 }) {
  if (width < vehicle.width + 76 || height < vehicle.height + 28) return null;
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const blocks = obstacles.map(rect => ({
    left: clamp(rect.left - 10, 6, width - 6), right: clamp(rect.right + 10, 6, width - 6),
    top: clamp(rect.top - 10, 6, height - 6), bottom: clamp(rect.bottom + 10, 6, height - 6),
  })).filter(rect => rect.right > rect.left && rect.bottom > rect.top);
  const xs = [...new Set([6, width - 6, ...blocks.flatMap(rect => [rect.left, rect.right])])].sort((a, b) => a - b);
  const ys = [...new Set([6, height - 6, ...blocks.flatMap(rect => [rect.top, rect.bottom])])].sort((a, b) => a - b);
  let best = null, bestScore = 0;
  for (let a = 0; a < xs.length - 1; a++) for (let b = a + 1; b < xs.length; b++) {
    const w = xs[b] - xs[a]; if (w < vehicle.width + 64) continue;
    for (let c = 0; c < ys.length - 1; c++) for (let d = c + 1; d < ys.length; d++) {
      const h = ys[d] - ys[c]; if (h < vehicle.height + 16) continue;
      if (blocks.some(rect => xs[a] < rect.right && xs[b] > rect.left && ys[c] < rect.bottom && ys[d] > rect.top)) continue;
      const centering = 1 - 0.35 * Math.abs((xs[a] + xs[b]) / 2 - width / 2) / (width / 2);
      const score = Math.min(w, 520) * h * centering;
      if (score > bestScore) { bestScore = score; best = { left: xs[a], top: ys[c], width: w, height: h }; }
    }
  }
  if (best && best.width > 520) { best.left += (best.width - 520) / 2; best.width = 520; }
  return best;
}

/** Elliptical route measured entirely in the local clipped zone, never viewport coordinates. */
export function audienceTruckPoint(elapsedMs, width, height, vehicle = { width: 72, height: 63 }) {
  const rx = Math.max(0, (width - vehicle.width - 20) / 2);
  const ry = Math.max(0, (height - vehicle.height - 16) / 2);
  const period = Math.max(6000, 2 * Math.PI * Math.max(rx, ry) / 70 * 1000);
  const phase = elapsedMs / period * Math.PI * 2;
  return { x: width / 2 + Math.cos(phase) * rx, y: height / 2 + Math.sin(phase) * ry };
}
