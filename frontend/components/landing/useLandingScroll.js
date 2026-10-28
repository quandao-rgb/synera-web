'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

export function useLandingScroll(root, wrapper, content, authMode) {
  const smoother = useRef(null);
  const authOpen = useRef(Boolean(authMode));
  const isAuthOpen = Boolean(authMode);

  useGSAP(() => {
    const host = root.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const media = gsap.matchMedia();
    let anchorFocus = false;
    const offset = () => (host.querySelector('.sl-header')?.getBoundingClientRect().height || 82) + 16;

    media.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
      const instance = ScrollSmoother.create({
        wrapper: wrapper.current, content: content.current,
        smooth: 0.8, smoothTouch: false, effects: false, normalizeScroll: false,
        onFocusIn: (self, event) => {
          // Header/dialog focus must not move the page; anchors handle their own focus.
          if (!anchorFocus && content.current?.contains(event.target)) {
            const rect = event.target.getBoundingClientRect();
            if (rect.top < offset() || rect.bottom > window.innerHeight - 16) {
              self.scrollTo(event.target, false, `top ${offset()}px`);
            }
          }
          return false;
        },
      });
      smoother.current = instance;
      if (authOpen.current) instance.paused(true, true);
      // GSAP also reinitializes existing child ScrollTriggers against this wrapper.
      ScrollTrigger.refresh();
      return () => {
        if (smoother.current === instance) smoother.current = null;
        const remaining = ScrollTrigger.getAll().filter(trigger => trigger !== instance.scrollTrigger && trigger.scroller === wrapper.current);
        if (ScrollSmoother.get() === instance) instance.kill();
        // Media changes must return child animations to the native viewport too.
        remaining.forEach(trigger => {
          trigger.vars.scroller = window;
          trigger.init(trigger.vars, trigger.animation);
        });
        ScrollTrigger.refresh();
      };
    });

    const findTarget = hash => {
      if (!hash || hash === '#') return content.current.querySelector('.sl-hero');
      if (!hash.startsWith('#') || hash.startsWith('#/')) return null;
      try {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        return target && content.current.contains(target) ? target : null;
      } catch { return null; }
    };
    const scrollToTarget = (target, animate) => {
      if (smoother.current) smoother.current.scrollTo(target, animate && !reduced.matches, `top ${offset()}px`);
      else window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset()), behavior: animate && !reduced.matches ? 'smooth' : 'instant' });
    };
    const temporaryTabs = new Map();
    const focusTarget = target => {
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
        const restore = () => { target.removeAttribute('tabindex'); temporaryTabs.delete(target); };
        temporaryTabs.set(target, restore);
        target.addEventListener('blur', restore, { once: true });
      }
      anchorFocus = true;
      target.focus({ preventScroll: true });
      anchorFocus = false;
    };
    const onClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link || link.hasAttribute('download') || link.target && link.target !== '_self') return;
      const hash = link.getAttribute('href');
      const target = findTarget(hash);
      if (!target) return;
      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(window.history.state, '', hash);
      focusTarget(target);
      scrollToTarget(target, true);
    };
    let frame = 0;
    const syncHash = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = findTarget(window.location.hash);
        if (target) scrollToTarget(target, false);
      });
    };
    host.addEventListener('click', onClick);
    window.addEventListener('popstate', syncHash);
    window.addEventListener('hashchange', syncHash);
    if (window.location.hash) syncHash();
    return () => {
      host.removeEventListener('click', onClick);
      window.removeEventListener('popstate', syncHash);
      window.removeEventListener('hashchange', syncHash);
      cancelAnimationFrame(frame);
      temporaryTabs.forEach((restore, target) => { target.removeEventListener('blur', restore); target.removeAttribute('tabindex'); });
      media.revert();
    };
  }, { scope: root });

  useEffect(() => {
    authOpen.current = isAuthOpen;
    const instance = smoother.current;
    if (!instance) return;
    instance.paused(isAuthOpen, true);
    return () => { if (smoother.current === instance) instance.paused(false); };
  }, [isAuthOpen]);
}
