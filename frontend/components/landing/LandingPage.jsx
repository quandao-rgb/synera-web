'use client';
import { useEffect, useRef, useState } from 'react';
import { useLandingMotion } from './useLandingMotion';
import { useLandingScroll } from './useLandingScroll';
import { Package, ShoppingBag, Boxes, X } from 'lucide-react';
import HeroSection, { HeroHeader } from './HeroSection';
import Features from './Features';
import ContentSection, { ShippingContext, RolesSection } from './ContentSection';
import Pricing from './Pricing';
import FAQs from './FAQs';
import CallToAction from './CallToAction';
import Footer from './Footer';
import AuthDialog from './AuthDialog';

export default function LandingPage({ user, authMode, openAuth, closeAuth, onSuccess, onLogout, notice, feedback, clearFeedback, runtime }) {
  const [solution, setSolution] = useState('inventory');
  const root = useRef(null);
  const wrapper = useRef(null), content = useRef(null);
  useLandingScroll(root, wrapper, content, authMode);
  useLandingMotion(root, content);
  useEffect(() => {
    const landing = root.current;
    if (!landing) return;
    let activeButton = null;
    const clearGlow = button => {
      button?.style.setProperty('--lit', '0');
      if (activeButton === button) activeButton = null;
    };
    const onPointerMove = event => {
      if (event.pointerType !== 'mouse' || event.buttons !== 0) return;
      const button = event.target.closest('button, .sl-button');
      if (!button || !landing.contains(button)) {
        clearGlow(activeButton);
        return;
      }
      if (activeButton && activeButton !== button) clearGlow(activeButton);
      const bounds = button.getBoundingClientRect();
      button.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
      button.style.setProperty('--my', `${event.clientY - bounds.top}px`);
      button.style.setProperty('--lit', '1');
      activeButton = button;
    };
    const onPointerOut = event => {
      const button = event.target.closest('button, .sl-button');
      if (button && !button.contains(event.relatedTarget)) clearGlow(button);
    };
    const onPointerDown = event => {
      if (event.pointerType === 'mouse') clearGlow(activeButton);
    };
    landing.addEventListener('pointermove', onPointerMove);
    landing.addEventListener('pointerout', onPointerOut);
    landing.addEventListener('pointerdown', onPointerDown);
    return () => {
      landing.removeEventListener('pointermove', onPointerMove);
      landing.removeEventListener('pointerout', onPointerOut);
      landing.removeEventListener('pointerdown', onPointerDown);
      clearGlow(activeButton);
    };
  }, []);
  return <div className="synera-landing" ref={root} data-landing-motion="gsap"><div className="sl-scroll-progress" aria-hidden="true" /><a className="sl-skip" href="#sl-main">Đến nội dung giới thiệu</a><HeroHeader openAuth={openAuth} user={user} onLogout={onLogout} onSolution={setSolution} />
    <div ref={wrapper} className="sl-smooth-wrapper"><div ref={content} className="sl-smooth-content">
    {feedback && <div className="sl-feedback" role="alert">{feedback}<button aria-label="Đóng thông báo" onClick={clearFeedback}><X size={18} aria-hidden="true" /></button></div>}
    <main id="sl-main"><HeroSection openAuth={openAuth} /><section className="sl-audience" aria-label="Cơ sở phù hợp"><div className="sl-container"><p>Dành cho bán sỉ, phân phối và sản xuất nhỏ.</p><div><span><Package size={21} aria-hidden="true" />Đồ uống đóng thùng</span><span><ShoppingBag size={21} aria-hidden="true" />Thực phẩm khô</span><span><Boxes size={21} aria-hidden="true" />Hàng tiêu dùng</span></div></div></section>
      <Features active={solution} onChange={setSolution} /><ContentSection /><ShippingContext /><RolesSection /><Pricing openAuth={openAuth} /><FAQs /><CallToAction openAuth={openAuth} />
    </main><Footer onSolution={setSolution} /></div></div>{authMode && <AuthDialog mode={authMode} onModeChange={openAuth} onClose={closeAuth} onSuccess={onSuccess} notice={notice} runtime={runtime} />}</div>;
}
