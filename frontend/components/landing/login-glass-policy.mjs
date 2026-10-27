/** A conservative enhancement decision, never an authentication capability check. */
export function loginGlassPolicy({ userAgent = '', hasBackdrop = false, reducedMotion = false, reducedTransparency = false, finePointer = false } = {}) {
  const chromium = /Chrome|Chromium|Edg\//.test(userAgent) && !/Firefox|FxiOS|CriOS/.test(userAgent);
  const advanced = hasBackdrop && chromium && !reducedTransparency;
  return { advanced, reactive: advanced && finePointer && !reducedMotion };
}
