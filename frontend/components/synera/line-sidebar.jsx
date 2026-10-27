"use client";
import { useEffect, useRef } from "react";

// Adapted from the supplied React Bits LineSidebar (JavaScript + CSS).
// Keep its shared --effect animation, but enhance SYNERA's existing links in
// place: no demo items, click-owned selection, proximity field, ticks or indices.
export default function LineSidebar({ scopeRef, routeKey, role }) {
  const syncRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const root = scopeRef.current;
    const marker = markerRef.current;
    if (!root || !marker) return;
    const links = [...root.querySelectorAll(".nav-group > a[href], .sidebar-bottom > a[href]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const records = new Map();
    let frame = null;
    let hovered = null;
    let focused = null;
    let alive = true;
    const duration = 150;
    const slideDuration = 280;
    const selected = (el) => el.getAttribute("aria-current") === "page";
    const slider = { x: 0, y: 0, fromX: 0, fromY: 0, targetX: 0, targetY: 0, start: 0, visible: false, moving: false };
    const paintMarker = () => {
      marker.style.transform = `translate3d(${slider.x}px, ${slider.y}px, 0)`;
    };

    for (const el of links) {
      const value = selected(el) ? 1 : 0;
      records.set(el, { value, from: value, target: value, start: 0, prior: el.style.getPropertyValue("--line-effect") });
      el.style.setProperty("--line-effect", String(value));
    }

    // A finite 150 ms ease-out replaces the demo's long exponential tail.
    // Only the pointed/focused row responds; nearby rows never follow a cursor.
    const runFrame = (now) => {
      if (!alive) return;
      let moving = false;
      if (slider.moving) {
        const progress = Math.min(1, Math.max(0, (now - slider.start) / slideDuration));
        // Match the deployed GSAP power3.out: quick response, gentle finish.
        const eased = 1 - (1 - progress) ** 4;
        slider.x = slider.fromX + (slider.targetX - slider.fromX) * eased;
        slider.y = slider.fromY + (slider.targetY - slider.fromY) * eased;
        paintMarker();
        slider.moving = progress < 1;
        moving = slider.moving;
      }
      for (const [el, item] of records) {
        if (item.value === item.target) continue;
        const progress = Math.min(1, Math.max(0, (now - item.start) / duration));
        const eased = progress * (2 - progress);
        item.value = progress === 1 ? item.target : item.from + (item.target - item.from) * eased;
        el.style.setProperty("--line-effect", item.value.toFixed(4));
        if (progress < 1) moving = true;
      }
      frame = moving ? requestAnimationFrame(runFrame) : null;
    };

    // The selected row's background slides like the deployed SYNERA reference.
    // Labels retain immediate route selection and restrained 1 px feedback.
    const positionMarker = (animate = false) => {
      const active = links.find(selected);
      const rect = active?.getBoundingClientRect();
      const viewport = active?.closest("nav")?.getBoundingClientRect();
      const center = rect ? rect.top + rect.height / 2 : 0;
      const visible = rect && rect.height > 0 && !reduced.matches &&
        (!viewport || (center >= viewport.top + 9 && center <= viewport.bottom - 9));
      if (!visible) {
        slider.visible = slider.moving = false;
        marker.hidden = true;
        root.removeAttribute("data-line-slider");
        return;
      }
      const bounds = root.getBoundingClientRect();
      const x = rect.left - bounds.left;
      const y = rect.top - bounds.top;
      marker.style.width = `${rect.width}px`;
      marker.style.height = `${rect.height}px`;
      const changed = x !== slider.targetX || y !== slider.targetY;
      if (!animate || !slider.visible) {
        slider.x = slider.targetX = x;
        slider.y = slider.targetY = y;
        slider.moving = false;
        paintMarker();
      } else if (changed) {
        slider.fromX = slider.x;
        slider.fromY = slider.y;
        slider.targetX = x;
        slider.targetY = y;
        slider.start = performance.now();
        slider.moving = true;
        if (frame === null) frame = requestAnimationFrame(runFrame);
      }
      slider.visible = true;
      marker.hidden = false;
      root.setAttribute("data-line-slider", "true");
    };

    const sync = () => {
      const now = performance.now();
      for (const [el, item] of records) {
        const target = selected(el) || el === hovered || el === focused ? 1 : 0;
        if (reduced.matches) {
          item.value = item.from = item.target = target;
          el.style.setProperty("--line-effect", String(target));
        } else if (target !== item.target) {
          item.from = item.value;
          item.target = target;
          item.start = now;
        }
      }
      if (reduced.matches) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
      } else if (frame === null && [...records.values()].some((item) => item.value !== item.target)) {
        frame = requestAnimationFrame(runFrame);
      }
    };
    syncRef.current = () => { sync(); positionMarker(true); };
    const findLink = (target) => {
      if (!(target instanceof Element)) return null;
      const el = target.closest("a[href]");
      return records.has(el) ? el : null;
    };
    const pointerOver = (event) => {
      if (!hover.matches || event.pointerType === "touch" || root.inert) return;
      const el = findLink(event.target);
      if (el && !el.contains(event.relatedTarget)) { hovered = el; sync(); }
    };
    const pointerOut = (event) => {
      const el = findLink(event.target);
      if (el && !el.contains(event.relatedTarget)) { hovered = null; sync(); }
    };
    const pointerLeave = () => { hovered = null; sync(); };
    const focusIn = (event) => { focused = findLink(event.target); sync(); };
    const focusOut = (event) => { focused = findLink(event.relatedTarget); sync(); };
    const preferenceChange = () => { if (!hover.matches) hovered = null; sync(); positionMarker(); };
    const layoutChange = () => positionMarker();
    const listeners = { pointerover: pointerOver, pointerout: pointerOut, pointerleave: pointerLeave, pointercancel: pointerLeave, focusin: focusIn, focusout: focusOut };
    Object.entries(listeners).forEach(([name, handler]) => root.addEventListener(name, handler));
    reduced.addEventListener("change", preferenceChange);
    hover.addEventListener("change", preferenceChange);
    root.addEventListener("scroll", layoutChange, true);
    window.addEventListener("resize", layoutChange);
    const resize = new ResizeObserver(layoutChange);
    [root, root.querySelector("nav"), root.querySelector(".sidebar-bottom"), ...links]
      .filter(Boolean).forEach((el) => resize.observe(el));
    positionMarker();

    return () => {
      alive = false;
      if (frame !== null) cancelAnimationFrame(frame);
      syncRef.current = null;
      Object.entries(listeners).forEach(([name, handler]) => root.removeEventListener(name, handler));
      reduced.removeEventListener("change", preferenceChange);
      hover.removeEventListener("change", preferenceChange);
      root.removeEventListener("scroll", layoutChange, true);
      window.removeEventListener("resize", layoutChange);
      resize.disconnect();
      root.removeAttribute("data-line-slider");
      marker.hidden = true;
      marker.style.removeProperty("transform");
      marker.style.removeProperty("width");
      marker.style.removeProperty("height");
      for (const [el, item] of records) {
        if (item.prior) el.style.setProperty("--line-effect", item.prior);
        else el.style.removeProperty("--line-effect");
      }
    };
  }, [scopeRef, role]);

  // Route and permission state remain owned by Interface, not by this effect.
  useEffect(() => { syncRef.current?.(); }, [routeKey, role]);
  return <span ref={markerRef} className="line-sidebar-slider" aria-hidden="true" hidden />;
}
