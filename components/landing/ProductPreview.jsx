import { Boxes, Package, Check, Truck, ClipboardList, Users, ArrowRight, Clock3 } from 'lucide-react';
import { DEMO_ORDER as order, DEMO_STOCK as stock, demoFacts, formatMoney, DEMO_ALTERNATIVE as alternative, DEMO_STAGES, DEMO_MILESTONES, DEMO_OVERVIEW as overview } from './landing-data.mjs';

function Chip({ children, tone = 'blue' }) { return <span className={`sl-chip sl-chip--${tone}`}>{children}</span>; }
function PreviewTable({ headers, rows }) { return <table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table>; }

export function ProductPreview({ mode = 'inventory', step = 0, role, compact = false }) {
  const facts = demoFacts();
  const titles = { inventory: 'Gợi ý bổ sung hàng', customers: 'Nhắc mua lại', shipping: 'Chọn dịch vụ & đặt giao', journey: 'Chi tiết đơn hàng', owner: 'Tổng quan cơ sở', warehouse: 'Việc kho cần xử lý' };
  return <div className={`sl-preview${compact ? ' sl-preview--compact' : ''}`} data-ui="synera-product" data-preview-role={role || mode}>
    <div className="sl-preview__bar"><span><Boxes size={17} aria-hidden="true" /><b>SYNERA</b><span>/ {titles[mode]}</span></span><small>Minh họa</small></div>
    <div className="sl-preview__content" key={`${mode}-${step}`}>
      {mode === 'inventory' && <>
        <div className="sl-preview__heading"><div><h3>Hàng cần xem xét</h3><p>{order.product} · {order.sku}</p></div><Chip>Chờ kiểm tra</Chip></div>
        <div className="sl-preview__stats"><div><span>Khả dụng</span><strong>{facts.available}<small> thùng</small></strong></div><div><span>Đang giữ</span><strong>{facts.reserved}<small> thùng</small></strong></div><div><span>Đang về</span><strong>{stock.incoming}<small> thùng</small></strong></div></div>
        <PreviewTable headers={['Mặt hàng', 'Nhu cầu', 'Mức dự phòng']} rows={[[order.sku, `${stock.demand} thùng`, `${stock.safety} thùng`]]} />
        <div className="sl-preview__decision"><Boxes size={20} aria-hidden="true" /><div><b>Đề xuất bổ sung {facts.suggested} thùng</b><span>Đã tính hàng đang giữ và hàng đang về.</span></div><Chip tone="gray">Cần xác nhận</Chip></div>
      </>}
      {mode === 'customers' && <>
        <div className="sl-preview__heading"><div><h3>Khách đến kỳ liên hệ</h3><p>Chu kỳ từ những lần mua riêng biệt</p></div><Users size={21} aria-hidden="true" /></div>
        <div className="sl-preview__customer"><span>MA</span><div><h4>{order.customer}</h4><p>{order.contact} · {order.purchaseCount} lần mua</p></div><Chip>Đến kỳ</Chip></div>
        <div className="sl-preview__stats"><div><span>Lần mua gần nhất</span><strong>{order.lastPurchaseDays}<small> ngày</small></strong></div><div><span>Chu kỳ tham khảo</span><strong>{order.purchaseCycle}<small> ngày</small></strong></div></div>
        <div className="sl-preview__decision"><Clock3 size={20} aria-hidden="true" /><div><b>Nên liên hệ tiếp theo</b><span>Ghi kết quả trao đổi trước khi tạo đơn.</span></div></div>
      </>}
      {mode === 'shipping' && <>
        <div className="sl-preview__heading"><div><h3>{order.id}</h3><p>{order.quantity} kiện chuẩn · {facts.totalWeight.toLocaleString('vi-VN')} kg · {order.route}</p></div><Chip tone="green">Đã xác nhận kiện</Chip></div>
        <div className="sl-preview__service is-selected"><span className="sl-preview__radio" /><div><b>{order.carrier} · {order.service}</b><span>{order.estimate} · Nhóm đồ uống đóng chai</span></div><strong>{formatMoney(order.confirmedFee)}</strong></div>
        <div className="sl-preview__service"><span className="sl-preview__radio" /><div><b>{alternative.carrier} · {alternative.service}</b><span>{alternative.estimate} · Cùng kiện hàng</span></div><strong>{formatMoney(alternative.fee)}</strong></div>
        <div className="sl-preview__decision"><Truck size={20} aria-hidden="true" /><div><b>So sánh trong nhóm đủ điều kiện</b><span>Giá và thời gian trong khung này là dữ liệu mẫu.</span></div></div>
      </>}
      {mode === 'journey' && <>
        <div className="sl-preview__heading"><div><h3>{order.id} · {order.customer}</h3><p>{order.product} · {order.quantity} {order.unit}</p></div><Chip>{DEMO_STAGES[step]}</Chip></div>
        {step === 0 && <><PreviewTable headers={['Mặt hàng', 'Số lượng', 'Tiền hàng']} rows={[[order.product, `${order.quantity} ${order.unit}`, formatMoney(facts.total)]]} /><div className="sl-preview__decision"><ClipboardList size={22} aria-hidden="true" /><div><b>Đã giữ {order.quantity} thùng cho đơn</b><span>Tồn thực chưa giảm khi mới tạo đơn.</span></div></div></>}
        {step === 1 && <><div className="sl-preview__parcel"><Package size={42} strokeWidth={1.3} aria-hidden="true" /><div><b>{order.quantity} kiện riêng · đúng quy cách</b><p>{order.dimensions} · {order.parcelWeight.toLocaleString('vi-VN')} kg / kiện</p><span>Tổng khối lượng {facts.totalWeight.toLocaleString('vi-VN')} kg</span></div></div><div className="sl-preview__decision"><Check size={22} aria-hidden="true" /><div><b>Đã kiểm tra kiện chuẩn</b><span>Dùng lại thông tin từ mặt hàng trong đơn.</span></div></div></>}
        {step === 2 && <><div className="sl-preview__parcel"><Truck size={38} strokeWidth={1.3} aria-hidden="true" /><div><b>{order.carrier} · {order.service}</b><p>{order.route} · {order.estimate}</p><strong>{formatMoney(order.confirmedFee)}</strong></div></div><div className="sl-preview__decision"><Check size={20} aria-hidden="true" /><div><b>Báo giá theo {order.quantity} kiện đã xác nhận</b><span>Chỉ đặt giao khi người phụ trách xác nhận.</span></div></div></>}
        {step === 3 && <ol className="sl-preview__timeline">{DEMO_MILESTONES.map(([label, time], i) => <li key={label}><span className={i === DEMO_MILESTONES.length - 1 ? 'is-current' : ''}><Check size={12} aria-hidden="true" /></span><b>{label}</b><time>{time}</time></li>)}</ol>}
        {step === 4 && <><dl className="sl-preview__costs">{[['Giá sơ bộ', order.preliminaryFee], ['Sau xác nhận kiện', order.confirmedFee], ['Chi phí thực thu', order.actualFee]].map(([label, fee]) => <div key={label}><dt>{label}</dt><dd>{formatMoney(fee)}</dd></div>)}</dl><div className="sl-preview__decision"><ClipboardList size={22} aria-hidden="true" /><div><b>Chênh lệch {formatMoney(facts.difference)}</b><span>Cần kiểm tra phụ phí trước khi xác nhận đối chiếu.</span></div></div></>}
      </>}
      {mode === 'owner' && <>
        <div className="sl-preview__heading"><div><h3>Tổng quan công việc</h3><p>Chủ cơ sở</p></div><Chip>Tổng hợp</Chip></div>
        <div className="sl-preview__stats"><div><span>Đơn cần xử lý</span><strong>{overview.pendingOrders}</strong></div><div><span>Khách đến kỳ</span><strong>{overview.dueCustomers}</strong></div><div><span>Mặt hàng cần xem</span><strong>{overview.reviewProducts}</strong></div></div>
        <PreviewTable headers={['Đơn hàng', 'Tiền hàng', 'Trạng thái']} rows={[[order.id, formatMoney(facts.total), overview.orderStatus]]} />
      </>}
      {mode === 'warehouse' && <>
        <div className="sl-preview__heading"><div><h3>Chuẩn bị đơn {order.id}</h3><p>Nhân viên kho</p></div><Chip>Chờ chuẩn bị</Chip></div>
        <PreviewTable headers={['Mặt hàng', 'Số lượng', 'Quy cách']} rows={[[order.product, `${order.quantity} ${order.unit}`, order.dimensions]]} />
        <div className="sl-preview__parcel"><Package size={30} aria-hidden="true" /><div><b>{order.quantity} kiện cần xác nhận</b><p>{order.parcelWeight.toLocaleString('vi-VN')} kg / kiện · {order.customer}</p><span>Chờ kiểm tra và bàn giao</span></div></div>
      </>}
    </div>
  </div>;
}
