"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CircleCheck, CircleAlert, Info, X } from "lucide-react";
import { createToastTimer, shouldDismissSwipe } from "./toast-feedback.mjs";
import { displayText } from "./ui";

// React Bits SwipeToast adaptation: swipe, pausable fuse, close/Escape, real action.
// SYNERA's icons and finite easing replace demo dependencies and spring effects.
function ToastCard({ toast, onClose, paused: externallyPaused }) {
  const card = useRef(null), fuse = useRef(null), animation = useRef(null), timer = useRef(null);
  const latest = useRef(onClose), drag = useRef(null), outsideFocus = useRef(null), closing = useRef(false), exitTimer = useRef(null);
  latest.current = onClose;
  const flags = useRef(new Set(externallyPaused ? ["blocked"] : []));
  const [paused, setPaused] = useState(!!externallyPaused), [phase, setPhase] = useState("open"), [reduced, setReduced] = useState(false);
  const reducedRef = useRef(false), pausedRef = useRef(paused), phaseRef = useRef(phase);
  pausedRef.current = paused; phaseRef.current = phase;
  const setFlag = useCallback((name, enabled) => {
    if (enabled) flags.current.add(name); else flags.current.delete(name);
    setPaused(flags.current.size > 0);
  }, []);
  const close = useCallback((reason) => {
    if (closing.current) return;
    closing.current = true; timer.current?.pause(); animation.current?.pause(); setPhase("closing");
    exitTimer.current = setTimeout(() => {
      if (card.current?.contains(document.activeElement)) {
        const target = outsideFocus.current;
        if (target?.isConnected && !target.closest("[inert]")) target.focus({ preventScroll: true });
        else document.querySelector("#main-content")?.focus({ preventScroll: true });
      }
      latest.current(reason);
    }, reducedRef.current || reason === "escape" ? 0 : 160);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedRef.current = media.matches; setReduced(media.matches); };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => { setFlag("blocked", externallyPaused); }, [externallyPaused, setFlag]);
  useEffect(() => {
    const visibility = () => setFlag("hidden", document.hidden);
    visibility(); document.addEventListener("visibilitychange", visibility);
    return () => { document.removeEventListener("visibilitychange", visibility); clearTimeout(exitTimer.current); };
  }, [setFlag]);
  useEffect(() => {
    const clock = createToastTimer({ duration: toast.duration, onExpire: () => close("timeout") }); timer.current = clock;
    return () => clock.dispose();
  }, [toast.duration, close]);
  useEffect(() => {
    if (reduced || toast.duration <= 0 || !fuse.current?.animate) return;
    const remaining = timer.current?.remaining() ?? toast.duration;
    const anim = fuse.current.animate([{ transform: `scaleX(${remaining / toast.duration})` }, { transform: "scaleX(0)" }], { duration: remaining, easing: "linear", fill: "forwards" });
    anim.pause(); animation.current = anim;
    if (!pausedRef.current && phaseRef.current === "open") anim.play();
    return () => { anim.cancel(); if (animation.current === anim) animation.current = null; };
  }, [reduced, toast.duration]);
  useEffect(() => {
    if (paused || phase !== "open") { timer.current?.pause(); animation.current?.pause(); }
    else { timer.current?.resume(); animation.current?.play(); }
    return () => { timer.current?.pause(); animation.current?.pause(); };
  }, [paused, phase, toast.duration]);
  const finishPointer = (event, cancelled = false) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    drag.current = null; card.current?.removeAttribute("data-swiping");
    if (card.current?.hasPointerCapture(event.pointerId)) card.current.releasePointerCapture(event.pointerId);
    const last = gesture.samples.at(-1), first = gesture.samples[0];
    const velocity = performance.now() - last[0] > 100 ? 0 : (last[1] - first[1]) / Math.max(1, last[0] - first[0]);
    setFlag("drag", false);
    if (!cancelled && shouldDismissSwipe(gesture.offset, velocity)) close("swipe");
    else card.current?.style.setProperty("--swipe-y", "0px");
  };
  const Icon = toast.tone === "success" ? CircleCheck : toast.tone === "info" ? Info : CircleAlert;
  return <div className="swipe-toast" data-tone={toast.tone} data-phase={phase}>
    <div className="swipe-toast__lift"><div ref={card} className="swipe-toast__card" role="group" aria-labelledby={`toast-${toast.id}`} tabIndex={0}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setFlag("hover", true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setFlag("hover", false); }}
      onFocusCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) outsideFocus.current = e.relatedTarget; setFlag("focus", true); }}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFlag("focus", false); }}
      onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); close("escape"); } }}
      onPointerDown={(e) => {
        if (e.button !== 0 || e.isPrimary === false || closing.current || e.target.closest("button,a,input,select,textarea")) return;
        drag.current = { id: e.pointerId, start: e.clientY, offset: 0, samples: [[performance.now(), 0]] };
        e.currentTarget.setPointerCapture(e.pointerId); setFlag("drag", true);
      }}
      onPointerMove={(e) => {
        const gesture = drag.current; if (!gesture || gesture.id !== e.pointerId) return;
        gesture.offset = e.clientY - gesture.start; if (Math.abs(gesture.offset) < 3) return;
        e.currentTarget.setAttribute("data-swiping", "true");
        if (!reducedRef.current) e.currentTarget.style.setProperty("--swipe-y", `${Math.max(-2, Math.min(80, gesture.offset))}px`);
        gesture.samples.push([performance.now(), gesture.offset]); gesture.samples = gesture.samples.slice(-4);
      }} onPointerUp={(e) => finishPointer(e)} onPointerCancel={(e) => finishPointer(e, true)} onLostPointerCapture={(e) => finishPointer(e, true)}>
      <Icon className="swipe-toast__icon" size={18} aria-hidden="true" />
      <div className="swipe-toast__body"><span id={`toast-${toast.id}`} className="swipe-toast__title">{displayText(toast.title)}</span>
        {toast.description && <p className="swipe-toast__description">{displayText(toast.description)}</p>}</div>
      {toast.action && <button type="button" className="swipe-toast__action" onClick={() => { toast.action.onClick(); close("action"); }}>{toast.action.label}</button>}
      <button type="button" className="swipe-toast__close" aria-label="Đóng thông báo" onClick={() => close("close")}><X size={16} aria-hidden="true" /></button>
      {toast.duration > 0 && <i ref={fuse} className="swipe-toast__fuse" aria-hidden="true" />}
    </div></div></div>;
}
export default function SwipeToast({ toast, onClose, paused = false }) {
  const message = toast ? displayText([toast.title, toast.description].filter(Boolean).join(". ")) : "";
  return <>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true"><span key={toast?.id}>{toast?.tone !== "error" ? message : ""}</span></div>
    <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true"><span key={toast?.id}>{toast?.tone === "error" ? message : ""}</span></div>
    {toast && <ToastCard key={toast.id} toast={toast} paused={paused} onClose={(reason) => onClose(toast.id, reason)} />}
  </>;
}
