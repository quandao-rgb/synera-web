"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
const motionQueries = { all: "all", reduce: "(prefers-reduced-motion: reduce)" };

export function useDialogMotion(ref, open) {
  useGSAP(() => {
    if (!open || !ref.current) return;
    const mm = gsap.matchMedia();
    mm.add(motionQueries, ({ conditions }) => {
      if (conditions.reduce) return;
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 10, scale: 0.985 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.24,
        ease: "power3.out", clearProps: "transform,opacity,visibility",
      });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [open], revertOnUpdate: true });
}

export function MotionShell({ children, routeKey, role, collapsed, mobile, ...props }) {
  const root = useRef(null);
  const state = useRef({ collapsed, mobile });
  state.current = { collapsed, mobile };
  const updateSidebar = useRef(null);
  const updateIndicator = useRef(null);

  // Delegation also covers controls mounted later, without per-button listeners.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (media) => {
      const host = root.current;
      const selector = ".button,.icon-button,.sidebar-collapse,.sidebar nav a,.sidebar-bottom > a,.sidebar-bottom > button";
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      const target = (event) => {
        const el = event.target instanceof Element ? event.target.closest(selector) : null;
        return el && host.contains(el) ? el : null;
      };
      const usable = (el) => el && !el.matches(":disabled,[aria-disabled=true]") && !el.closest("[inert]");
      media.add("respond", (el, pressed = false, hovering = false) => {
        if (!el) return;
        const nav = el.closest(".sidebar nav,.sidebar-bottom");
        gsap.to(el, {
          scale: pressed ? 0.97 : 1,
          y: !nav && hovering && !pressed ? -1 : 0,
          duration: pressed ? 0.09 : 0.2, ease: "power2.out", overwrite: "auto",
          ...(!pressed && !hovering ? { clearProps: "transform" } : {}),
        });
      });
      const over = (e) => {
        const el = target(e);
        if (finePointer.matches && usable(el) && !el.contains(e.relatedTarget)) media.respond(el, false, true);
      };
      const out = (e) => {
        const el = target(e);
        if (el && !el.contains(e.relatedTarget)) media.respond(el);
      };
      const down = (e) => { const el = target(e); if (e.button === 0 && usable(el)) media.respond(el, true); };
      const up = (e) => media.respond(target(e));
      const keydown = (e) => {
        const el = target(e);
        if (!e.repeat && (e.key === "Enter" || e.key === " ") && usable(el)) media.respond(el, true);
      };
      const keyup = (e) => { if (e.key === "Enter" || e.key === " ") media.respond(target(e)); };
      const listeners = { pointerover: over, pointerout: out, pointerdown: down, pointerup: up, pointercancel: up, focusout: up, keydown, keyup };
      Object.entries(listeners).forEach(([name, fn]) => host.addEventListener(name, fn));
      return () => Object.entries(listeners).forEach(([name, fn]) => host.removeEventListener(name, fn));
    });
    return () => mm.revert();
  }, { scope: root });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const host = root.current;
    mm.add({ ...motionQueries, desktop: "(min-width: 1025px)", phone: "(max-width: 767px)" }, (media) => {
      const { conditions } = media;
      const { desktop, phone, reduce } = conditions;
      let initial = true;
      media.add("update", () => {
        const { collapsed: isCollapsed, mobile: isOpen } = state.current;
        const duration = initial || reduce ? 0 : 0.32;
        if (desktop) {
          // Width must reflow the workspace. Other motion uses transforms and
          // opacity. Keeping this tween alive lets rapid clicks reverse cleanly.
          gsap.to(host, { "--sidebar": `${isCollapsed ? 68 : 230}px`, duration,
            ease: "power3.inOut", overwrite: "auto" });
          gsap.to(host.querySelector(".sidebar-collapse svg"), {
            rotation: isCollapsed ? 0 : 180, duration, ease: "power3.inOut", overwrite: "auto",
          });
        }
        if (phone) {
          gsap.to(host.querySelector(".sidebar"), {
            xPercent: isOpen ? 0 : -100, x: 0,
            duration: initial || reduce ? 0 : isOpen ? 0.32 : 0.24,
            ease: "power3.out", overwrite: "auto",
          });
          gsap.to(host.querySelector(".sidebar-scrim"), {
            autoAlpha: isOpen ? 1 : 0, duration: initial || reduce ? 0 : 0.22, overwrite: "auto",
          });
        }
        initial = false;
      });
      updateSidebar.current = media.update;
      media.update();
      return () => { updateSidebar.current = null; };
    });
    return () => mm.revert();
  }, { scope: root });

  useGSAP(() => { updateSidebar.current?.(); }, { scope: root, dependencies: [collapsed, mobile] });

  // The selection background moves; the labels stay still and readable.
  useGSAP(() => {
    const host = root.current;
    const nav = host.querySelector(".sidebar nav");
    const indicator = host.querySelector(".nav-indicator");
    if (!nav || !indicator) return;
    const mm = gsap.matchMedia();
    mm.add(motionQueries, (media) => {
      let lastY;
      let lastHeight;
      media.add("place", () => {
        const active = nav.querySelector('a[aria-current="page"]');
        if (!active) { gsap.set(indicator, { autoAlpha: 0 }); lastY = undefined; return; }
        const y = active.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;
        const height = active.offsetHeight;
        if (y === lastY && height === lastHeight) return;
        const duration = lastY === undefined || media.conditions.reduce ? 0 : 0.28;
        lastY = y; lastHeight = height;
        gsap.to(indicator, { y, height, autoAlpha: 1, duration, ease: "power3.out", overwrite: "auto" });
      });
      updateIndicator.current = media.place;
      media.place();
      const observer = new ResizeObserver(media.place);
      observer.observe(nav);
      return () => { observer.disconnect(); updateIndicator.current = null; };
    });
    return () => mm.revert();
  }, { scope: root });

  useGSAP(() => { updateIndicator.current?.(); }, { scope: root, dependencies: [routeKey, role, collapsed] });



  return <div {...props} ref={root} data-motion="gsap">{children}</div>;
}
