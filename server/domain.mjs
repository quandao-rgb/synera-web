// Server-only fictitious records. Never import this module from client code.
import { SAMPLE_SHIPPING_SERVICES } from "./shipping-service-catalog.mjs";
export class DomainError extends Error {
  constructor(message, status = 422) {
    super(message);
    this.status = status;
  }
}
const check = (v, m, s) => {
  if (!v) throw new DomainError(m, s);
};
const clone = (v) => structuredClone(v);
export function createDemo() {
  const s = {
    role: "owner",
    warehouseShipping: false,
    version: 0,
    products: [
      {
        id: "SP01",
        name: "Trà đào đóng chai",
        sku: "TD-350",
        category: "Đồ uống",
        unit: "thùng",
        physical: 47,
        quarantine: 0,
        incoming: 4,
        demand: 20,
        safety: 5,
        price: 216000,
        weight: 9.2,
        length: 40,
        width: 28,
        height: 24,
        liquid: true,
        color: "peach",
      },
      {
        id: "SP02",
        name: "Bánh quy yến mạch",
        sku: "BYM-120",
        category: "Thực phẩm khô",
        unit: "thùng",
        physical: 86,
        quarantine: 2,
        incoming: 0,
        demand: 16,
        safety: 10,
        price: 348000,
        weight: 5.4,
        length: 36,
        width: 26,
        height: 22,
        liquid: false,
        color: "oat",
      },
      {
        id: "SP03",
        name: "Nước khoáng 500ml",
        sku: "NK-500",
        category: "Đồ uống",
        unit: "thùng",
        physical: 120,
        quarantine: 0,
        incoming: 0,
        demand: 30,
        safety: 20,
        price: 96000,
        weight: 12.5,
        length: 42,
        width: 28,
        height: 22,
        liquid: true,
        color: "water",
      },
      {
        id: "SP04",
        name: "Cà phê rang xay",
        sku: "CF-250",
        category: "Thực phẩm khô",
        unit: "thùng",
        physical: 24,
        quarantine: 0,
        incoming: 0,
        demand: 18,
        safety: 10,
        price: 780000,
        weight: 6.3,
        length: 38,
        width: 30,
        height: 25,
        liquid: false,
        color: "coffee",
      },
      {
        id: "SP05",
        name: "Hạt điều nguyên vị",
        sku: "HD-200",
        category: "Thực phẩm khô",
        unit: "thùng",
        physical: 38,
        quarantine: 1,
        incoming: 0,
        demand: 12,
        safety: 8,
        price: 640000,
        weight: 4.8,
        length: 32,
        width: 24,
        height: 20,
        liquid: false,
        color: "nuts",
      },
      {
        id: "SP06",
        name: "Nước cam ít đường",
        sku: "NC-330",
        category: "Đồ uống",
        unit: "thùng",
        physical: 64,
        quarantine: 0,
        incoming: 12,
        demand: 18,
        safety: 10,
        price: 252000,
        weight: 8.8,
        length: 40,
        width: 28,
        height: 24,
        liquid: true,
        color: "orange",
      },
    ],
    customers: [
      {
        id: "KH01",
        name: "Tạp hóa An Nhiên",
        contact: "Chị Hạnh",
        phone: "0901234567",
        address: "28 đường Số 3, phường Tân Bình",
        zone: "Vùng nội thành",
        cycle: 14,
        lastDays: 16,
        purchases: 6,
        debt: 1296000,
        note: "Nhận hàng trước 11 giờ",
        outcome: "",
      },
      {
        id: "KH02",
        name: "Cửa hàng Minh Anh",
        contact: "Anh Minh",
        phone: "0912345678",
        address: "46 đường Hoa Mai, phường Bình Thạnh",
        zone: "Vùng nội thành",
        cycle: 21,
        lastDays: 22,
        purchases: 4,
        debt: 0,
        note: "Gọi trước khi giao",
        outcome: "",
      },
      {
        id: "KH03",
        name: "Đại lý Phương Nam",
        contact: "Chị Phương",
        phone: "0923456789",
        address: "12 đường số 5, khu vực Dĩ An",
        zone: "Vùng lân cận",
        cycle: 10,
        lastDays: 12,
        purchases: 8,
        debt: 3888000,
        note: "Có bãi xuống hàng",
        outcome: "",
      },
      {
        id: "KH04",
        name: "Cửa hàng Bình Minh",
        contact: "Anh Bình",
        phone: "0934567890",
        address: "73 đường Lê Văn Thọ, phường Gò Vấp",
        zone: "Vùng nội thành",
        cycle: 14,
        lastDays: 5,
        purchases: 5,
        debt: 0,
        note: "",
        outcome: "",
      },
      {
        id: "KH05",
        name: "Tạp hóa Mộc",
        contact: "Chị Lan",
        phone: "0945678901",
        address: "11 đường Tân Hòa, phường Tân Phú",
        zone: "Vùng nội thành",
        cycle: null,
        lastDays: 3,
        purchases: 1,
        debt: 0,
        note: "Chưa đủ lịch sử mua lại",
        outcome: "",
      },
      {
        id: "KH06",
        name: "Đại lý Hồng Hà",
        contact: "Anh Hà",
        phone: "0956789012",
        address: "23 đường Bình Chuẩn, vùng lân cận",
        zone: "Vùng lân cận",
        cycle: 18,
        lastDays: 8,
        purchases: 3,
        debt: 960000,
        note: "",
        outcome: "",
      },
    ],
    orders: [
      {
        id: "DH1028",
        customerId: "KH01",
        lines: [{ productId: "SP01", qty: 12 }],
        status: "packing",
        created: "25/10 · 08:42",
        handedOver: false,
        carrierId: null,
        trackingToken: "demo-an-nhien-1028",
      },
      {
        id: "DH1027",
        customerId: "KH03",
        lines: [{ productId: "SP01", qty: 18 }],
        status: "packing",
        created: "25/10 · 08:15",
        handedOver: false,
        carrierId: null,
        trackingToken: "demo-phuong-nam-1027",
      },
      {
        id: "DH1026",
        customerId: "KH02",
        lines: [
          { productId: "SP01", qty: 5 },
          { productId: "SP02", qty: 3 },
        ],
        status: "ready",
        created: "24/10 · 16:30",
        handedOver: false,
        carrierId: null,
        trackingToken: "demo-minh-anh-1026",
      },
      {
        id: "DH1025",
        customerId: "KH04",
        lines: [{ productId: "SP02", qty: 4 }],
        status: "transit",
        created: "24/10 · 14:20",
        handedOver: true,
        carrierId: "A",
        trackingToken: "demo-binh-minh-1025",
      },
      {
        id: "DH1024",
        customerId: "KH06",
        lines: [{ productId: "SP03", qty: 10 }],
        status: "returning",
        created: "23/10 · 10:05",
        handedOver: true,
        carrierId: "B",
        trackingToken: "demo-hong-ha-1024",
      },
      {
        id: "DH1023",
        customerId: "KH05",
        lines: [{ productId: "SP05", qty: 2 }],
        status: "delivered",
        created: "22/10 · 09:10",
        handedOver: true,
        carrierId: "A",
        trackingToken: "demo-moc-1023",
      },
    ],
    carriers: [
      {
        id: "A",
        name: "Vận chuyển A",
        service: "Giao tiêu chuẩn",
        liquid: true,
        base: 24500,
        perKg: 1700,
        days: "1–2 ngày",
        evidence: {
          onTime: 8,
          total: 10,
          overdueOpen: 2,
          source: "Nhập liệu nội bộ · minh họa",
          window: "01–24/10/2026",
          group: "Đồ uống · Vùng nội thành → Vùng nội thành",
        },
      },
      {
        id: "B",
        name: "Vận chuyển B",
        service: "Giao tiết kiệm",
        liquid: true,
        base: 19000,
        perKg: 1500,
        days: "2–3 ngày",
        evidence: {
          onTime: 6,
          total: 8,
          overdueOpen: 1,
          source: "Nhập liệu nội bộ · minh họa",
          window: "01–24/10/2026",
          group: "Đồ uống · Vùng nội thành → Vùng nội thành",
        },
      },
      {
        id: "C",
        name: "Vận chuyển C",
        service: "Giao nhanh",
        liquid: false,
        base: 32000,
        perKg: 2100,
        days: "Trong ngày",
        evidence: null,
      },
    ],
    purchases: [],
    adjustments: [],
    audit: [
      {
        id: "a0",
        text: "Khởi tạo không gian dữ liệu minh họa",
        at: "25/10 · 08:00",
        actor: "Hệ thống demo",
      },
    ],
  };
  s.orders.forEach((o) => {
    o.parcels = predictParcels(s, o.lines);
    o.total = o.lines.reduce(
      (sum, l) =>
        sum + s.products.find((p) => p.id === l.productId).price * l.qty,
      0,
    );
    o.cod = o.total;
    o.discount = 0;
    o.declaredValue = o.total;
    o.finance = {
      carrierHolding: o.status === "delivered" ? o.cod : 0,
      received: 0,
    };
    o.trackingExpiresAt = Date.now() + 7 * 86400000;
    o.events = [
      {
        label: "Đơn đã xác nhận",
        at: o.created,
        receivedAt: o.created,
        source: "Cơ sở · minh họa",
      },
    ];
    if (o.status !== "packing")
      o.events.push({
        label: "Đã xác nhận kiện",
        at: "24/10 · 17:00",
        receivedAt: "24/10 · 17:00",
        source: "Kho · minh họa",
      });
    if (o.handedOver)
      o.events.push({
        label: "Đã bàn giao",
        at: "24/10 · 17:30",
        receivedAt: "24/10 · 17:32",
        source: "Kho · minh họa",
      });
    if (["transit", "returning", "delivered"].includes(o.status))
      o.events.push({
        label: {
          transit: "Đang trung chuyển",
          returning: "Hãng báo chuyển hoàn",
          delivered: "Đã giao",
        }[o.status],
        at: "25/10 · 08:10",
        receivedAt: "25/10 · 08:14",
        source: `Vận chuyển ${o.carrierId} · chưa xác minh`,
      });
  });
  return s;
}
export function stock(s, p) {
  const reserved = s.orders
    .filter((o) => !o.handedOver && !["draft", "cancelled"].includes(o.status))
    .reduce(
      (sum, o) =>
        sum +
        o.lines
          .filter((l) => l.productId === p.id)
          .reduce((n, l) => n + l.qty, 0),
      0,
    );
  const available = p.physical - p.quarantine - reserved;
  return {
    reserved,
    available,
    suggested: Math.max(0, p.demand + p.safety - available - p.incoming),
  };
}
export function predictParcels(s, lines) {
  return lines.flatMap((l) => {
    const p = s.products.find((p) => p.id === l.productId);
    check(p, "Không tìm thấy mặt hàng.");
    return Array.from({ length: l.qty }, (_, i) => ({
      productId: p.id,
      index: i + 1,
      weight: p.weight,
      length: p.length,
      width: p.width,
      height: p.height,
    }));
  });
}
export const fingerprint = (customerId, lines, parcels) =>
  JSON.stringify({ customerId, lines, parcels });
export function quotes(s, customerId, lines, parcels, now = Date.now()) {
  const c = s.customers.find((c) => c.id === customerId);
  check(c, "Chọn khách để xem gợi ý.");
  const weight = parcels.reduce((n, p) => n + p.weight, 0);
  const liquid = lines.some(
    (l) => s.products.find((p) => p.id === l.productId)?.liquid,
  );
  const policies = {
    A: {
      maxParcel: 25,
      maxTotal: 300,
      zones: ["Vùng nội thành", "Vùng lân cận"],
    },
    B: {
      maxParcel: 20,
      maxTotal: 500,
      zones: ["Vùng nội thành", "Vùng lân cận"],
    },
    C: { maxParcel: 10, maxTotal: 100, zones: ["Vùng nội thành"] },
  };
  return s.carriers
    .map((carrier) => {
      const policy = policies[carrier.policyKey || carrier.id];
      const unknown =
        !policy ||
        typeof carrier.liquid !== "boolean" ||
        lines.some(
          (l) =>
            typeof s.products.find((p) => p.id === l.productId)?.liquid !==
            "boolean",
        );
      const reason = unknown
        ? "Chưa đủ dữ liệu điều kiện dịch vụ"
        : liquid && !carrier.liquid
          ? "Dịch vụ chưa nhận chất lỏng đóng chai"
          : !policy.zones.includes(c.zone)
            ? "Vùng giao chưa được dịch vụ hỗ trợ"
            : weight > policy.maxTotal ||
                parcels.some(
                  (p) =>
                    p.weight > policy.maxParcel ||
                    Math.max(p.length, p.width, p.height) > 120,
                )
              ? "Kiện hoặc tổng tải vượt giới hạn dịch vụ minh họa"
              : "";
      return {
        ...clone(carrier),
        eligible: !reason,
        reason:
          reason ||
          "Loại hàng, khối lượng và vùng giao phù hợp bộ quy tắc minh họa",
        fee:
          Math.round(
            (carrier.base * parcels.length +
              carrier.perKg * weight +
              (c.zone === "Vùng lân cận" ? 12000 : 0)) /
              1000,
          ) * 1000,
        weight: Math.round(weight * 10) / 10,
        parcelCount: parcels.length,
        source: carrier.sample ? "Bảng giá mẫu SYNERA · chưa kết nối hãng vận chuyển" : "Bảng giá giả lập v1 · gồm thuế và phụ phí giả định",
        validUntil: now + 900000,
        evidence:
          c.zone === "Vùng nội thành" && liquid
            ? clone(carrier.evidence)
            : null,
      };
    })
    .sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.fee - b.fee);
}
export function sampleServiceQuotes(s, customerId, lines, parcels, now = Date.now()) {
  return quotes({ ...s, carriers: SAMPLE_SHIPPING_SERVICES }, customerId, lines, parcels, now);
}

function carrierName(s, order) {
  return order.quoteSnapshot?.name || s.carriers.find((carrier) => carrier.id === order.carrierId)?.name || "Chưa đặt giao";
}
export function publicTracking(s, token) {
  const o = s.orders.find(
    (o) =>
      o.trackingToken === token &&
      !o.trackingRevoked &&
      (!o.trackingExpiresAt || o.trackingExpiresAt > Date.now()),
  );
  check(o, "Liên kết không còn hiệu lực hoặc không tồn tại.", 404);
  const c = s.customers.find((c) => c.id === o.customerId);
  return {
    id: o.id,
    recipient: c.contact,
    phone: c.phone.slice(0, 3) + "••••" + c.phone.slice(-3),
    destination: c.zone,
    status: o.status,
    carrier: carrierName(s, o),
    parcelCount: o.parcels.length,
    events: o.events
      .filter((e) =>
        [
          "Đơn đã xác nhận",
          "Đã xác nhận kiện",
          "Đã đặt giao",
          "Đã bàn giao",
          "Đang trung chuyển",
          "Hãng báo chuyển hoàn",
          "Đã giao",
          "Kho đã nhận và kiểm tra hoàn",
        ].includes(e.label),
      )
      .map((e) => ({
        ...e,
        source: e.source.includes("Vận chuyển") ? e.source : "Cơ sở · minh họa",
      })),
    demo: true,
  };
}
export function project(s) {
  const owner = s.role === "owner";
  const products = s.products.map((p) => {
    const safe = {
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      unit: p.unit,
      physical: p.physical,
      quarantine: p.quarantine,
      incoming: p.incoming,
      weight: p.weight,
      length: p.length,
      width: p.width,
      height: p.height,
      liquid: p.liquid,
      color: p.color,
      ...stock(s, p),
    };
    return owner
      ? { ...safe, price: p.price, demand: p.demand, safety: p.safety }
      : safe;
  });
  const orders = s.orders.map((o) => {
    const c = s.customers.find((c) => c.id === o.customerId);
    const safe = {
      id: o.id,
      customerId: c.id,
      customerName: c.name,
      recipient: c.contact,
      phone: c.phone,
      address: c.address,
      zone: c.zone,
      note: c.note,
      lines: clone(o.lines),
      status: o.status,
      created: o.created,
      handedOver: o.handedOver,
      parcels: clone(o.parcels),
      packingNote: o.packingNote || "",
      carrierId: o.carrierId,
      carrierName: carrierName(s, o),
      events: clone(o.events),
    };
    return owner
      ? {
          ...safe,
          total: o.total,
          cod: o.cod,
          discount: o.discount,
          declaredValue: o.declaredValue,
          finance: clone(o.finance),
          trackingToken: o.trackingToken,
          trackingRevoked: !!o.trackingRevoked,
          freight: o.quoteSnapshot
            ? {
                fee: o.quoteSnapshot.fee,
                source: o.quoteSnapshot.source,
                service: o.quoteSnapshot.service,
              }
            : null,
        }
      : safe;
  });
  const safe = {
    demo: true,
    date: "25/10/2026",
    version: s.version,
    role: s.role,
    warehouseShipping: s.warehouseShipping,
    products,
    orders,
    adjustments: clone(s.adjustments),
  };
  // Audit free text is owner-only: future financial audit messages must not leak to warehouse.
  return owner
    ? {
        ...safe,
        customers: clone(s.customers),
        carriers: clone(s.carriers),
        purchases: clone(s.purchases),
        audit: clone(s.audit.slice(-20).reverse()),
      }
    : safe;
}
function validateLines(s, lines) {
  check(
    Array.isArray(lines) && lines.length > 0 && lines.length <= 20,
    "Thêm ít nhất một mặt hàng.",
  );
  check(
    new Set(lines.map((l) => l.productId)).size === lines.length,
    "Gộp số lượng của mặt hàng trùng.",
  );
  let qty = 0;
  for (const l of lines) {
    const p = s.products.find((p) => p.id === l.productId);
    check(p, "Mặt hàng không tồn tại.");
    check(
      Number.isSafeInteger(l.qty) && l.qty > 0 && l.qty <= 200,
      "Số lượng phải là số nguyên từ 1 đến 200.",
    );
    check(
      l.qty <= stock(s, p).available,
      `${p.name}: chỉ còn ${stock(s, p).available} thùng khả dụng.`,
    );
    qty += l.qty;
  }
  check(qty <= 200, "Prototype hỗ trợ tối đa 200 kiện mỗi đơn.");
}
const audit = (s, text) =>
  s.audit.push({
    id: crypto.randomUUID(),
    text,
    at: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    actor: s.role === "owner" ? "Chủ cơ sở" : "Nhân viên kho",
  });
const event = (o, label) => {
  const at = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  o.events.push({
    label,
    at,
    receivedAt: at,
    source: "Cơ sở · minh họa",
  });
};
export function act(original, action, payload = {}) {
  const s = clone(original),
    owner = s.role === "owner";
  if (action === "role") {
    check(
      ["owner", "warehouse"].includes(payload.role),
      "Vai trò không hợp lệ.",
    );
    s.role = payload.role;
    return s;
  }
  if (action === "reset") {
    check(owner, "Chỉ chủ được đặt lại demo.", 403);
    return createDemo();
  }
  check(
    owner ||
      ["packing", "handover", "adjustment-request"].includes(action) ||
      (s.warehouseShipping && ["quote", "book"].includes(action)),
    "Vai trò hiện tại không có quyền thực hiện thao tác này.",
    403,
  );
  if (action === "quote") {
    let lines, parcels, customerId;
    if (payload.orderId) {
      const o = s.orders.find((o) => o.id === payload.orderId);
      check(o, "Không tìm thấy đơn.", 404);
      ({ lines, parcels, customerId } = o);
    } else {
      check(owner, "Kho chỉ được báo giá đơn đã giao xử lý.", 403);
      validateLines(s, payload.lines);
      lines = payload.lines;
      parcels = predictParcels(s, lines);
      customerId = payload.customerId;
    }
    return {
      quotes: quotes(s, customerId, lines, parcels).map((q) => ({
        id: q.id,
        name: q.name,
        service: q.service,
        days: q.days,
        eligible: q.eligible,
        reason: q.reason,
        fee: q.fee,
        weight: q.weight,
        parcelCount: q.parcelCount,
        source: q.source,
        validUntil: q.validUntil,
        evidence: q.evidence,
      })),
      // Keep legacy preliminary quotes and existing saved orders compatible.
      // The booking workspace consumes the explicit, grouped sample catalog.
      serviceQuotes: sampleServiceQuotes(s, customerId, lines, parcels).map((q) => ({
        id: q.id, providerId: q.providerId, name: q.name, serviceTier: q.serviceTier,
        service: q.service, days: q.days, eligible: q.eligible, reason: q.reason,
        fee: q.fee, weight: q.weight, parcelCount: q.parcelCount, source: q.source,
        validUntil: q.validUntil, evidence: q.evidence, sample: true,
      })),
      fingerprint: fingerprint(customerId, lines, parcels),
    };
  }
  if (action === "order") {
    validateLines(s, payload.lines);
    check(
      s.customers.some((c) => c.id === payload.customerId),
      "Chọn khách hàng.",
    );
    const id =
      "DH" + (Math.max(...s.orders.map((o) => Number(o.id.slice(2)))) + 1);
    const total = payload.lines.reduce(
        (sum, l) =>
          sum + s.products.find((p) => p.id === l.productId).price * l.qty,
        0,
      ),
      cod = Number(payload.cod ?? total);
    check(
      Number.isFinite(cod) && cod >= 0 && cod <= total,
      "COD phải từ 0 đến tổng tiền hàng.",
    );
    const o = {
      id,
      customerId: payload.customerId,
      lines: clone(payload.lines),
      status: "packing",
      created: "25/10 · Vừa tạo",
      handedOver: false,
      parcels: predictParcels(s, payload.lines),
      carrierId: null,
      trackingToken: crypto.randomUUID(),
      trackingExpiresAt: Date.now() + 7 * 86400000,
      total,
      cod,
      discount: 0,
      declaredValue: total,
      finance: { carrierHolding: 0, received: 0 },
      events: [],
    };
    event(o, "Đơn đã xác nhận");
    s.orders.unshift(o);
    audit(s, `${id}: xác nhận và giữ hàng; chưa xuất thực`);
  } else if (action === "permission") {
    s.warehouseShipping = !!payload.enabled;
    audit(
      s,
      `${s.warehouseShipping ? "Cấp" : "Thu hồi"} quyền đặt giao cho kho minh họa`,
    );
  } else if (action === "contact") {
    const c = s.customers.find((c) => c.id === payload.id);
    check(c, "Không tìm thấy khách.", 404);
    check(
      [
        "Đã liên hệ · chưa có nhu cầu",
        "Hẹn liên hệ sau 3 ngày",
        "Muốn đặt hàng",
      ].includes(payload.outcome),
      "Chọn kết quả liên hệ.",
    );
    c.outcome = payload.outcome;
    audit(s, `${c.name}: ${c.outcome}; chưa tạo đơn`);
  } else if (action === "purchase") {
    const p = s.products.find((p) => p.id === payload.id);
    check(p, "Không tìm thấy hàng.", 404);
    const qty = Number(payload.qty);
    check(
      Number.isSafeInteger(qty) && qty > 0 && qty <= 10000,
      "Số lượng phải nguyên, từ 1 đến 10.000.",
    );
    p.incoming += qty;
    s.purchases.unshift({
      id: "MH" + String(s.purchases.length + 1).padStart(3, "0"),
      productId: p.id,
      qty,
      remaining: qty,
    });
    audit(
      s,
      `Lập kế hoạch nhận ${qty} ${p.unit} ${p.name}; chưa tăng tồn thực`,
    );
  } else if (action === "receive") {
    const po = s.purchases.find((p) => p.id === payload.id);
    check(po, "Không tìm thấy kế hoạch.", 404);
    const good = Number(payload.good),
      bad = Number(payload.bad);
    check(
      [good, bad].every((n) => Number.isSafeInteger(n) && n >= 0) &&
        good + bad > 0 &&
        good + bad <= po.remaining,
      "Tổng nhận phải dương, không vượt số còn chờ.",
    );
    const p = s.products.find((p) => p.id === po.productId);
    p.physical += good + bad;
    p.quarantine += bad;
    p.incoming -= good + bad;
    po.remaining -= good + bad;
    audit(s, `${po.id}: nhận ${good} tốt, ${bad} cách ly; còn ${po.remaining}`);
  } else if (action === "adjustment-request") {
    const p = s.products.find((p) => p.id === payload.id);
    check(p, "Không tìm thấy hàng.", 404);
    const count = Number(payload.count);
    check(
      Number.isSafeInteger(count) &&
        count >= p.quarantine + stock(s, p).reserved,
      "Số đếm phải nguyên, không thấp hơn hàng cách ly + hàng giữ.",
    );
    check(
      typeof payload.reason === "string" && payload.reason.trim().length >= 5,
      "Ghi lý do ít nhất 5 ký tự.",
    );
    s.adjustments.unshift({
      id: crypto.randomUUID(),
      productId: p.id,
      count,
      reason: payload.reason.trim().slice(0, 300),
      status: "pending",
    });
    audit(s, `Gửi yêu cầu kiểm kê ${p.name}, chờ chủ duyệt`);
  } else if (action === "approve-adjustment") {
    const a = s.adjustments.find((a) => a.id === payload.id);
    check(a && a.status === "pending", "Yêu cầu không còn chờ duyệt.");
    const p = s.products.find((p) => p.id === a.productId);
    check(
      a.count >= p.quarantine + stock(s, p).reserved,
      "Số đếm không còn phù hợp hàng giữ hiện tại.",
    );
    p.physical = a.count;
    a.status = "approved";
    audit(s, `Chủ duyệt kiểm kê ${p.name}: ${a.count}`);
  } else {
    const o = s.orders.find((o) => o.id === payload.id);
    check(o, "Không tìm thấy đơn.", 404);
    if (action === "packing") {
      check(
        ["packing", "ready"].includes(o.status),
        "Đơn không còn ở bước đóng kiện.",
      );
      if (payload.custom) {
        check(
          typeof payload.reason === "string" &&
            payload.reason.trim().length >= 5,
          "Khác chuẩn cần lý do ít nhất 5 ký tự.",
        );
        check(
          Array.isArray(payload.parcels) &&
            payload.parcels.length === o.parcels.length,
          "Phải khai báo từng kiện, giữ nguyên số lượng hàng.",
        );
        for (const p of payload.parcels)
          check(
            ["weight", "length", "width", "height"].every(
              (k) => Number.isFinite(p[k]) && p[k] > 0 && p[k] <= 500,
            ),
            "Khối lượng/kích thước phải lớn hơn 0, tối đa 500.",
          );
        o.parcels = o.parcels.map((p, i) => ({
          ...p,
          ...Object.fromEntries(
            ["weight", "length", "width", "height"].map((k) => [
              k,
              payload.parcels[i][k],
            ]),
          ),
        }));
        o.packingNote = payload.reason.trim().slice(0, 300);
      }
      o.status = "ready";
      o.quoteSnapshot = null;
      event(o, "Đã xác nhận kiện");
      audit(
        s,
        `${o.id}: xác nhận ${o.parcels.length} kiện, cần báo giá hợp lệ`,
      );
    } else if (action === "book") {
      check(o.status === "ready", "Phải xác nhận kiện trước khi đặt giao.");
      const fp = fingerprint(o.customerId, o.lines, o.parcels);
      check(
        payload.fingerprint === fp,
        "Kiện đã thay đổi. Hãy lấy lại báo giá.",
      );
      check(
        Number.isFinite(payload.quotedAt) &&
          Date.now() - payload.quotedAt >= 0 &&
          Date.now() - payload.quotedAt < 900000,
        "Báo giá hết hạn. Hãy lấy lại báo giá.",
      );
      const q = [
        ...quotes(s, o.customerId, o.lines, o.parcels),
        ...sampleServiceQuotes(s, o.customerId, o.lines, o.parcels),
      ].find(
        (c) => c.id === payload.carrierId,
      );
      check(q?.eligible, "Dịch vụ không đủ điều kiện.");
      o.carrierId = q.id;
      o.status = payload.simulateTimeout ? "verification" : "booked";
      o.quoteSnapshot = { ...q, fingerprint: fp };
      event(
        o,
        payload.simulateTimeout
          ? "Chờ kiểm tra kết quả đặt giao"
          : "Đã đặt giao",
      );
      audit(
        s,
        `${o.id}: ${payload.simulateTimeout ? "timeout, không gửi lại" : "đặt giao mô phỏng"}`,
      );
    } else if (action === "verify-booking") {
      check(o.status === "verification", "Không có yêu cầu chờ kiểm tra.");
      o.status = "booked";
      event(o, "Đã xác minh vận đơn cũ");
      audit(s, `${o.id}: tìm thấy vận đơn cũ, không tạo thêm`);
    } else if (action === "handover") {
      if (o.handedOver) return s;
      check(o.status === "booked", "Chỉ bàn giao khi đã xác nhận vận đơn.");
      for (const l of o.lines) {
        const p = s.products.find((p) => p.id === l.productId);
        check(p.physical - p.quarantine >= l.qty, "Không đủ hàng để bàn giao.");
        p.physical -= l.qty;
      }
      o.handedOver = true;
      o.status = "transit";
      event(o, "Đã bàn giao");
      audit(s, `${o.id}: xuất thực một lần, giải phóng giữ hàng`);
    } else if (action === "cancel") {
      check(
        !o.handedOver && ["packing", "ready"].includes(o.status),
        "Prototype chỉ hủy trước đặt giao.",
      );
      o.status = "cancelled";
      audit(s, `${o.id}: hủy, giải phóng giữ hàng`);
    } else if (action === "receive-return") {
      check(o.status === "returning", "Đơn không chờ nhận hoàn.");
      check(
        ["good", "quarantine"].includes(payload.condition),
        "Chọn kết quả kiểm tra.",
      );
      for (const l of o.lines) {
        const p = s.products.find((p) => p.id === l.productId);
        p.physical += l.qty;
        if (payload.condition === "quarantine") p.quarantine += l.qty;
      }
      o.status = "returned";
      event(o, "Kho đã nhận và kiểm tra hoàn");
      audit(
        s,
        `${o.id}: nhận hoàn thực tế, ${payload.condition === "good" ? "hàng tốt" : "cách ly"}`,
      );
    } else if (action === "revoke-tracking") {
      o.trackingRevoked = true;
      audit(s, `${o.id}: thu hồi link theo dõi`);
    } else throw new DomainError("Thao tác không được hỗ trợ.", 400);
  }
  return s;
}
