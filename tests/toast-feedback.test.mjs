import test from "node:test";
import assert from "node:assert/strict";
import { createToastTimer, mutationFeedback, normalizeToast, shouldDismissSwipe } from "../frontend/components/synera/toast-feedback.mjs";

test("Timer pauses with remaining time, resumes once, expires once and disposes safely", () => {
  let time = 0, callback, delay, scheduled = 0, cancelled = 0, expired = 0;
  const timer = createToastTimer({ duration: 5000, now: () => time,
    schedule: (fn, ms) => { callback = fn; delay = ms; return ++scheduled; }, cancel: () => { cancelled++; }, onExpire: () => { expired++; } });
  timer.resume(); timer.resume(); assert.equal(scheduled, 1);
  time = 1800; timer.pause(); assert.equal(timer.remaining(), 3200); assert.equal(cancelled, 1);
  time = 25000; timer.resume(); assert.equal(delay, 3200);
  callback(); timer.resume(); assert.equal(expired, 1); assert.equal(scheduled, 2);
  timer.dispose();
});
test("Persistent toast does not schedule and disposed timer cannot announce expiration", () => {
  let scheduled = 0, expired = 0, callback;
  const persistent = createToastTimer({ duration: 0, schedule: () => { scheduled++; }, onExpire: () => expired++ });
  persistent.resume(); assert.equal(scheduled, 0);
  const timer = createToastTimer({ duration: 5000, schedule: (fn) => { callback = fn; return 1; }, cancel: () => {}, onExpire: () => expired++ });
  timer.resume(); timer.dispose(); callback(); assert.equal(expired, 0);
});
test("Only real action callbacks are rendered and error/warning allow more reading time", () => {
  assert.equal(normalizeToast("", 1), null);
  assert.equal(normalizeToast("Đã lưu", 2).duration, 5000);
  assert.equal(normalizeToast({ title: "Lỗi", tone: "error", action: { label: "Hoàn tác" } }, 3).action, null);
  assert.equal(normalizeToast({ title: "Cần kiểm tra", tone: "warning" }, 4).duration, 9000);
  assert.equal(normalizeToast({ title: "Lưu ý", duration: 0 }, 5).duration, 0);
});
test("Booking verification is a warning, not a confirmed success or blind retry", () => {
  const next = { orders: [{ id: "DH1028", status: "verification" }] };
  const result = mutationFeedback("book", { id: "DH1028" }, next, "Thành công");
  assert.equal(result.tone, "warning"); assert.equal(result.href, "#/orders/DH1028");
  assert.equal(result.action, undefined);
  next.orders[0].status = "booked";
  assert.equal(mutationFeedback("book", { id: "DH1028" }, next).title, "Đã đặt giao đơn DH1028");
});
test("Existing destinations and contextual labels are preserved", () => {
  assert.equal(mutationFeedback("receive", {}, {}).href, "#/inventory");
  assert.equal(mutationFeedback("role", {}, {}, "Đã chuyển vai trò").title, "Đã chuyển vai trò");
  assert.equal(mutationFeedback("order", {}, { orders: [{ id: "DH1030" }] }).href, "#/orders/DH1030");
});
test("Swipe dismiss requires deliberate downward movement or flick", () => {
  assert.equal(shouldDismissSwipe(49, 0), true);
  assert.equal(shouldDismissSwipe(16, .5), true);
  assert.equal(shouldDismissSwipe(3, 1), false);
  assert.equal(shouldDismissSwipe(-70, -.8), false);
  assert.equal(shouldDismissSwipe(20, 0), false);
});
