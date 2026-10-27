// Adapted from Tailark Mist Hero Section 1 + header. MIT © 2025 Irung.
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown, ArrowRight, Play, Package, Users, Truck } from 'lucide-react';
import { APP_HOME_URL } from '../../lib/app-routes.mjs';
import SyneraLogo from '../brand/SyneraLogo';
import { SOLUTIONS } from './landing-data.mjs';

export function Brand({ light = false }) { return <a className={`sl-brand${light ? ' sl-brand--light' : ''}`} href="/" aria-label="SYNERA — về đầu trang"><SyneraLogo light={light} decorative /></a>; }

export function HeroHeader({ openAuth, user, onLogout, onSolution }) {
  const [mobile, setMobile] = useState(false);
  const toggle = useRef(null), solutionsMenu = useRef(null);
  useEffect(() => {
    const close = event => { if (event.key !== 'Escape') return; if (solutionsMenu.current?.open) { solutionsMenu.current.open = false; solutionsMenu.current.querySelector('summary')?.focus(); } else if (mobile) { setMobile(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [mobile]);
  return <header className="sl-header"><div className="sl-container sl-header__inner">
    <Brand />
    <nav id="sl-navigation" aria-label="Điều hướng giới thiệu" className={mobile ? 'is-open' : ''}>
      <details className="sl-solutions-menu" ref={solutionsMenu}><summary>Giải pháp <ChevronDown size={15} aria-hidden="true" /></summary><div className="sl-solutions-menu__panel">{SOLUTIONS.map((item, index) => { const Icon = [Package, Users, Truck][index]; return <a key={item.id} href="#solutions" onClick={() => { onSolution(item.id); setMobile(false); if (solutionsMenu.current) solutionsMenu.current.open = false; }}><Icon size={20} aria-hidden="true" /><span><b>{item.label}</b><small>{['Kho và đơn hàng', 'Lịch sử mua và liên hệ', 'Kiện hàng và phương án giao'][index]}</small></span><ArrowRight size={15} aria-hidden="true" /></a>; })}</div></details>
      <a href="#workflow" onClick={() => setMobile(false)}>Cách hoạt động</a><a href="#pricing" onClick={() => setMobile(false)}>Bảng giá</a><a href="#support" onClick={() => setMobile(false)}>Hỗ trợ</a>
    </nav>
    <div className="sl-header__account">{user ? <><a href={APP_HOME_URL} className="sl-button sl-button--small">Vào ứng dụng <ArrowRight size={16} aria-hidden="true" /></a><button className="sl-login" onClick={onLogout}>Đăng xuất</button></> : <><button className="sl-login" onClick={() => openAuth('login')}>Đăng nhập</button><button className="sl-button sl-button--small" onClick={() => openAuth('register')}>Đăng ký</button></>}</div>
    <button className="sl-menu-toggle" ref={toggle} aria-expanded={mobile} aria-controls="sl-navigation" aria-label={mobile ? 'Đóng menu giới thiệu' : 'Mở menu giới thiệu'} onClick={() => setMobile(value => !value)}>{mobile ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
  </div></header>;
}

export default function HeroSection({ openAuth }) {
  return <section className="sl-hero" aria-labelledby="sl-hero-title"><video className="sl-background-video" aria-hidden="true" autoPlay loop muted playsInline preload="metadata"><source src="/assets/landing/background-lp.mp4" type="video/mp4" /></video><div className="sl-container sl-hero__grid">
    <div className="sl-hero__copy" data-reveal><h1 id="sl-hero-title">Quản lý phân phối<br /><span>chủ động từ kho đến giao hàng</span></h1><p>Kết nối kho, khách hàng và vận chuyển trên cùng hệ thống. Hỗ trợ bổ sung hàng, liên hệ khách mua lại và lựa chọn phương án giao phù hợp.</p><div className="sl-actions"><button className="sl-button" onClick={() => openAuth('register')}>Đăng ký trải nghiệm <ArrowRight size={18} aria-hidden="true" /></button><a className="sl-button sl-button--light-outline" href="#demo"><Play size={17} aria-hidden="true" />Xem demo</a></div></div>
  </div></section>;
}
