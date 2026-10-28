'use client';
import { useEffect, useRef } from 'react';
import { createTruckAnimationEngine, TRUCK_ANIMATION, TRUCK_VIEWS, truckAnimationEnabled } from './truck-animation-engine.mjs';
import { audienceTruckPoint, audienceTruckLayout } from './audience-truck-zone.mjs';

const ATLAS = '/assets/cursor/delivery-truck-directions.webp';

/** Autonomous decoration owned by the audience strip; no pointer listeners or cursor changes. */
export default function SyneraAudienceTruck({ disabled = false }) {
  const layer = useRef(null);
  useEffect(() => {
    if (!layer.current || disabled) return;
    const host = layer.current, section = host.closest('.sl-audience'), page = section.closest('.synera-landing');
    const scene = host.querySelector('.sl-audience-truck__scene');
    const vehicle = host.querySelector('.sl-audience-truck__vehicle'), sprite = host.querySelector('.sl-audience-truck__sprite');
    const wheels = [...host.querySelectorAll('.sl-audience-truck__wheel')], smoke = [...host.querySelectorAll('.sl-audience-truck__smoke')];
    const content = [...section.querySelectorAll('.sl-container > p,.sl-container > div')];
    const engine = createTruckAnimationEngine(), asset = new Image();
    const fine = window.matchMedia('(pointer: fine)'), hover = window.matchMedia('(hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)'), desktop = window.matchMedia('(min-width: 1025px)');
    let frame = 0, zone = null, signature = '', loaded = false, enabled = false;
    let elapsed = 0, previous = null, visible = false, activeWindow = document.hasFocus(), lastView = '';
    const canRun = () => loaded && enabled && zone && visible && activeWindow && !document.hidden
      && !page.querySelector('dialog[open],.sl-solutions-menu[open]');
    const pause = () => {
      cancelAnimationFrame(frame); frame = 0; previous = null; engine.reset();
      host.removeAttribute('data-active');
      for (const node of smoke) node.style.opacity = '0';
    };
    const resume = () => { if (!canRun()) pause(); else if (!frame) frame = requestAnimationFrame(paint); };
    function paint(now) {
      frame = 0;
      if (!canRun()) { pause(); return; }
      if (previous !== null) elapsed += Math.min(32, Math.max(0, now - previous));
      previous = now;
      const point = audienceTruckPoint(elapsed, zone.width / zone.scale, zone.height / zone.scale, TRUCK_ANIMATION);
      engine.move(point.x, point.y, now); engine.step(now);
      const truck = engine.truck;
      if (lastView !== truck.view) {
        const view = TRUCK_VIEWS[truck.view];
        sprite.style.backgroundPosition = `${view.column / 3 * 100}% ${view.row * 100}%`;
        host.dataset.view = truck.view; lastView = truck.view;
      }
      vehicle.style.transform = `translate3d(${truck.x}px,${truck.y + truck.bob}px,0) translate(-50%,-50%) rotate(${truck.angle}deg)`;
      for (const wheel of wheels) wheel.style.transform = `translate(-50%,-50%) rotate(${truck.wheelAngle * truck.direction}deg)`;
      for (let index = 0; index < smoke.length; index++) {
        const particle = engine.particles[index], node = smoke[index];
        node.style.opacity = String(particle.opacity);
        if (particle.active) node.style.transform = `translate3d(${particle.x}px,${particle.y}px,0) translate(-50%,-50%) scale(${particle.scale})`;
      }
      host.setAttribute('data-active', '');
      frame = requestAnimationFrame(paint);
    }
    const measure = () => {
      const rect = section.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const obstacles = content.map(node => {
        const item = node.getBoundingClientRect();
        return { left: item.left - rect.left, right: item.right - rect.left, top: item.top - rect.top, bottom: item.bottom - rect.top };
      });
      const next = enabled ? audienceTruckLayout(rect.width, rect.height, obstacles, TRUCK_ANIMATION) : null;
      const nextSignature = JSON.stringify(next);
      if (signature !== nextSignature) {
        pause(); signature = nextSignature; zone = next; elapsed = 0;
        if (zone) {
          Object.assign(host.style, { left: `${zone.left}px`, top: `${zone.top}px`, width: `${zone.width}px`, height: `${zone.height}px` });
          scene.style.transform = `scale(${zone.scale})`;
        }
      }
      if (enabled && zone && !asset.src) asset.src = ATLAS;
      resume();
    };
    const reconcile = () => {
      enabled = truckAnimationEnabled({ finePointer: fine.matches, hover: hover.matches, reducedMotion: reduce.matches, width: desktop.matches ? window.innerWidth : 0 });
      measure();
    };
    const focus = () => { activeWindow = document.hasFocus(); resume(); };
    const blur = () => { activeWindow = false; pause(); };
    const visibility = () => { activeWindow = document.hasFocus(); resume(); };
    const toggle = () => resume();
    asset.onload = () => { loaded = asset.naturalWidth > 0; sprite.style.backgroundImage = `url("${ATLAS}")`; resume(); };
    asset.onerror = () => { loaded = false; pause(); };
    const queries = [fine, hover, reduce, desktop];
    for (const query of queries) query.addEventListener('change', reconcile);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(section); for (const node of content) resizeObserver?.observe(node);
    const intersectionObserver = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.target === section) { visible = entry.isIntersecting; resume(); }
    }, { threshold: 0 }) : null;
    intersectionObserver?.observe(section);
    window.addEventListener('resize', measure, { passive: true });
    if (!intersectionObserver) window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('focus', focus); window.addEventListener('blur', blur);
    document.addEventListener('visibilitychange', visibility); page.addEventListener('toggle', toggle, true);
    reconcile();
    return () => {
      enabled = false; pause(); resizeObserver?.disconnect(); intersectionObserver?.disconnect();
      for (const query of queries) query.removeEventListener('change', reconcile);
      window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure);
      window.removeEventListener('focus', focus); window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', visibility); page.removeEventListener('toggle', toggle, true);
      asset.onload = asset.onerror = null;
    };
  }, [disabled]);
  return <div className="sl-audience-truck" ref={layer} aria-hidden="true" data-audience-truck>
    <div className="sl-audience-truck__scene">{Array.from({ length: TRUCK_ANIMATION.maxParticles }, (_, index) => <i key={index} className="sl-audience-truck__smoke" />)}
    <div className="sl-audience-truck__vehicle"><i className="sl-audience-truck__sprite" /><i className="sl-audience-truck__wheel sl-audience-truck__wheel--rear" /><i className="sl-audience-truck__wheel sl-audience-truck__wheel--front" /></div>
    </div>
  </div>;
}
