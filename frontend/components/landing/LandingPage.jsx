'use client';
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Boxes, X } from 'lucide-react';
import HeroSection, { HeroHeader } from './HeroSection';
import Features from './Features';
import ContentSection, { ShippingContext, RolesSection } from './ContentSection';
import Pricing from './Pricing';
import FAQs from './FAQs';
import CallToAction from './CallToAction';
import Footer from './Footer';
import AuthDialog from './AuthDialog';
import SyneraAudienceTruck from './SyneraAudienceTruck';

export default function LandingPage({ user, authMode, openAuth, closeAuth, onSuccess, onLogout, notice, feedback, clearFeedback, runtime }) {
  const [solution, setSolution] = useState('inventory');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.setAttribute('data-arrived', 'true'); observer.unobserve(entry.target); } }, { threshold: 0.12 });
    document.querySelectorAll('.synera-landing [data-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <div className="synera-landing"><a className="sl-skip" href="#sl-main">Đến nội dung giới thiệu</a><HeroHeader openAuth={openAuth} user={user} onLogout={onLogout} onSolution={setSolution} />
    {feedback && <div className="sl-feedback" role="alert">{feedback}<button aria-label="Đóng thông báo" onClick={clearFeedback}><X size={18} aria-hidden="true" /></button></div>}
    <main id="sl-main"><HeroSection openAuth={openAuth} /><section className="sl-audience" aria-label="Cơ sở phù hợp"><div className="sl-container"><p>Dành cho cơ sở bán sỉ, đại lý phân phối và cơ sở sản xuất nhỏ.</p><div><span><Package size={21} aria-hidden="true" />Đồ uống đóng thùng</span><span><ShoppingBag size={21} aria-hidden="true" />Thực phẩm khô</span><span><Boxes size={21} aria-hidden="true" />Hàng tiêu dùng</span></div></div><SyneraAudienceTruck disabled={Boolean(authMode)} /></section>
      <Features active={solution} onChange={setSolution} /><ContentSection /><ShippingContext /><RolesSection /><Pricing openAuth={openAuth} /><FAQs /><CallToAction openAuth={openAuth} />
    </main><Footer onSolution={setSolution} />{authMode && <AuthDialog mode={authMode} onModeChange={openAuth} onClose={closeAuth} onSuccess={onSuccess} notice={notice} runtime={runtime} />}</div>;
}
