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

export function MotionShell({ children, routeKey, ready, role, collapsed, mobile, ...props }) {
  const root = useRef(null);
  const state = useRef({ collapsed, mobile });
  state.current = { collapsed, mobile };
  const updateSidebar = useRef(null);

  // Delegation also covers controls mounted later, without per-button listeners.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", (media) => {
      const host = root.current;
      const selector = "button,a,summary,.shipping-service,.shipping-strategy,.glide-select__trigger";
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
      const focus = (e) => { const el = target(e); if (usable(el)) media.respond(el, false, true); };
      const listeners = { pointerover: over, pointerout: out, pointerdown: down, pointerup: up, pointercancel: up, focusin: focus, focusout: up, keydown, keyup };
      Object.entries(listeners).forEach(([name, fn]) => host.addEventListener(name, fn));
      return () => Object.entries(listeners).forEach(([name, fn]) => host.removeEventListener(name, fn));
    });
    return () => mm.revert();
  }, { scope: root });

  // Observe presentation states only. Never intercept a form event or business callback.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const host = root.current;
      let frame = 0;
      const pending = new Set();
      const observer = new MutationObserver(records => {
        for (const record of records) {
          const el = record.target;
          if (!(el instanceof Element)) continue;
          if (el.matches('.shipping-service[data-selected="true"],.shipping-strategy[data-selected="true"],.tabs button.selected,.switch')) pending.add(el);
        }
        if (!pending.size || frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          pending.forEach(el => {
            if (el.isConnected) gsap.fromTo(el, { scale: 0.99 }, { scale: 1, duration: 0.22, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' });
          });
          pending.clear();
        });
      });
      observer.observe(host, { subtree: true, attributes: true, attributeFilter: ['data-selected', 'aria-selected', 'aria-checked'] });
      return () => { observer.disconnect(); cancelAnimationFrame(frame); pending.clear(); };
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

  // Match the deployed SYNERA page reveal. Only navigation / initial readiness
  // triggers it: edits, filters, refreshed data and button actions stay still.
  useGSAP(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const main = root.current.querySelector(".main-content");
      if (!main) return;
      const heading = main.querySelector(".page-heading");
      const sections = [...main.querySelectorAll(".overview-welcome,.metric-grid,.panel,.processing-stages,.empty-state")]
        .filter((el) => !el.parentElement.closest(".panel") && el.getClientRects().length)
        .slice(0, 7);
      const timeline = gsap.timeline({ defaults: { duration: 0.3, ease: "power3.out" } });
      if (heading) timeline.fromTo(heading, { y: 7, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, clearProps: "transform,opacity,visibility",
      }, 0);
      if (sections.length) timeline.fromTo(sections, { y: 10, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, stagger: { amount: 0.1 }, clearProps: "transform,opacity,visibility",
      }, 0.035);
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [routeKey, ready, role], revertOnUpdate: true });

  return <div {...props} ref={root} data-motion="gsap">{children}</div>;
}
