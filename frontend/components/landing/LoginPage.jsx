'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SyneraLogo from '../brand/SyneraLogo';
import { LoginForm } from './AuthDialog';
import { APP_HOME_URL } from '../../../shared/app-routes.mjs';
import { CONTACT } from './landing-data.mjs';

export default function LoginPage({ runtime = 'node', checking = false, notice = '', onSuccess }) {
  const [busy, setBusy] = useState(false);
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
      <section className="synera-login__form" aria-labelledby="login-title" data-ui>
        <a className="synera-login__brand" href="/" aria-label="SYNERA — Trang giới thiệu"><SyneraLogo decorative /></a>
        <h1 id="login-title">Chào mừng trở lại</h1>
        <p className="synera-login__intro">Đăng nhập để tiếp tục quản lý cơ sở của bạn.</p>
        {notice && <p className="sl-form-error" role="alert">{notice}</p>}
        {runtime === 'node'
          ? <LoginForm onSuccess={onSuccess} busy={busy || checking} setBusy={setBusy} placeholders />
          : <div className="synera-login__external"><p>Tiếp tục bằng tài khoản ChatGPT đang dùng cho cơ sở.</p><a className="sl-button" href={`/signin-with-chatgpt?return_to=${encodeURIComponent(APP_HOME_URL)}`}>Tiếp tục bằng ChatGPT<ArrowRight size={18} aria-hidden="true" /></a></div>}
        {checking && <p className="synera-login__status" role="status">Đang kiểm tra phiên đăng nhập…</p>}
        <p className="synera-login__register">Chưa có tài khoản? <a href="/?auth=register">Đăng ký SYNERA</a></p>
        <footer className="synera-login__support"><span>Cần hỗ trợ đăng nhập?</span><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></footer>
      </section>
    </div>
  </main>;
}
