'use client';
import { lazy, Suspense, useEffect, useState } from 'react';
import { APP_HOME_URL, isApplicationHash } from '../../lib/app-routes.mjs';
import LandingPage from './LandingPage';
const Interface = lazy(() => import('../../app/interface'));
function LoadingSite() { return <div className="synera-site-loading" role="status"><strong>SYNERA</strong><p>Đang mở không gian làm việc…</p></div>; }

/** @param {{ runtime?: 'node' | 'chatgpt', initialUser?: {id:string,name:string,email:string} | null }} props */
export default function SiteEntry({ runtime = 'node', initialUser = null }) {
  const [ready, setReady] = useState(false), [appRoute, setAppRoute] = useState(false), [trackingRoute, setTrackingRoute] = useState(false);
  const [user, setUser] = useState(initialUser), [checking, setChecking] = useState(runtime === 'node');
  const [authMode, setAuthMode] = useState(null), [notice, setNotice] = useState(''), [feedback, setFeedback] = useState('');
  useEffect(() => {
    const sync = () => { setAppRoute(isApplicationHash(window.location.hash)); setTrackingRoute(window.location.hash.startsWith('#/track/')); };
    sync(); setReady(true);
    if (new URLSearchParams(window.location.search).get('auth') === 'login') setAuthMode('login');
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    if (runtime !== 'node') return;
    const controller = new AbortController();
    fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal }).then(async response => {
      const session = await response.json();
      if (!response.ok) throw new Error(session.error || 'Chưa kiểm tra được phiên đăng nhập.');
      setUser(session.authenticated ? session.user : null);
    }).catch(error => { if (error.name !== 'AbortError') setNotice('Chưa kiểm tra được phiên đăng nhập. Bạn có thể đăng nhập lại tại đây.'); }).finally(() => { if (!controller.signal.aborted) setChecking(false); });
    return () => controller.abort();
  }, [runtime]);
  const openAuth = mode => { setNotice(''); setAuthMode(mode); };
  const closeAuth = () => { setAuthMode(null); setNotice(''); if (appRoute && !user) window.location.assign('/'); };
  const success = account => { setUser(account); setAuthMode(null); setNotice(''); window.location.assign(APP_HOME_URL); };
  const logout = async () => {
    if (runtime !== 'node') { window.location.assign('/signout-with-chatgpt?return_to=/'); return; }
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const result = await response.json();
      if (!response.ok || result.authenticated !== false) throw new Error(result.error || 'Chưa đăng xuất được. Vui lòng thử lại.');
      setUser(null); setFeedback('');
    } catch (error) { setFeedback(error.message); }
  };
  if (!ready || appRoute && checking && !trackingRoute) return <LoadingSite />;
  // Keep the recipient tracking route under its existing token/session checks.
  if (trackingRoute || appRoute && user) return <Suspense fallback={<LoadingSite />}><Interface /></Suspense>;
  return <LandingPage user={user} runtime={runtime} authMode={authMode || (appRoute ? 'login' : null)} openAuth={openAuth} closeAuth={closeAuth} onSuccess={success} onLogout={logout} notice={notice} feedback={feedback} clearFeedback={() => setFeedback('')} />;
}
