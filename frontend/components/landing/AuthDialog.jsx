import { useEffect, useId, useRef, useState } from 'react';
import { X, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { APP_HOME_URL } from '../../../shared/app-routes.mjs';
import SyneraLogo from '../brand/SyneraLogo';
import { CONTACT } from './landing-data.mjs';

async function sendAuth(action, form) {
  const response = await fetch(`/api/auth/${action}`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.authenticated !== true || !result.user?.id) throw new Error(result.error || 'Chưa hoàn tất thao tác. Vui lòng thử lại.');
  // A successful HTTP response alone is insufficient: verify the HttpOnly session
  // was established and belongs to the same account before opening the app.
  const check = await fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' });
  const verified = await check.json();
  if (!check.ok || !verified.authenticated || verified.user?.id !== result.user.id || verified.homeRoute !== APP_HOME_URL) throw new Error('Chưa xác nhận được phiên đăng nhập. Vui lòng kiểm tra cookie trình duyệt và thử đăng nhập lại.');
  return verified.user;
}

function PasswordField({ name = 'password', label = 'Mật khẩu', registering = false }) {
  const [visible, setVisible] = useState(false), id = useId();
  return <div className="sl-field"><label htmlFor={id}>{label}</label><span className="sl-password"><input id={id} name={name} type={visible ? 'text' : 'password'} required minLength={registering ? 12 : 1} maxLength={128} autoComplete={registering ? 'new-password' : 'current-password'} aria-describedby={registering && name === 'password' ? `${id}-hint` : undefined} /><button type="button" aria-label={`${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></span>{registering && name === 'password' && <small id={`${id}-hint`}>Từ 12 đến 128 ký tự. Bạn có thể dán hoặc dùng trình quản lý mật khẩu.</small>}</div>;
}

function useAuthSubmit(action, { onSuccess, setBusy }) {
  const [error, setError] = useState(''), errorRef = useRef(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  return { error, errorRef, submit: async event => {
    event.preventDefault(); const form = event.currentTarget;
    setError(''); setBusy(true);
    try { const user = await sendAuth(action, form); onSuccess(user); }
    catch (failure) { setError(failure instanceof TypeError ? 'Không kết nối được hệ thống. Vui lòng kiểm tra mạng rồi thử lại.' : failure.message || 'Chưa hoàn tất thao tác. Vui lòng thử lại.'); }
    finally { setBusy(false); }
  } };
}

function LoginForm(props) {
  const { error, errorRef, submit } = useAuthSubmit('login', props);
  return <form aria-label="Biểu mẫu đăng nhập" onSubmit={submit} aria-busy={props.busy}>
    <label className="sl-field"><span>Email</span><input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <PasswordField />
    {error && <p className="sl-form-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
    <button className="sl-button" disabled={props.busy} type="submit">{props.busy ? 'Đang đăng nhập…' : 'Đăng nhập'}<ArrowRight size={18} aria-hidden="true" /></button>
  </form>;
}
function RegisterForm(props) {
  const { error, errorRef, submit } = useAuthSubmit('register', props);
  return <form aria-label="Biểu mẫu đăng ký" onSubmit={submit} aria-busy={props.busy}>
    <label className="sl-field"><span>Họ và tên</span><input name="name" autoComplete="name" minLength={2} maxLength={80} required /></label>
    <label className="sl-field"><span>Email</span><input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <PasswordField registering /><PasswordField name="confirmPassword" label="Nhập lại mật khẩu" registering />
    {error && <p className="sl-form-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
    <button className="sl-button" disabled={props.busy} type="submit">{props.busy ? 'Đang tạo tài khoản…' : 'Đăng ký tài khoản'}<ArrowRight size={18} aria-hidden="true" /></button>
  </form>;
}

export default function AuthDialog({ mode, onClose, onModeChange, onSuccess, notice, runtime = 'node' }) {
  const dialog = useRef(null), [busy, setBusy] = useState(false);
  useEffect(() => {
    const prior = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialog.current?.showModal();
    return () => { dialog.current?.close(); document.body.style.overflow = overflow; prior?.focus?.({ preventScroll: true }); };
  }, []);
  useEffect(() => { dialog.current?.querySelector('input')?.focus({ preventScroll: true }); }, [mode]);
  const register = mode === 'register';
  return <dialog ref={dialog} className="sl-auth" aria-labelledby="sl-auth-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} onClick={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <div className="sl-auth__heading"><div><span className="sl-auth__mark"><SyneraLogo /></span><h2 id="sl-auth-title">{register ? 'Tạo tài khoản SYNERA' : 'Đăng nhập SYNERA'}</h2><p>{register ? 'Bắt đầu kết nối công việc của cơ sở.' : 'Tiếp tục công việc trong không gian của bạn.'}</p></div><button className="sl-auth__close" aria-label="Đóng biểu mẫu tài khoản" disabled={busy} onClick={onClose}><X size={21} aria-hidden="true" /></button></div>
    {notice && <p className="sl-form-error" role="alert">{notice}</p>}
    {runtime === 'node' ? (register ? <RegisterForm key="register" onSuccess={onSuccess} busy={busy} setBusy={setBusy} /> : <LoginForm key="login" onSuccess={onSuccess} busy={busy} setBusy={setBusy} />) : <div className="sl-auth__external"><p>Phiên bản này xác thực bằng ChatGPT. Email/mật khẩu được hỗ trợ trên bản Node/local.</p><a className="sl-button" href={`/signin-with-chatgpt?return_to=${encodeURIComponent(APP_HOME_URL)}`}>Tiếp tục bằng ChatGPT<ArrowRight size={18} aria-hidden="true" /></a></div>}
    <p className="sl-auth__switch">{register ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?'} <button disabled={busy} onClick={() => onModeChange(register ? 'login' : 'register')}>{register ? 'Đăng nhập' : 'Đăng ký'}</button></p>
    <p className="sl-auth__help">Cần hỗ trợ? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
  </dialog>;
}
