export function normalizeToast(value, id) {
  const input = typeof value === "string" ? { title: value } : value;
  if (!input?.title) return null;
  const tone = ["success", "info", "warning", "error"].includes(input.tone) ? input.tone : "success";
  return { id, title: String(input.title), description: String(input.description || ""), tone,
    duration: Number.isFinite(input.duration) && input.duration >= 0 ? input.duration : ["error", "warning"].includes(tone) ? 9000 : 5000,
    action: input.action?.label && typeof input.action.onClick === "function" ? input.action : null };
}

export function mutationFeedback(action, payload, next, message) {
  const order = next.orders?.find((item) => item.id === payload.id) || (action === "order" ? next.orders?.[0] : null);
  if (action === "book" && order?.status === "verification") return {
    tone: "warning", title: `Cần kiểm tra đặt giao đơn ${order.id}`,
    description: "Kết quả chưa rõ. Kiểm tra vận đơn hiện có trước khi gửi lại yêu cầu.", href: `#/orders/${encodeURIComponent(order.id)}` };
  const messages = {
    packing: `Đã xác nhận kiện đơn ${payload.id}`, book: `Đã đặt giao đơn ${payload.id}`,
    "verify-booking": `Đã xác minh vận đơn của ${payload.id}`, handover: `Đã ghi nhận bàn giao đơn ${payload.id}`,
    cancel: `Đã hủy đơn ${payload.id}`, "receive-return": `Đã ghi nhận hàng hoàn ${payload.id}`,
    order: order ? `Đã tạo đơn ${order.id}` : "Đã tạo đơn hàng", contact: "Đã lưu kết quả liên hệ khách hàng",
    purchase: "Đã ghi nhận hàng cần bổ sung", receive: "Đã cập nhật hàng nhận vào kho",
    "adjustment-request": "Đã gửi yêu cầu kiểm kê", "approve-adjustment": "Đã duyệt điều chỉnh kho",
    permission: "Đã cập nhật quyền đặt giao", role: "Đã chuyển vai trò", reset: "Đã đặt lại dữ liệu", "revoke-tracking": "Đã thu hồi liên kết theo dõi" };
  const href = order ? `#/orders/${encodeURIComponent(order.id)}` : ["purchase", "receive", "adjustment-request", "approve-adjustment"].includes(action) ? "#/inventory" : action === "contact" ? "#/customers" : null;
  return { tone: "success", title: message || messages[action] || "Đã lưu thay đổi", href };
}
export function shouldDismissSwipe(offset, velocity) { return offset >= 48 || (offset >= 14 && velocity > 0.45); }
export function createToastTimer({ duration, onExpire, now = () => performance.now(), schedule = setTimeout, cancel = clearTimeout }) {
  let remaining = duration, started = null, handle = null, disposed = false, expired = false;
  const pause = () => {
    if (handle !== null) cancel(handle);
    handle = null;
    if (started !== null) remaining = Math.max(0, remaining - (now() - started));
    started = null;
  };
  return { pause, resume() {
    if (disposed || expired || duration <= 0 || started !== null) return;
    started = now();
    handle = schedule(() => { remaining = 0; started = handle = null; expired = true; if (!disposed) onExpire(); }, remaining);
  }, remaining: () => started === null ? remaining : Math.max(0, remaining - (now() - started)), dispose() { pause(); disposed = true; } };
}
