// One illustrative order powers every landing demo. Never sent to operational APIs.
export const CONTACT = Object.freeze({ email: 'synera.suz26@gmail.com', phone: '0345 666 888', phoneHref: 'tel:+84345666888' });
export const DEMO_ORDER = Object.freeze({
  id: 'DH-MH03', customer: 'Cửa hàng Minh Anh', contact: 'Anh Minh',
  product: 'Nước khoáng 500ml', sku: 'NK-500', quantity: 3, unit: 'thùng',
  parcelWeight: 12.5, dimensions: '42 × 28 × 22 cm', unitPrice: 96000,
  route: 'Tân Bình → Bình Thạnh', service: 'Giao hàng tiêu chuẩn', carrier: 'GHN', estimate: '1–2 ngày',
  preliminaryFee: 137000, confirmedFee: 137000, actualFee: 139000,
  lastPurchaseDays: 22, purchaseCycle: 21, purchaseCount: 8,
});
export const DEMO_STOCK = Object.freeze({ physical: 120, reservedBefore: 96, quarantine: 0, incoming: 12, demand: 30, safety: 20 });
export const DEMO_ALTERNATIVE = Object.freeze({ carrier: 'SPX', service: 'Giao hàng tiêu chuẩn', estimate: '2–3 ngày', fee: 123000 });
export const DEMO_STAGES = Object.freeze(['Đã giữ hàng', 'Kiện chuẩn', 'Chờ đặt giao', 'Đang giao', 'Chờ đối chiếu']);
export const DEMO_MILESTONES = Object.freeze([['Đã xác nhận kiện', '08:30'], ['Đã đặt giao', '08:42'], ['Đã bàn giao thực tế', '09:15'], ['Đang giao', '10:20']]);
export const DEMO_OVERVIEW = Object.freeze({ pendingOrders: 3, dueCustomers: 1, reviewProducts: 1, orderStatus: 'Chờ chuẩn bị' });
export const demoFacts = () => {
  const reserved = DEMO_STOCK.reservedBefore + DEMO_ORDER.quantity;
  const available = DEMO_STOCK.physical - DEMO_STOCK.quarantine - reserved;
  return { reserved, available, suggested: Math.max(0, DEMO_STOCK.demand + DEMO_STOCK.safety - available - DEMO_STOCK.incoming),
    totalWeight: DEMO_ORDER.quantity * DEMO_ORDER.parcelWeight, total: DEMO_ORDER.quantity * DEMO_ORDER.unitPrice,
    difference: DEMO_ORDER.actualFee - DEMO_ORDER.confirmedFee };
};
export const formatMoney = value => new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
export const SOLUTIONS = Object.freeze([
  { id: 'inventory', label: 'Bổ sung hàng', title: 'Chủ động nguồn hàng.', description: 'Xem tồn khả dụng và hàng sắp về để cân nhắc bổ sung.' },
  { id: 'customers', label: 'Khách mua lại', title: 'Liên hệ đúng lúc.', description: 'Theo dõi lịch sử mua và khách đến kỳ đặt lại.' },
  { id: 'shipping', label: 'Vận chuyển', title: 'Chọn cách giao phù hợp.', description: 'So sánh dịch vụ, thời gian và chi phí theo kiện đã xác nhận.' },
]);
export const JOURNEY = Object.freeze([
  { title: 'Tạo đơn và giữ hàng', description: 'Ghi nhận mặt hàng, số lượng và giữ tồn khả dụng cho đơn.' },
  { title: 'Xác nhận kiện', description: 'Kiểm tra quy cách, khối lượng và thông tin từng kiện.' },
  { title: 'Chọn dịch vụ giao', description: 'So sánh dịch vụ theo kiện đã xác nhận trước khi đặt giao.' },
  { title: 'Theo dõi giao hàng', description: 'Ghi nhận các mốc bàn giao và trạng thái vận chuyển.' },
  { title: 'Đối chiếu chi phí', description: 'So sánh giá dự kiến với chi phí thực thu để kiểm tra chênh lệch.' },
]);
export const PLANS = Object.freeze([
  { id: 'free', name: 'Free', priceLabel: 'Trải nghiệm cơ bản', features: ['Quản lý kho và đơn hàng', 'Theo dõi khách hàng', 'Kết nối quy trình giao nhận'], action: 'Đăng ký trải nghiệm' },
  { id: 'pro', name: 'Pro', priceLabel: 'Liên hệ tư vấn', features: ['Bảng giá vận chuyển riêng', 'Thống kê chất lượng giao', 'Đối chiếu chi phí từng mốc'], action: 'Liên hệ tư vấn', note: 'Phạm vi và mức phí Pro chưa công bố chính thức.' },
]);
export const FAQS = Object.freeze([
  ['SYNERA dành cho ai?', 'Cơ sở bán sỉ, đại lý phân phối và cơ sở sản xuất nhỏ có hàng đóng gói.'],
  ['Có cần cài ứng dụng không?', 'Không. Dùng ngay trên trình duyệt máy tính, máy tính bảng hoặc điện thoại.'],
  ['Nhân viên kho xem được gì?', 'Hàng, số lượng, kiện và giao nhận; không xem giá bán, chiết khấu, tổng tiền hay công nợ. Chủ cơ sở cấp quyền chọn và đặt giao.'],
  ['Có dùng bảng giá vận chuyển riêng không?', 'Đây là định hướng của Pro, cần trao đổi thêm. Bản hiện tại dùng dịch vụ mẫu.'],
  ['Ai xác nhận gợi ý?', 'Người phụ trách xác nhận. Gợi ý không tự bổ sung hàng, liên hệ khách hay đặt giao.'],
]);
