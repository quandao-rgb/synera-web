// Adapted from Tailark Mist Footer 2. MIT © 2025 Irung.
import { Brand } from './HeroSection';
import { CONTACT } from './landing-data.mjs';
export default function Footer({ onSolution }) {
  return <footer className="sl-footer"><div className="sl-container"><div className="sl-footer__grid"><div><Brand /><p>Quản lý phân phối và quan hệ khách hàng, từ kho đến giao nhận.</p></div><div><h3>Sản phẩm</h3>{[['inventory','Gợi ý bổ sung hàng'],['customers','Khách mua lại'],['shipping','Vận chuyển']].map(([id,label])=><a key={id} href="#solutions" onClick={()=>onSolution(id)}>{label}</a>)}<a href="#pricing">Free & Pro</a></div><div><h3>Hỗ trợ</h3><a href="#workflow">Cách hoạt động</a><a href="#demo">Xem demo</a><a href="#support">Câu hỏi thường gặp</a></div><div><h3>Liên hệ</h3><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></div></div><p className="sl-footer__copyright">© {new Date().getFullYear()} SYNERA.</p></div></footer>;
}
