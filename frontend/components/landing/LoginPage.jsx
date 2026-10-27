'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SyneraLogo from '../brand/SyneraLogo';
import { LoginForm } from './AuthDialog';
import { APP_HOME_URL } from '../../../shared/app-routes.mjs';
import { CONTACT } from './landing-data.mjs';

export default function LoginPage({ runtime = 'node', checking = false, notice = '', onSuccess }) {
  const [busy, setBusy] = useState(false);
  const glass = useRef(null);
  useEffect(() => {
    const surface = glass.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const precise = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0, field = null;
    const clear = () => {
      cancelAnimationFrame(frame); frame = 0;
      field?.removeAttribute('data-water-active'); field = null;
    };
    const move = event => {
      if (reduced.matches || !precise.matches || event.pointerType === 'touch') { clear(); return; }
      const target = event.target instanceof Element ? event.target.closest('.sl-liquid-field') : null;
      if (field !== target) { field?.removeAttribute('data-water-active'); field = target; }
      if (!field) return;
      const bounds = field.getBoundingClientRect();
      const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!field) return;
        field.style.setProperty('--water-x', x + 'px');
        field.style.setProperty('--water-y', y + 'px');
        field.setAttribute('data-water-active', 'true');
      });
    };
    surface.addEventListener('pointermove', move, { passive: true });
    surface.addEventListener('pointerleave', clear);
    surface.addEventListener('pointercancel', clear);
    reduced.addEventListener('change', clear);
    precise.addEventListener('change', clear);
    return () => {
      clear();
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', clear);
      surface.removeEventListener('pointercancel', clear);
      reduced.removeEventListener('change', clear);
      precise.removeEventListener('change', clear);
    };
  }, []);
  useEffect(() => {
    const previous = document.title;
    document.title = 'Đăng nhập — SYNERA';
    return () => { document.title = previous; };
  }, []);
  return <main className="synera-login" id="login-main">
    <div className="synera-login__visual">
      <img src="/assets/login/synera-product-environment.png" alt="SYNERA — Vận hành đồng bộ, tăng trưởng bền vững. Laptop quản lý kết nối đơn hàng, kho hàng, vận chuyển, khách hàng và báo cáo." width="1536" height="1024" fetchPriority="high" />
    </div>
    <a className="synera-login__back" href="/"><ArrowLeft size={16} aria-hidden="true" />Trang giới thiệu</a>
    <div className="synera-login__account">
      <section ref={glass} className="synera-login__form" aria-labelledby="login-title" data-ui>
        <a className="synera-login__brand" href="/" aria-label="SYNERA — Trang giới thiệu"><SyneraLogo decorative /></a>
        <h1 id="login-title">Chào mừng trở lại</h1>
        <p className="synera-login__intro">Đăng nhập để tiếp tục quản lý cơ sở của bạn.</p>
        {notice && <p className="sl-form-error" role="alert">{notice}</p>}
        {runtime === 'node'
          ? <LoginForm onSuccess={onSuccess} busy={busy || checking} setBusy={setBusy} placeholders liquidFields />
          : <div className="synera-login__external"><p>Tiếp tục bằng tài khoản ChatGPT đang dùng cho cơ sở.</p><a className="sl-button" href={`/signin-with-chatgpt?return_to=${encodeURIComponent(APP_HOME_URL)}`}>Tiếp tục bằng ChatGPT<ArrowRight size={18} aria-hidden="true" /></a></div>}
        {checking && <p className="synera-login__status" role="status">Đang kiểm tra phiên đăng nhập…</p>}
        <p className="synera-login__register">Chưa có tài khoản? <a href="/?auth=register">Đăng ký SYNERA</a></p>
        <footer className="synera-login__support"><span>Cần hỗ trợ đăng nhập?</span><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></footer>
      </section>
    </div>
  </main>;
}
