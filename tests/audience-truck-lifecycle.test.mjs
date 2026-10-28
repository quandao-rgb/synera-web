import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

test('Section-owned truck has no pointer listeners and pauses offscreen, in menus, reduced motion and after unmount', () => {
  const file = new URL('../frontend/components/landing/SyneraAudienceTruck.jsx', import.meta.url);
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  let clock = 0, nextId = 1, effect, menuOpen = false;
  const frames = new Map(), effects = new Map(), queries = new Map();
  const nodes = () => ({ style: {} });
  const scene = nodes(), vehicle = nodes(), sprite = nodes(), wheels = [nodes(), nodes()], smoke = Array.from({ length: 24 }, nodes), attributes = new Set();
  const page = { querySelector: () => menuOpen ? {} : null, addEventListener: (key, fn) => effects.set(`page:${key}`, fn), removeEventListener: key => effects.delete(`page:${key}`) };
  const paragraph = { getBoundingClientRect: () => ({left:100,right:490,top:535,bottom:585}) };
  const icons = { getBoundingClientRect: () => ({left:850,right:1340,top:545,bottom:570}) };
  const section = { closest: () => page, querySelectorAll: () => [paragraph, icons], getBoundingClientRect: () => ({left:0,top:500,bottom:640,width:1440,height:140}) };
  const host = { style: {}, dataset: {}, closest: () => section, querySelector: selector => selector.endsWith('__scene') ? scene : selector.endsWith('__vehicle') ? vehicle : sprite, querySelectorAll: selector => selector.endsWith('__wheel') ? wheels : smoke, removeAttribute: key => attributes.delete(key), setAttribute: key => attributes.add(key) };
  const windowMock = {
    innerWidth: 1440, innerHeight: 900,
    matchMedia: query => {
      if (!queries.has(query)) queries.set(query, { matches: !query.includes('reduce'), handlers: new Set(), addEventListener(_, fn) { this.handlers.add(fn); }, removeEventListener(_, fn) { this.handlers.delete(fn); } });
      return queries.get(query);
    },
    addEventListener: (key, fn) => effects.set(`window:${key}`, fn), removeEventListener: key => effects.delete(`window:${key}`),
  };
  const documentMock = { hidden: false, hasFocus: () => true, addEventListener: (key, fn) => effects.set(`document:${key}`, fn), removeEventListener: key => effects.delete(`document:${key}`) };
  let image, intersection, resize;
  class Image { constructor() { image = this; this.naturalWidth = 640; this.src = ''; } }
  class IntersectionObserver { constructor(fn) { this.fn = fn; intersection = this; } observe() {} disconnect() { this.disconnected = true; } }
  class ResizeObserver { constructor(fn) { this.fn = fn; resize = this; } observe() {} disconnect() { this.disconnected = true; } }
  const saved = new Map();
  const install = (key, value) => { saved.set(key, Object.getOwnPropertyDescriptor(globalThis, key)); Object.defineProperty(globalThis, key, { configurable: true, writable: true, value }); };
  const advance = duration => {
    const end = clock + duration;
    while (clock < end) { clock = Math.min(end, clock + 16); const batch = [...frames]; frames.clear(); for (const [, fn] of batch) fn(clock); }
  };
  let cleanup;
  try {
    install('window', windowMock); install('document', documentMock); install('Image', Image);
    install('ResizeObserver', ResizeObserver); install('IntersectionObserver', IntersectionObserver);
    install('requestAnimationFrame', fn => { const id = nextId++; frames.set(id, fn); return id; });
    install('cancelAnimationFrame', id => frames.delete(id));
    const actualRequire = createRequire(file), mod = { exports: {} };
    const require = name => name === 'react' ? { useRef: () => ({ current: host }), useEffect: fn => { effect = fn; } } : actualRequire(name);
    new Function('require', 'module', 'exports', compiled)(require, mod, mod.exports);
    mod.exports.default({ disabled: false }); cleanup = effect(); image.onload(); advance(1200);
    assert.ok(attributes.has('data-active')); assert.ok(sprite.style.backgroundImage.includes('delivery-truck-directions.webp'));
    const transform = vehicle.style.transform; advance(500); assert.notEqual(vehicle.style.transform, transform);
    assert.ok(![...effects.keys()].some(key => /pointer|mouse/.test(key)));
    assert.ok(Number.parseFloat(host.style.left) >= 0 && Number.parseFloat(host.style.top) >= 0);
    intersection.fn([{target:section,isIntersecting:false}]); assert.equal(frames.size, 0); assert.equal(attributes.has('data-active'), false);
    intersection.fn([{target:section,isIntersecting:true}]); advance(16); assert.ok(attributes.has('data-active'));
    menuOpen = true; effects.get('page:toggle')(); assert.equal(frames.size, 0);
    menuOpen = false; effects.get('page:toggle')(); advance(16); assert.ok(attributes.has('data-active'));
    const reduced = queries.get('(prefers-reduced-motion: reduce)'); reduced.matches = true;
    for (const fn of [...reduced.handlers]) fn();
    assert.equal(frames.size, 0); assert.equal(attributes.has('data-active'), false);
    cleanup(); cleanup = null; assert.equal(effects.size, 0);
    assert.equal(intersection.disconnected, true); assert.equal(resize.disconnected, true);
    for (const query of queries.values()) assert.equal(query.handlers.size, 0);
  } finally {
    cleanup?.(); for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  }
});
