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
  { id: 'inventory', label: 'Bổ sung hàng', title: 'Chủ động nguồn hàng theo nhu cầu.', description: 'Đặt tồn khả dụng, hàng đang giữ và hàng sắp về cạnh nhau để người phụ trách cân nhắc phần cần bổ sung.', action: 'Kiểm tra trước khi bổ sung hàng' },
  { id: 'customers', label: 'Khách mua lại', title: 'Biết khách nào nên được liên hệ tiếp theo.', description: 'Lịch sử mua và chu kỳ đặt hàng cùng xuất hiện tại một nơi. Ghi nhận kết quả trao đổi trước khi tạo đơn mới.', action: 'Liên hệ đúng khách, đúng thời điểm' },
  { id: 'shipping', label: 'Vận chuyển', title: 'Chọn phương án giao từ thông tin đã có trong đơn.', description: 'Tận dụng quy cách hàng và kiện đã xác nhận để so sánh dịch vụ đủ điều kiện, thời gian dự kiến và chi phí.', action: 'Người phụ trách chọn và xác nhận dịch vụ' },
]);
export const JOURNEY = Object.freeze([
  { title: 'Tạo đơn và giữ hàng', detail: 'Khách, mặt hàng và số lượng đi tiếp cùng đơn.' },
  { title: 'Xác nhận kiện', detail: 'Đúng quy cách chuẩn thì xác nhận nhanh từng nhóm kiện.' },
  { title: 'Chọn phương án vận chuyển', detail: 'Lấy lại báo giá theo kiện đã được xác nhận.' },
  { title: 'Theo dõi giao hàng', detail: 'Bàn giao thực tế rồi cập nhật từng mốc hành trình.' },
  { title: 'Đối chiếu kết quả và chi phí', detail: 'So sánh giá sơ bộ, giá theo kiện và thực thu.' },
]);
export const PLANS = Object.freeze([
  { id: 'free', name: 'Free', priceLabel: 'Trải nghiệm cơ bản', description: 'Bắt đầu với một quy trình quản lý tập trung.', features: ['Quản lý cơ bản', 'Theo dõi kho, đơn và khách hàng', 'Kết nối thông tin giữa các khâu'], action: 'Đăng ký trải nghiệm' },
  { id: 'pro', name: 'Pro', priceLabel: 'Liên hệ tư vấn', description: 'Trao đổi phạm vi quản lý nâng cao cho cơ sở.', features: ['Bảng giá và hợp đồng vận chuyển riêng', 'Thống kê chất lượng giao theo nhóm', 'Đối chiếu chi phí theo từng mốc'], action: 'Liên hệ tư vấn', note: 'Phạm vi Pro và mức phí chưa được công bố chính thức.' },
]);
export const FAQS = Object.freeze([
  ['SYNERA phù hợp với cơ sở nào?', 'SYNERA hướng đến cơ sở bán sỉ, đại lý phân phối và cơ sở sản xuất nhỏ có hàng hóa đóng gói, cần kết nối kho, đơn, khách hàng và giao nhận.'],
  ['Có cần cài ứng dụng không?', 'Bạn có thể mở SYNERA bằng trình duyệt trên máy tính, máy tính bảng hoặc điện thoại. Không cần cài ứng dụng riêng để sử dụng bản web.'],
  ['Nhân viên kho xem được những thông tin gì?', 'Kho xem hàng cần chuẩn bị, số lượng, quy cách kiện và trạng thái giao nhận. Giá bán, chiết khấu, tổng tiền và công nợ không nằm trong góc nhìn kho. Quyền chọn và đặt giao do chủ cơ sở cấp.'],
  ['Có thể sử dụng bảng giá vận chuyển riêng không?', 'Đây là định hướng của gói Pro. Bản hiện tại dùng cấu hình dịch vụ mẫu; hợp đồng và bảng giá riêng cần được trao đổi thêm với SYNERA.'],
  ['Ai xác nhận các gợi ý của hệ thống?', 'Người phụ trách kiểm tra và xác nhận. Xem gợi ý không tự tạo kế hoạch bổ sung, liên hệ khách hay đặt vận đơn.'],
]);
