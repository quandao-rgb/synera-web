'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const motionQuery = '(prefers-reduced-motion: no-preference)';
const clearProps = 'transform,opacity,visibility';

export function useLandingMotion(root, content) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ motion: motionQuery, desktop: '(min-width: 901px)' }, ({ conditions }) => {
      if (!conditions.motion) return;
      const host = root.current;
      const select = gsap.utils.selector(host);
      const distance = conditions.desktop ? 20 : 12;
      const entrances = [];
      const intro = gsap.timeline({ defaults: { duration: 0.45, ease: 'power3.out', clearProps } });
      intro.from('.sl-header__inner', { y: -10, opacity: 0.2 }, 0)
        .from('.sl-eyebrow', { y: 12, opacity: 0.2 }, 0.04)
        .from('.sl-hero h1', { y: distance, opacity: 0.15 }, 0.08)
        .from('.sl-hero__copy > p', { y: 18, opacity: 0.2 }, 0.2)
        .from('.sl-hero .sl-actions > *', { y: 14, opacity: 0.2, stagger: 0.09 }, 0.32)
        .from('.sl-hero__benefits > span', { y: 8, opacity: 0.2, stagger: 0.06 }, 0.5);
      entrances.push({ targets: select('.sl-header__inner,.sl-hero__copy'), tween: intro });

      // Each group owns its entrance; nested product UI is animated separately.
      const reveal = (targets, trigger) => {
        if (!targets.length) return;
        const tween = gsap.from(targets, {
          y: distance, opacity: 0.2, duration: 0.45, stagger: 0.045,
          ease: 'power3.out', clearProps,
          scrollTrigger: { trigger, start: 'top 90%', once: true },
        });
        entrances.push({ targets, tween });
      };
      select('.sl-section-heading').forEach(heading => reveal([heading], heading));
      [
        ['.sl-audience .sl-container > *', '.sl-audience'],
        ['.sl-solution-tabs', '.sl-solution-tabs'],
        ['.sl-demo-anchor', '.sl-demo-anchor'],
        ['.sl-shipping-flow > *', '.sl-shipping-flow'],
        ['.sl-role-grid > article', '.sl-role-grid'],
        ['.sl-pricing__grid > article', '.sl-pricing__grid'],
        ['.sl-faq__grid > [data-reveal]', '.sl-faq__grid'],
        ['.sl-final-cta h2,.sl-final-cta .sl-actions > *', '.sl-final-cta'],
        ['.sl-footer__grid > div,.sl-footer__copyright', '.sl-footer'],
      ].forEach(([targets, trigger]) => reveal(select(targets), select(trigger)[0]));
      // Individual FAQ triggers avoid long stagger delays on small screens.
      select('.sl-faq details').forEach(item => reveal([item], item));

      gsap.fromTo('.sl-scroll-progress', { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: content.current, start: 'top top', end: 'bottom bottom', scrub: true },
      });
      // Only the decorative video moves with scroll, leaving text and controls stable.
      if (conditions.desktop) gsap.fromTo('.sl-background-video', { yPercent: -4, scale: 1.12 }, {
        yPercent: 4, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: select('.sl-hero')[0], start: 'top top', end: 'bottom top', scrub: 0.6 },
      });

      // Keyboard navigation must never wait for a scroll entrance to finish.
      const onFocus = event => entrances.forEach(({ targets, tween }) => {
        if (targets.some(target => target.contains(event.target))) tween.progress(1);
      });
      host.addEventListener('focusin', onFocus);

      // FAQ expansion, fonts and demo changes can alter the document height.
      let frame = 0;
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      resize.observe(content.current);
      return () => {
        host.removeEventListener('focusin', onFocus);
        resize.disconnect();
        cancelAnimationFrame(frame);
      };
    });
    return () => media.revert();
  }, { scope: root });
}

export function usePreviewMotion(root, dependencies, enabled = true) {
  useGSAP(() => {
    if (!enabled) return;
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      const host = root.current;
      // Inactive tabs stay inert/hidden; never override their visibility.
      if (host.closest('[aria-hidden="true"]')) return;
      gsap.from(host.querySelectorAll('.sl-preview__content > *'), {
        y: 9, opacity: 0.25, duration: 0.32, stagger: 0.035,
        ease: 'power2.out', clearProps,
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [...dependencies, enabled], revertOnUpdate: true });
}

export function useSolutionMotion(root, active) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      gsap.from('.sl-solution-panel.is-active > *', {
        y: 14, opacity: 0.3, duration: 0.4, stagger: 0.06,
        ease: 'power3.out', clearProps,
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [active], revertOnUpdate: true });
}

export function useAuthMotion(root, mode) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      gsap.from(root.current, { y: 12, scale: 0.98, opacity: 0.3, duration: 0.25, ease: 'power2.out', clearProps });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [mode], revertOnUpdate: true });
}
