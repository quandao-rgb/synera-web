import { Building2, ChevronDown, Settings, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useRef } from 'react';

const providers = {
  grab: ['grab.png', 'Grab'], spx: ['spx.svg', 'SPX'],
  ghn: ['ghn.png', 'GHN'], ghtk: ['ghtk.svg', 'GHTK'],
};

/** Presentation only: provider identity never changes the supplied quote. */
export function CarrierLogo({ name = '', providerId = '', className = '' }) {
  const key = String(providerId || name).toLowerCase().split(':')[0];
  const provider = providers[key];
  return <span className={`carrier-logo ${className}`} data-provider={provider ? key : 'sample'} aria-hidden="true">
    {provider ? <img src={`/assets/carriers/${provider[0]}`} alt="" width="76" height="32" /> : <span className="sample-carrier-mark"><Building2 size={18} /><b>{String(name).match(/[ABC]$/)?.[0] || 'VC'}</b></span>}
  </span>;
}

export function ProductImage({ id = '', image = '', className = '' }) {
  const file = ['SP01', 'SP02', 'SP03', 'SP04', 'SP05', 'SP06'].includes(id) ? id.toLowerCase() : 'parcel';
  return <img className={`product-visual ${className}`} src={image || `/assets/products/${file}.svg`} width="48" height="48" alt="" aria-hidden="true" loading="lazy" title={image ? 'Ảnh mặt hàng' : 'Minh họa hàng mẫu'} />;
}

export function WorkspacePhoto({ compact = false }) {
  return <figure className={`workspace-photo${compact ? ' workspace-photo--compact' : ''}`}>
    <img src="/assets/photos/workspace-tan-binh.png" alt="Ảnh kho do chủ cơ sở cung cấp" width="1672" height="941" loading="lazy" />
  </figure>;
}

export function AccountDetails({ account, owner }) {
  return <section className="panel account-details"><div className="panel-head"><h2>Tài khoản đang sử dụng</h2></div><div className="panel-body"><span className="account-avatar"><UserRound size={22} aria-hidden="true" /></span><div><strong>{account?.name || (owner ? 'Chủ cơ sở' : 'Nhân viên kho')}</strong>{account?.email && <p>{account.email}</p>}<span><ShieldCheck size={14} aria-hidden="true" />{owner ? 'Chủ cơ sở' : 'Nhân viên kho'}</span></div></div></section>;
}

/** Only UI disclosure state. Links and logout reuse existing destinations/callback. */
export function AccountMenu({ account, owner, onLogout, logoutPending }) {
  const disclosure = useRef(null);
  const name = account?.name || (owner ? 'Chủ cơ sở' : 'Nhân viên kho');
  const initials = name.trim().split(/\s+/).slice(-2).map(part => part[0]).join('').toUpperCase();
  useEffect(() => {
    const close = event => {
      if (!disclosure.current?.open) return;
      if (event.type === 'keydown' && event.key === 'Escape') { disclosure.current.open = false; disclosure.current.querySelector('summary')?.focus(); }
      if (event.type === 'pointerdown' && !disclosure.current.contains(event.target)) disclosure.current.open = false;
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, []);
  return <details className="account-menu" ref={disclosure}>
    <summary aria-label={`Tài khoản ${name}`}><span className="account-avatar">{initials}</span><span className="account-summary"><strong>{name}</strong><small>{owner ? 'Chủ cơ sở' : 'Nhân viên kho'}</small></span><ChevronDown size={15} aria-hidden="true" /></summary>
    <div className="account-menu__panel">
      <div className="account-menu__identity"><span className="account-avatar">{initials}</span><div><strong>{name}</strong>{account?.email && <small>{account.email}</small>}</div></div>
      <p className="account-menu__role"><ShieldCheck size={15} aria-hidden="true" />{owner ? 'Chủ cơ sở' : 'Nhân viên kho'} · Cơ sở Tân Bình</p>
      <a href="#/settings" onClick={() => { disclosure.current.open = false; }}><Settings size={17} aria-hidden="true" />Thiết lập tài khoản & cơ sở</a>
      {onLogout && <button type="button" disabled={logoutPending} aria-busy={logoutPending} onClick={onLogout}><LogOut size={17} aria-hidden="true" />{logoutPending ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>}
      <span className="account-menu__footer"><UserRound size={13} aria-hidden="true" /> Phiên làm việc hiện tại</span>
    </div>
  </details>;
}
