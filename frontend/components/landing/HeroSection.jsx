// Adapted from Tailark Mist Hero Section 1 + header. MIT © 2025 Irung.
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown, ArrowRight, Play, Package, Users, Truck, Check } from 'lucide-react';
import { APP_HOME_URL } from '../../../shared/app-routes.mjs';
import SyneraLogo from '../brand/SyneraLogo';
import { SOLUTIONS } from './landing-data.mjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Brand({ light = false }) { return <a className={`sl-brand${light ? ' sl-brand--light' : ''}`} href="/" aria-label="SYNERA — về đầu trang"><SyneraLogo light={light} decorative /></a>; }

export function HeroHeader({ openAuth, user, onLogout, onSolution }) {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef(null), solutionsMenu = useRef(null), header = useRef(null);
  useEffect(() => {
    const closeOutside = event => {
      if (header.current?.contains(event.target)) return;
      if (solutionsMenu.current) solutionsMenu.current.open = false;
      setMobile(false);
    };
    const desktop = window.matchMedia('(min-width: 901px)');
    const resize = () => { if (desktop.matches) setMobile(false); };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
      desktop.removeEventListener('change', resize);
    };
  }, []);
  useEffect(() => {
    let previous;
    const sync = () => {
      const next = window.scrollY > 24;
      if (next !== previous) { previous = next; setScrolled(next); }
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('pageshow', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('pageshow', sync);
    };
  }, []);
  useEffect(() => {
    const close = event => { if (event.key !== 'Escape') return; if (solutionsMenu.current?.open) { solutionsMenu.current.open = false; solutionsMenu.current.querySelector('summary')?.focus(); } else if (mobile) { setMobile(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [mobile]);
  return <header ref={header} className={`sl-header${scrolled ? ' is-scrolled' : ''}`}><div className="sl-container sl-header__inner">
    <Brand light />
    <nav id="sl-navigation" aria-label="Điều hướng giới thiệu" className={mobile ? 'is-open' : ''} onClick={event => {
      if (event.target.closest('a[href^="#"]')) {
        setMobile(false);
        if (solutionsMenu.current) solutionsMenu.current.open = false;
      }
    }}>
      <details className="sl-solutions-menu" ref={solutionsMenu}><summary>Giải pháp <ChevronDown size={15} aria-hidden="true" /></summary><div className="sl-solutions-menu__panel"><div className="sl-menu-intro"><b>Giải pháp cho cơ sở của bạn</b><small>Kết nối kho, khách hàng và giao nhận.</small></div>{SOLUTIONS.map((item, index) => { const Icon = [Package, Users, Truck][index]; return <a key={item.id} href="#solutions" onClick={() => { onSolution(item.id); setMobile(false); if (solutionsMenu.current) solutionsMenu.current.open = false; }}><Icon size={20} aria-hidden="true" /><span><b>{item.label}</b><small>{['Kho và đơn hàng', 'Lịch sử mua và liên hệ', 'Kiện hàng và phương án giao'][index]}</small></span><ArrowRight size={15} aria-hidden="true" /></a>; })}</div></details>
      <a href="#workflow" onClick={() => setMobile(false)}>Cách hoạt động</a><a href="#pricing" onClick={() => setMobile(false)}>Bảng giá</a><a href="#support" onClick={() => setMobile(false)}>Hỗ trợ</a>
    </nav>
    <div className="sl-header__account">{user ? <><a href={APP_HOME_URL} className="sl-button sl-button--small">Vào ứng dụng <ArrowRight size={16} aria-hidden="true" /></a><button className="sl-login" onClick={onLogout}>Đăng xuất</button></> : <><button className="sl-login" onClick={() => openAuth('login')}>Đăng nhập</button><button className="sl-button sl-button--small" onClick={() => openAuth('register')}>Trải nghiệm ngay</button></>}</div>
    <button className="sl-menu-toggle" ref={toggle} aria-expanded={mobile} aria-controls="sl-navigation" aria-label={mobile ? 'Đóng menu giới thiệu' : 'Mở menu giới thiệu'} onClick={() => setMobile(value => !value)}>{mobile ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
  </div></header>;
}

export default function HeroSection({ openAuth }) {
  const video = useRef(null);
  useEffect(() => {
    const element = video.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = true;
    element.muted = true;
    element.defaultMuted = true;
    element.setAttribute('muted', '');
    const sync = () => {
      if (reduced.matches || document.hidden || !inView) element.pause();
      else element.play().catch(() => {}); // Browsers may block autoplay.
    };
    // Use the same scroll coordinates as ScrollSmoother and the page animations.
    const visibility = ScrollTrigger.create({
      trigger: element.closest('.sl-hero'), start: 'top bottom', end: 'bottom top',
      onToggle: self => { inView = self.isActive; sync(); },
      onRefresh: self => { inView = self.isActive; sync(); },
    });
    inView = visibility.isActive;
    element.addEventListener('canplay', sync);
    element.addEventListener('loadeddata', sync);
    document.addEventListener('pointerdown', sync, { passive: true });
    document.addEventListener('keydown', sync);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      visibility.kill();
      element.removeEventListener('canplay', sync);
      element.removeEventListener('loadeddata', sync);
      document.removeEventListener('pointerdown', sync);
      document.removeEventListener('keydown', sync);
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      element.pause();
    };
  }, []);
  return <section className="sl-hero" aria-labelledby="sl-hero-title">
    <video ref={video} className="sl-background-video" aria-hidden="true" autoPlay loop muted playsInline preload="metadata"><source src="/assets/landing/background-lp.mp4?v=2" type="video/mp4" /></video>
    <div className="sl-container sl-hero__grid">
      <div className="sl-hero__copy" data-reveal>
        <span className="sl-eyebrow">Nền tảng quản lý phân phối</span>
        <h1 id="sl-hero-title">Quản lý gọn hơn.<br /><span>Kết nối liền mạch.</span></h1>
        <p>Từ kho, khách hàng đến giao nhận.<br />Một nền tảng cho mọi khâu vận hành.</p>
        <div className="sl-actions"><button className="sl-button" onClick={() => openAuth('register')}>Đăng ký trải nghiệm <ArrowRight size={18} aria-hidden="true" /></button><a className="sl-button sl-button--outline" href="#demo"><Play size={17} aria-hidden="true" />Khám phá demo</a></div>
        <div className="sl-hero__benefits"><span><Check size={15} aria-hidden="true" />Không cần cài đặt</span><span><Check size={15} aria-hidden="true" />Dùng trên mọi thiết bị</span></div>
      </div>
    </div>
  </section>;
}
