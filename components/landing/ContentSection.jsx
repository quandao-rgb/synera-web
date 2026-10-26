// Adapted from Tailark Mist Content Section 2. MIT © 2025 Irung.
import { useState } from 'react';
import { ArrowRight, Package, Truck, ClipboardCheck, Boxes, Users } from 'lucide-react';
import { JOURNEY, DEMO_ORDER as order } from './landing-data.mjs';
import { ProductPreview } from './ProductPreview';

export default function ContentSection() {
  const [step, setStep] = useState(0);
  return <section className="sl-section sl-workflow" id="workflow" aria-labelledby="sl-workflow-title"><div className="sl-container"><div className="sl-section-heading" data-reveal><h2 id="sl-workflow-title">Một lần nhập,<br />dữ liệu nối liền từng khâu</h2><p>Cùng một đơn ba thùng nước đi từ lúc tạo đơn đến đối chiếu. Chọn từng khâu để xem thông tin được dùng tiếp thế nào.</p></div><div className="sl-workflow__grid"><ol className="sl-workflow__steps">{JOURNEY.map((item, index) => <li key={item.title}><button aria-pressed={step === index} aria-controls="sl-journey-preview" onClick={() => setStep(index)}><span className="sl-step-dot" aria-hidden="true">{index + 1}</span><span><b>{item.title}</b><small>{item.detail}</small></span><ArrowRight size={17} aria-hidden="true" /></button></li>)}</ol><div id="sl-journey-preview" aria-live="polite" aria-atomic="true"><ProductPreview mode="journey" step={step} /></div></div></div></section>;
}

export function ShippingContext() {
  return <section className="sl-section sl-shipping-context" aria-labelledby="sl-shipping-title"><div className="sl-container"><div className="sl-section-heading" data-reveal><h2 id="sl-shipping-title">Kết quả từng lần giao giúp<br />chọn dịch vụ phù hợp hơn</h2><p>Theo dõi kết quả theo dịch vụ, nhóm hàng và tuyến giao để bổ sung căn cứ cho những đơn tiếp theo.</p></div><div className="sl-shipping-flow" data-reveal><div><Package size={25} aria-hidden="true" /><h3>Bối cảnh giao</h3><p>Loại hàng · dịch vụ · tuyến</p><span>Đồ uống đóng chai<br />{order.carrier} tiêu chuẩn<br />{order.route}</span></div><ArrowRight className="sl-flow-arrow" size={25} aria-hidden="true" /><div><Truck size={25} aria-hidden="true" /><h3>Kết quả từng lần</h3><p>Đúng hẹn · trễ · hoàn / hư hỏng</p><span>Thời điểm giao nhận<br />Tình trạng hàng<br />Chi phí thực thu</span></div><ArrowRight className="sl-flow-arrow" size={25} aria-hidden="true" /><div><ClipboardCheck size={25} aria-hidden="true" /><h3>Căn cứ cho lần sau</h3><p>Đặt kết quả vào đúng ngữ cảnh</p><span>So sánh cùng nhóm<br />Kiểm tra mức độ phù hợp<br />Người phụ trách xác nhận</span></div></div></div></section>;
}

export function RolesSection() {
  return <section className="sl-section sl-roles" aria-labelledby="sl-roles-title"><div className="sl-container"><div className="sl-section-heading" data-reveal><h2 id="sl-roles-title">Chủ nắm tổng quan,<br />kho rõ việc cần làm</h2><p>Mỗi vai trò có góc nhìn phù hợp với công việc. Thông tin tài chính không nằm trong màn hình của kho.</p></div><div className="sl-role-grid"><article data-reveal><div className="sl-role-heading"><Users size={24} aria-hidden="true" /><div><h3>Chủ cơ sở</h3><p>Hoạt động, đơn, khách, kho và báo cáo.</p></div></div><ProductPreview mode="owner" compact /></article><article data-reveal><div className="sl-role-heading"><Boxes size={24} aria-hidden="true" /><div><h3>Nhân viên kho</h3><p>Hàng cần chuẩn bị, kiện và bàn giao.</p></div></div><ProductPreview mode="warehouse" role="warehouse" compact /></article></div></div></section>;
}
