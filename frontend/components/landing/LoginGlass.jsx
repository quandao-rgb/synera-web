'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import LiquidGlass from 'liquid-glass-react';
import { loginGlassPolicy } from './login-glass-policy.mjs';

gsap.registerPlugin(useGSAP);

const STILL_POINTER = { x: 0, y: 0 };
export const LOGIN_GLASS = Object.freeze({ displacementScale: 42, blurAmount: 0.10, saturation: 122, aberrationIntensity: 0.6, elasticity: 0, cornerRadius: 24 });

/** One optical surface. Children stay in the library's separate, unfiltered content layer. */
export default function LoginGlass({ mouseContainer, children }) {
  const host = useRef(null), entered = useRef(false);
  const [environment, setEnvironment] = useState({ mounted: false, advanced: false, reactive: false });
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const transparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => {
      const policy = loginGlassPolicy({
        userAgent: navigator.userAgent,
        hasBackdrop: CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'),
        reducedMotion: motion.matches,
        reducedTransparency: transparency.matches,
        finePointer: pointer.matches,
      });
      setEnvironment({ mounted: true, ...policy });
    };
    update();
    for (const query of [motion, transparency, pointer]) query.addEventListener('change', update);
    return () => { for (const query of [motion, transparency, pointer]) query.removeEventListener('change', update); };
  }, []);

  useGSAP(() => {
    if (!environment.mounted) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (entered.current) return;
      entered.current = true;
      const groups = host.current.querySelectorAll('.synera-login__brand,h1,.synera-login__intro,.sl-field,.sl-button,.synera-login__register,.synera-login__support');
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline.fromTo(host.current, { opacity: 0, x: 14, y: 5, scale: 0.985 }, {
        opacity: 1, x: 0, y: 0, scale: 1, duration: 0.36, clearProps: 'transform,opacity',
      }, 0);
      timeline.fromTo(groups, { opacity: 0.5, y: 3 }, {
        opacity: 1, y: 0, duration: 0.18, stagger: 0.03, clearProps: 'transform,opacity',
      }, 0);
    });
    return () => media.revert();
  }, { scope: host, dependencies: [environment.mounted], revertOnUpdate: true });

  // The package reads navigator during rendering: keep SSR browser-independent.
  if (!environment.mounted) return <div ref={host} className="synera-login__glass" data-glass-renderer="static">{children}</div>;
  return <div ref={host} className="synera-login__glass" data-glass-renderer="liquid-glass-react" data-glass-fallback={!environment.advanced || undefined} data-glass-static={!environment.reactive || undefined}>
    <LiquidGlass
      {...LOGIN_GLASS}
      displacementScale={environment.advanced ? LOGIN_GLASS.displacementScale : 0}
      aberrationIntensity={environment.advanced ? LOGIN_GLASS.aberrationIntensity : 0}
      mouseContainer={mouseContainer}
      globalMousePos={environment.reactive ? undefined : STILL_POINTER}
      mouseOffset={environment.reactive ? undefined : STILL_POINTER}
      mode="standard"
      overLight
      padding="0px"
      className="synera-login__material"
      style={{ position: 'relative', top: '0px', left: '0px', width: '100%' }}
    >{children}</LiquidGlass>
  </div>;
}
