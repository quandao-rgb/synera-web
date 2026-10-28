// Adapted from Tailark Mist Content Section 2. MIT © 2025 Irung.
import { useState } from 'react';
import { ArrowRight, Package, Truck, ClipboardCheck, Boxes, Users } from 'lucide-react';
import { JOURNEY, DEMO_ORDER as order } from './landing-data.mjs';
import { ProductPreview } from './ProductPreview';
import LogisticsCharacters from './LogisticsCharacters';
import WorkflowCharacter from './WorkflowCharacter';

export default function ContentSection() {
  const [step, setStep] = useState(0);
  return <section className="sl-section sl-workflow" id="workflow" aria-labelledby="sl-workflow-title"><div className="sl-container">
    <div className="sl-section-heading" data-reveal><h2 id="sl-workflow-title">Một đơn, xuyên suốt quy trình</h2><p>Chọn từng bước để khám phá quy trình xử lý đơn hàng.</p></div>
    <ol className="sl-workflow__steps" aria-label="Các bước trong quy trình">
      {JOURNEY.map((item, index) => <li key={item.title}><button aria-pressed={step === index} aria-controls={`sl-journey-card-${index}`} onClick={() => setStep(index)}><span className="sl-step-dot" aria-hidden="true">{index + 1}</span><span><b>{item.title}</b></span><ArrowRight size={17} aria-hidden="true" /></button></li>)}
    </ol>
    <div className="sl-workflow__stage" aria-label="Các bước xử lý đơn hàng">
      {JOURNEY.map((item, index) => {
        const distance = Math.abs(index - step);
        return <article
          className="sl-workflow__card"
          id={`sl-journey-card-${index}`}
          key={item.title}
          data-active={step === index}
          aria-hidden={step !== index}
          inert={step !== index}
          style={{
            '--stack-offset': `${distance * 16}px`,
            '--stack-shift': `${distance * 8}px`,
            '--stack-scale': 1 - distance * 0.025,
            zIndex: JOURNEY.length - distance,
          }}
        >
          <div className="sl-workflow__card-copy"><span className="sl-workflow__card-index">BƯỚC {String(index + 1).padStart(2, '0')} / {String(JOURNEY.length).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.description}</p><WorkflowCharacter step={index} active={step === index} /></div>
          <div className="sl-workflow__card-preview"><ProductPreview mode="journey" step={index} animate={false} /></div>
        </article>;
      })}
    </div>
  </div></section>;
}

export function ShippingContext() {
  return <section className="sl-section sl-shipping-context" aria-labelledby="sl-shipping-title"><div className="sl-container"><div className="sl-section-heading" data-reveal><h2 id="sl-shipping-title">Hiểu mỗi chuyến giao</h2></div><LogisticsCharacters /><div className="sl-shipping-flow" data-reveal><div><Package size={25} aria-hidden="true" /><h3>Bối cảnh giao</h3><span>Đồ uống đóng chai<br />{order.carrier} tiêu chuẩn<br />{order.route}</span></div><ArrowRight className="sl-flow-arrow" size={25} aria-hidden="true" /><div><Truck size={25} aria-hidden="true" /><h3>Kết quả từng lần</h3><span>Thời điểm giao nhận<br />Tình trạng hàng<br />Chi phí thực thu</span></div><ArrowRight className="sl-flow-arrow" size={25} aria-hidden="true" /><div><ClipboardCheck size={25} aria-hidden="true" /><h3>Căn cứ cho lần sau</h3><span>So sánh cùng nhóm<br />Kiểm tra mức độ phù hợp<br />Người phụ trách xác nhận</span></div></div></div></section>;
}

export function RolesSection() {
  return <section className="sl-section sl-roles" aria-labelledby="sl-roles-title"><div className="sl-container"><div className="sl-section-heading" data-reveal><h2 id="sl-roles-title">Đúng vai trò, rõ công việc</h2><p>Kho tập trung giao nhận, chủ cơ sở nắm tài chính.</p></div><div className="sl-role-grid"><article data-reveal><div className="sl-role-heading"><Users size={24} aria-hidden="true" /><div><h3>Chủ cơ sở</h3><p>Hoạt động, đơn, khách, kho và báo cáo.</p></div></div><ProductPreview mode="owner" compact /></article><article data-reveal><div className="sl-role-heading"><Boxes size={24} aria-hidden="true" /><div><h3>Nhân viên kho</h3><p>Hàng cần chuẩn bị, kiện và bàn giao.</p></div></div><ProductPreview mode="warehouse" role="warehouse" compact /></article></div></div></section>;
}
