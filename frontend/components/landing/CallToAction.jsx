// Adapted from Tailark Mist Call to Action 1. MIT © 2025 Irung.
import { ArrowRight, Play } from 'lucide-react';
export default function CallToAction({ openAuth }) {
  return <section className="sl-final-cta" aria-labelledby="sl-cta-title"><div className="sl-container" data-reveal><h2 id="sl-cta-title">Bắt đầu cùng SYNERA</h2><div className="sl-actions"><button className="sl-button" onClick={() => openAuth('register')}>Đăng ký trải nghiệm<ArrowRight size={18} aria-hidden="true" /></button><a className="sl-button sl-button--light-outline" href="#demo"><Play size={17} aria-hidden="true" />Xem demo</a></div></div></section>;
}
