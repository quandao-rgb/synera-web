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
    <div className="synera-login__sheet">
      <div className="synera-login__account">
        <header className="synera-login__header">
          <a href="/" aria-label="SYNERA — Trang giới thiệu"><SyneraLogo decorative /></a>
          <a className="synera-login__back" href="/"><ArrowLeft size={16} aria-hidden="true" />Trang giới thiệu</a>
        </header>
        <section className="synera-login__form" aria-labelledby="login-title" data-ui>
          <h1 id="login-title">Đăng nhập SYNERA</h1>
          <p className="synera-login__intro">Tiếp tục quản lý cơ sở của bạn.</p>
          {notice && <p className="sl-form-error" role="alert">{notice}</p>}
          {runtime === 'node'
            ? <LoginForm onSuccess={onSuccess} busy={busy || checking} setBusy={setBusy} />
            : <div className="synera-login__external"><p>Tiếp tục bằng tài khoản ChatGPT đang dùng cho cơ sở.</p><a className="sl-button" href={`/signin-with-chatgpt?return_to=${encodeURIComponent(APP_HOME_URL)}`}>Tiếp tục bằng ChatGPT<ArrowRight size={18} aria-hidden="true" /></a></div>}
          {checking && <p className="synera-login__status" role="status">Đang kiểm tra phiên đăng nhập…</p>}
          <p className="synera-login__register">Chưa có tài khoản? <a href="/?auth=register">Đăng ký SYNERA</a></p>
        </section>
        <footer className="synera-login__support"><span>Cần hỗ trợ đăng nhập?</span><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></footer>
      </div>
      <aside className="synera-login__visual" aria-label="Kho hàng và phân phối">
        <div className="synera-login__photo"><img src="/assets/login/warehouse-maor-attias.jpg" alt="Các kệ hàng và thùng carton được sắp xếp dọc lối đi trong kho" width="1000" height="1500" fetchPriority="high" /></div>
        <div className="synera-login__caption"><p>Kho, đơn hàng và giao nhận.<br />Kết nối trên cùng hệ thống.</p><a href="https://www.pexels.com/photo/boxes-on-shelves-inside-a-warehouse-5156696/" target="_blank" rel="noreferrer">Ảnh: Maor Attias / Pexels</a></div>
      </aside>
    </div>
  </main>;
}
