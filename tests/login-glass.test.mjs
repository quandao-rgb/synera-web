import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { loginGlassPolicy } from '../frontend/components/landing/login-glass-policy.mjs';

const chrome = { userAgent: 'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36', hasBackdrop: true, finePointer: true };
test('Login material only enhances supported desktop browsers', () => {
  assert.deepEqual(loginGlassPolicy(chrome), { advanced: true, reactive: true });
  for (const userAgent of ['Version/18.0 Safari/605.1.15', 'Gecko/20100101 Firefox/132.0', 'CriOS/131 Mobile Safari/604.1', '']) {
    assert.deepEqual(loginGlassPolicy({ ...chrome, userAgent }), { advanced: false, reactive: false });
  }
  assert.deepEqual(loginGlassPolicy({ ...chrome, hasBackdrop: false }), { advanced: false, reactive: false });
});
test('Motion, touch and transparency preferences disable pointer tracking', () => {
  assert.deepEqual(loginGlassPolicy({ ...chrome, reducedMotion: true }), { advanced: true, reactive: false });
  assert.deepEqual(loginGlassPolicy({ ...chrome, finePointer: false }), { advanced: true, reactive: false });
  assert.deepEqual(loginGlassPolicy({ ...chrome, reducedTransparency: true }), { advanced: false, reactive: false });
});
test('Login glass renders accessible form content on the server without navigator', () => {
  // Load the actual JSX with the project's existing compiler, not a mocked package.
  const file = new URL('../frontend/components/landing/LoginGlass.jsx', import.meta.url);
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(createRequire(file), mod, mod.exports);
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, get() { throw new Error('navigator is unavailable on the server'); } });
  try {
    const markup = renderToStaticMarkup(React.createElement(mod.exports.default, {}, React.createElement('form', { 'aria-label': 'Login' }, React.createElement('input', { type: 'email', name: 'email', required: true }))));
    assert.match(markup, /data-glass-renderer="static"/);
    assert.match(markup, /<form aria-label="Login">/);
    assert.match(markup, /type="email"/);
    assert.match(markup, /name="email"/);
    assert.match(markup, /required=""/);
  } finally {
    if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
    else delete globalThis.navigator;
  }
});
