import test from "node:test";
import assert from "node:assert/strict";
import {
  createDemo,
  stock,
  act,
  project,
  quotes,
  fingerprint,
  publicTracking,
} from "../server/domain.mjs";
const p = (s) => s.products[0];
function booked(s, id = "DH1028") {
  s = act(s, "packing", { id });
  const o = s.orders.find((o) => o.id === id);
  return act(s, "book", {
    id,
    carrierId: "A",
    quotedAt: Date.now(),
    fingerprint: fingerprint(o.customerId, o.lines, o.parcels),
  });
}
test("Khả dụng không tính hàng đang về; gợi ý không trừ hàng giữ hai lần", () => {
  const s = createDemo();
  assert.deepEqual(stock(s, p(s)), {
    reserved: 35,
    available: 12,
    suggested: 9,
  });
});
test("Tạo đơn giữ hàng, bàn giao xuất thực đúng một lần", () => {
  let s = createDemo();
  s = act(s, "order", {
    customerId: "KH01",
    lines: [{ productId: "SP01", qty: 2 }],
  });
  assert.equal(p(s).physical, 47);
  assert.equal(stock(s, p(s)).reserved, 37);
  assert.equal(stock(s, p(s)).available, 10);
  const id = s.orders[0].id;
  s = booked(s, id);
  s = act(s, "handover", { id });
  assert.equal(p(s).physical, 45);
  assert.equal(stock(s, p(s)).reserved, 35);
  assert.deepEqual(act(s, "handover", { id }), s);
});
test("Không nhận đơn quá khả dụng, số âm, thập phân hay mã hàng giả", () => {
  for (const line of [
    { productId: "SP01", qty: 13 },
    { productId: "SP01", qty: -1 },
    { productId: "SP01", qty: 1.5 },
    { productId: "missing", qty: 1 },
  ])
    assert.throws(() =>
      act(createDemo(), "order", { customerId: "KH01", lines: [line] }),
    );
});
test("Hủy giải phóng giữ hàng và không tăng tồn thực", () => {
  let s = createDemo();
  s = act(s, "cancel", { id: "DH1028" });
  assert.equal(p(s).physical, 47);
  assert.equal(stock(s, p(s)).reserved, 23);
});
test("Kho không nhận bất kỳ trường tài chính và không được thao tác chủ", () => {
  const s = createDemo();
  s.role = "warehouse";
  const safe = project(s);
  const forbidden = new Set([
    "price",
    "total",
    "cod",
    "discount",
    "declaredValue",
    "finance",
    "debt",
    "carrierHolding",
    "received",
  ]);
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      assert.ok(!forbidden.has(k), k);
      walk(v);
    }
  };
  walk(safe);
  assert.ok(!safe.customers);
  assert.ok(!safe.audit);
  assert.ok(!safe.carriers);
  for (const action of [
    "order",
    "cancel",
    "purchase",
    "permission",
    "approve-adjustment",
    "receive-return",
    "revoke-tracking",
    "reset",
    "book",
    "quote",
  ])
    assert.throws(
      () => act(s, action, {}),
      (e) => e.status === 403,
    );
});
test("Cấp đặt giao không mở tiền hay duyệt kho, thu hồi hiệu lực ngay", () => {
  let s = createDemo();
  s = act(s, "permission", { enabled: true });
  s.role = "warehouse";
  s = act(s, "packing", { id: "DH1028" });
  assert.ok(act(s, "quote", { orderId: "DH1028" }).quotes.length);
  assert.throws(
    () => act(s, "approve-adjustment", {}),
    (e) => e.status === 403,
  );
  assert.throws(
    () =>
      act(s, "quote", {
        customerId: "KH01",
        lines: [{ productId: "SP01", qty: 1 }],
      }),
    (e) => e.status === 403,
  );
  s.warehouseShipping = false;
  assert.throws(
    () => act(s, "quote", { orderId: "DH1028" }),
    (e) => e.status === 403,
  );
});
test("Chỉ đặt giao sau xác nhận kiện, loại hãng không nhận chất lỏng", () => {
  let s = createDemo(),
    o = s.orders[0];
  const args = {
    id: o.id,
    carrierId: "A",
    quotedAt: Date.now(),
    fingerprint: fingerprint(o.customerId, o.lines, o.parcels),
  };
  assert.throws(() => act(s, "book", args));
  s = act(s, "packing", { id: o.id });
  assert.throws(() => act(s, "book", { ...args, carrierId: "C" }));
  const q = quotes(s, o.customerId, o.lines, o.parcels);
  assert.equal(q.find((c) => c.id === "C").eligible, false);
});
test("Sửa từng kiện cần lý do, làm báo giá cũ không hợp lệ", () => {
  let s = act(createDemo(), "packing", { id: "DH1028" }),
    o = s.orders[0],
    old = fingerprint(o.customerId, o.lines, o.parcels);
  const parcels = o.parcels.map((p) => ({ ...p, weight: 10 }));
  assert.throws(() =>
    act(s, "packing", { id: o.id, custom: true, parcels, reason: "" }),
  );
  s = act(s, "packing", {
    id: o.id,
    custom: true,
    parcels,
    reason: "Thay thùng và cân lại",
  });
  assert.throws(() =>
    act(s, "book", {
      id: o.id,
      carrierId: "A",
      quotedAt: Date.now(),
      fingerprint: old,
    }),
  );
});
test("Báo giá hết hạn bị từ chối; timeout không cho đặt lại mù", () => {
  let s = act(createDemo(), "packing", { id: "DH1028" }),
    o = s.orders[0];
  const args = {
    id: o.id,
    carrierId: "A",
    fingerprint: fingerprint(o.customerId, o.lines, o.parcels),
  };
  assert.throws(() =>
    act(s, "book", { ...args, quotedAt: Date.now() - 900001 }),
  );
  s = act(s, "book", { ...args, quotedAt: Date.now(), simulateTimeout: true });
  assert.equal(s.orders[0].status, "verification");
  assert.throws(() => act(s, "book", { ...args, quotedAt: Date.now() }));
  s = act(s, "verify-booking", { id: o.id });
  assert.equal(s.orders[0].status, "booked");
});
test("Hoàn chỉ nhập thực sau kiểm tra, cách ly không tăng khả dụng", () => {
  let s = createDemo(),
    before = s.products.find((p) => p.id === "SP03").physical;
  s = act(s, "receive-return", { id: "DH1024", condition: "quarantine" });
  const p = s.products.find((p) => p.id === "SP03");
  assert.equal(p.physical, before + 10);
  assert.equal(p.quarantine, 10);
  assert.equal(stock(s, p).available, before);
  assert.throws(() =>
    act(s, "receive-return", { id: "DH1024", condition: "good" }),
  );
});
test("Nhận một phần giữ số còn về và cách ly hàng lỗi", () => {
  let s = createDemo();
  s = act(s, "purchase", { id: "SP01", qty: 9 });
  s = act(s, "receive", { id: "MH001", good: 3, bad: 1 });
  assert.equal(p(s).physical, 51);
  assert.equal(p(s).quarantine, 1);
  assert.equal(p(s).incoming, 9);
  assert.equal(s.purchases[0].remaining, 5);
  assert.throws(() => act(s, "receive", { id: "MH001", good: 6, bad: 0 }));
});
test("Kho gửi kiểm kê nhưng chỉ chủ duyệt; kiểm tra lại hàng giữ", () => {
  let s = createDemo();
  s.role = "warehouse";
  s = act(s, "adjustment-request", {
    id: "SP01",
    count: 46,
    reason: "Đếm lại thực tế",
  });
  assert.equal(p(s).physical, 47);
  assert.throws(
    () => act(s, "approve-adjustment", { id: s.adjustments[0].id }),
    (e) => e.status === 403,
  );
  s.role = "owner";
  s = act(s, "approve-adjustment", { id: s.adjustments[0].id });
  assert.equal(p(s).physical, 46);
});
test("Liên hệ mua lại không tạo đơn; dữ liệu không đủ không biến thành tỷ lệ 0", () => {
  const s = createDemo(),
    next = act(s, "contact", { id: "KH01", outcome: "Muốn đặt hàng" });
  assert.equal(next.orders.length, s.orders.length);
  assert.equal(s.carriers[2].evidence, null);
});
test("Theo dõi không có tài chính, che điện thoại, từ chối token thu hồi/không tồn tại", () => {
  let s = createDemo();
  const t = publicTracking(s, s.orders[0].trackingToken);
  assert.equal(t.phone, "090••••567");
  assert.ok(!JSON.stringify(t).includes("2592000"));
  assert.ok(!("cod" in t));
  assert.ok(!("address" in t));
  assert.throws(
    () => publicTracking(s, "unknown"),
    (e) => e.status === 404,
  );
  s = act(s, "revoke-tracking", { id: s.orders[0].id });
  assert.throws(
    () => publicTracking(s, s.orders[0].trackingToken),
    (e) => e.status === 404,
  );
});
test("Link theo dõi hết hạn bị từ chối", () => {
  const s = createDemo();
  s.orders[0].trackingExpiresAt = Date.now() - 1;
  assert.throws(
    () => publicTracking(s, s.orders[0].trackingToken),
    (e) => e.status === 404,
  );
});
test("Điều kiện vùng, tải và dữ liệu dịch vụ phải đủ trước khi so phí", () => {
  const s = createDemo(),
    lines = [{ productId: "SP03", qty: 100 }],
    parcels = Array.from({ length: 100 }, () => ({
      weight: 12.5,
      length: 42,
      width: 28,
      height: 22,
    }));
  assert.ok(quotes(s, "KH01", lines, parcels).every((q) => !q.eligible));
  s.customers[0].zone = "Vùng chưa hỗ trợ";
  assert.ok(
    quotes(
      s,
      "KH01",
      [{ productId: "SP02", qty: 1 }],
      [{ weight: 5, length: 30, width: 20, height: 20 }],
    ).every((q) => !q.eligible),
  );
  s.customers[0].zone = "Vùng nội thành";
  s.carriers[0].liquid = undefined;
  assert.equal(
    quotes(
      s,
      "KH01",
      [{ productId: "SP02", qty: 1 }],
      [{ weight: 5, length: 30, width: 20, height: 20 }],
    ).find((q) => q.id === "A").eligible,
    false,
  );
});
test("Trang người nhận không nhận sự kiện kiểm tra đặt giao nội bộ", () => {
  let s = booked(createDemo());
  s = act(s, "handover", { id: "DH1028" });
  s.orders[0].events.push({
    label: "Đã xác minh vận đơn cũ",
    at: "test",
    source: "Internal",
    receivedAt: "test",
  });
  assert.ok(
    !publicTracking(s, s.orders[0].trackingToken).events.some((e) =>
      e.label.includes("xác minh"),
    ),
  );
});
