// Presentation projections only. Status values / transitions remain in domain.mjs.
const supported = new Set(["packing", "ready", "verification", "booked", "transit", "delivered", "returning", "returned", "cancelled"]);
const latestEvent = (order, labels) => [...(order.events || [])].reverse().find((event) => labels.includes(event.label));
const withEvent = (item, event) => ({ ...item, ...(event ? { event } : {}) });

export function orderProcessingSteps(order) {
  if (!supported.has(order.status)) return [];
  const packed = latestEvent(order, ["Đã xác nhận kiện"]);
  const facts = [true, !!packed || !["packing", "cancelled"].includes(order.status), !!order.carrierId && order.status !== "verification", !!order.handedOver];
  const firstPending = facts.findIndex((done) => !done);
  const labels = ["Xác nhận đơn", "Xác nhận kiện", "Đặt giao", "Bàn giao thực tế"];
  const events = [latestEvent(order, ["Đơn đã xác nhận"]), packed,
    latestEvent(order, ["Đã đặt giao", "Đã xác minh vận đơn cũ"]), latestEvent(order, ["Đã bàn giao"])];
  return labels.map((title, index) => withEvent({
    id: ["confirmed", "packed", "booking", "handover"][index], title,
    status: facts[index] ? "complete" : order.status === "cancelled" ? "stopped" : index === firstPending ? order.status === "verification" ? "blocked" : "current" : "upcoming",
    ...(order.status === "verification" && index === 2 ? { description: "Chờ kiểm tra kết quả đặt giao; chưa xác nhận vận đơn.", tone: "danger" } : {}),
  }, events[index]));
}

export function returnSteps(order) {
  if (!["returning", "returned"].includes(order.status)) return [];
  return [
    withEvent({ id: "returning", title: "Đang hoàn", status: order.status === "returning" ? "current" : "complete", tone: "danger" }, latestEvent(order, ["Hãng báo chuyển hoàn"])),
    withEvent({ id: "returned", title: "Đã nhận hoàn", status: order.status === "returned" ? "complete" : "upcoming" }, latestEvent(order, ["Kho đã nhận và kiểm tra hoàn"])),
  ];
}

export function shipmentSteps(order) {
  if (!["verification", "booked", "transit", "delivered", "returning", "returned"].includes(order.status)) return [];
  const verifying = order.status === "verification";
  const returning = ["returning", "returned"].includes(order.status);
  const steps = [
    withEvent({ id: "booking", title: "Đặt giao", status: verifying ? "blocked" : "complete",
      ...(verifying ? { tone: "danger", description: "Kiểm tra vận đơn hiện có trước khi gửi lại yêu cầu." } : {}) }, latestEvent(order, verifying ? ["Chờ kiểm tra kết quả đặt giao"] : ["Đã đặt giao", "Đã xác minh vận đơn cũ"])),
    withEvent({ id: "handover", title: "Bàn giao thực tế", status: order.handedOver ? "complete" : order.status === "booked" ? "current" : "upcoming" }, latestEvent(order, ["Đã bàn giao"])),
    withEvent({ id: "transit", title: "Đang giao", status: order.status === "transit" ? "current" : order.status === "delivered" || returning ? "complete" : "upcoming" }, latestEvent(order, ["Đang trung chuyển"])),
  ];
  return returning ? [...steps, ...returnSteps(order)] : [...steps,
    withEvent({ id: "delivered", title: "Đã giao", status: order.status === "delivered" ? "complete" : "upcoming" }, latestEvent(order, ["Đã giao"]))];
}
