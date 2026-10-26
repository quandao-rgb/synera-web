import { test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { once } from 'node:events';
import { DatabaseSync } from 'node:sqlite';
import { createRenderServer } from '../server/render.mjs';
import { createAccountAuth } from '../server/account-auth.mjs';

let server, folder, clientDir, dataDir, base, counter = 0;
const password = 'Synera test password 2026';
const account = () => ({ name: 'Người kiểm thử', email: `qa-${++counter}@example.invalid`, password, confirmPassword: password });
async function start() {
  server = await createRenderServer({ clientDir, dataDir, secureCookies: false });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
}
async function stop() { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
before(async () => {
  folder = await mkdtemp(join(tmpdir(), 'synera-account-test-'));
  clientDir = join(folder, 'client'); dataDir = join(folder, 'data');
  await mkdir(clientDir); await writeFile(join(clientDir, 'index.html'), '<!doctype html><title>SYNERA</title>');
  await start();
});
// Each HTTP scenario gets its own in-memory throttle window; production limits stay enabled.
beforeEach(async () => { await stop(); await start(); });
after(async () => {
  await stop();
  const checked = resolve(folder); assert.ok(checked.startsWith(resolve(tmpdir()) + sep + 'synera-account-test-'));
  await rm(checked, { recursive: true, force: true });
});
async function request(path, { value, cookie, origin = base, type = 'application/json', method, raw } = {}) {
  const hasBody = value !== undefined || raw !== undefined;
  const response = await fetch(base + path, { method: method || (hasBody ? 'POST' : 'GET'), headers: {
    ...(cookie ? { Cookie: cookie } : {}), ...(hasBody ? { Origin: origin, 'Content-Type': type } : {}),
  }, body: hasBody ? (raw ?? JSON.stringify(value)) : undefined, redirect: 'manual' });
  const text = await response.text();
  return { status: response.status, headers: response.headers, body: response.headers.get('content-type')?.includes('application/json') ? JSON.parse(text) : text };
}
const cookieOf = result => result.headers.get('set-cookie')?.split(';')[0];
async function register(input = account()) {
  const result = await request('/api/auth/register', { value: input });
  assert.equal(result.status, 201, JSON.stringify(result.body));
  return { ...result, input, cookie: cookieOf(result) };
}

test('Session starts anonymous; registration creates an account and a verified HttpOnly session', async () => {
  const anonymous = await request('/api/auth/session'); assert.equal(anonymous.body.authenticated, false); assert.equal(anonymous.body.homeRoute, '/#/');
  const result = await register();
  assert.equal(result.body.authenticated, true); assert.equal(result.body.user.email, result.input.email);
  assert.deepEqual(Object.keys(result.body.user).sort(), ['email', 'id', 'name']);
  assert.match(result.headers.get('set-cookie'), /synera_session=[a-f0-9]{64}; Path=\/; HttpOnly; SameSite=Lax; Max-Age=604800/);
  assert.equal(result.headers.get('cache-control'), 'private, no-store');
  const session = await request('/api/auth/session', { cookie: result.cookie }); assert.deepEqual(session.body.user, result.body.user);
  const db = new DatabaseSync(join(dataDir, 'accounts.sqlite'), { readOnly: true });
  try {
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(result.body.user.id);
    assert.equal(user.password, undefined); assert.notEqual(user.password_hash, password); assert.match(user.password_hash, /^scrypt:32768:8:3:[a-f0-9]{128}$/); assert.equal(user.salt.length, 32);
    const token = db.prepare('SELECT token_hash FROM sessions WHERE user_id=?').get(user.id).token_hash;
    assert.notEqual(token, result.cookie.split('=')[1]);
  } finally { db.close(); }
});
test('Invalid registration is rejected; duplicate normalized emails do not create another account', async () => {
  const result = await register();
  assert.equal((await request('/api/auth/register', { value: { ...result.input, email: '  ' + result.input.email.toUpperCase() + '  ' } })).status, 409);
  for (const patch of [{ password: 'short', confirmPassword: 'short' }, { name: 'A' }, { email: 'bad' }, { confirmPassword: 'does not match' }]) {
    const failed = await request('/api/auth/register', { value: { ...account(), ...patch } }); assert.equal(failed.status, 422); assert.equal(failed.headers.get('set-cookie'), null);
  }
});
test('Login checks the password and uses the same persisted identity; failures have no fake session', async () => {
  const result = await register();
  for (const input of [{ email: result.input.email, password: 'incorrect password' }, { email: 'unknown@example.invalid', password }]) {
    const failed = await request('/api/auth/login', { value: input }); assert.equal(failed.status, 401); assert.equal(failed.headers.get('set-cookie'), null); assert.equal(failed.body.error, 'Email hoặc mật khẩu chưa đúng.');
  }
  const login = await request('/api/auth/login', { value: { email: result.input.email.toUpperCase(), password } });
  assert.equal(login.status, 200); assert.deepEqual(login.body.user, result.body.user); assert.notEqual(cookieOf(login), result.cookie);
});
test('State, allowed operations, version checks and warehouse projection remain intact per account', async () => {
  const a = await register(), b = await register();
  const state = await request('/api/demo', { cookie: a.cookie }); assert.equal(state.body.role, 'owner');
  const payload = { action: 'role', payload: { role: 'warehouse' }, version: state.body.version };
  const changed = await request('/api/demo', { cookie: a.cookie, value: payload }); assert.equal(changed.status, 200); assert.equal(changed.body.role, 'warehouse');
  assert.equal(changed.body.finance, undefined); assert.equal(changed.body.customers, undefined); assert.equal(changed.body.carriers, undefined);
  assert.equal((await request('/api/demo', { cookie: b.cookie })).body.role, 'owner');
  assert.equal((await request('/api/demo', { cookie: a.cookie, value: payload })).status, 409);
  assert.equal((await request('/api/demo', { cookie: a.cookie, value: { action: 'purchase', payload: { id: 'SP01', qty: 2 }, version: changed.body.version } })).status, 403);
  const concurrent = await Promise.all([1, 2].map(() => request('/api/demo', { cookie: a.cookie, value: { action: 'role', payload: { role: 'owner' }, version: changed.body.version } })));
  assert.deepEqual(concurrent.map(result => result.status).sort(), [200, 409]);
});
test('Account sessions and workspace edits survive a server restart', async () => {
  const a = await register();
  await request('/api/demo', { cookie: a.cookie, value: { action: 'role', payload: { role: 'warehouse' }, version: 0 } });
  await stop(); await start();
  assert.equal((await request('/api/auth/session', { cookie: a.cookie })).body.user.id, a.body.user.id);
  assert.equal((await request('/api/demo', { cookie: a.cookie })).body.role, 'warehouse');
  assert.equal((await request('/api/auth/login', { value: { email: a.input.email, password } })).status, 200);
});
test('Logout revokes the token; malformed, duplicated and unknown account cookies cannot access account state', async () => {
  const a = await register();
  const logout = await request('/api/auth/logout', { cookie: a.cookie, value: {} }); assert.equal(logout.body.authenticated, false); assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
  for (const cookie of [a.cookie, 'synera_session=' + 'a'.repeat(64), 'synera_session=bad', `${a.cookie}; ${a.cookie}`]) {
    assert.equal((await request('/api/auth/session', { cookie })).body.authenticated, false);
    assert.equal((await request('/api/demo', { cookie })).status, 401);
  }
});
test('Authentication endpoints reject cross-origin writes, wrong content type, malformed/oversized bodies and unsupported methods', async () => {
  assert.equal((await request('/api/auth/register', { value: account(), origin: 'https://foreign.invalid' })).status, 403);
  assert.equal((await request('/api/auth/register', { value: account(), type: 'text/plain' })).status, 415);
  assert.equal((await request('/api/auth/register', { raw: '{broken' })).status, 400);
  assert.equal((await request('/api/auth/register', { raw: JSON.stringify({ name: 'x'.repeat(17000) }) })).status, 413);
  assert.equal((await request('/api/auth/login')).status, 405);
  assert.equal((await request('/api/auth/not-real')).status, 404);
  const legacy = await request('/signin-with-chatgpt?return_to=%2F'); assert.equal(legacy.status, 302); assert.equal(legacy.headers.get('location'), '/?auth=login');
});
test('Account-store expiry and Secure cookies work; login attempts are bounded', async () => {
  let now = 2000000000000;
  const store = createAccountAuth({ filename: join(folder, 'isolated.sqlite'), secureCookies: true, now: () => now });
  try {
    const input = account(), result = await store.register(input, 'isolated'); assert.match(result.setCookie, /; Secure$/);
    const req = { headers: { cookie: result.setCookie.split(';')[0] } }; assert.equal(store.session(req).user.id, result.user.id);
    now += 8 * 86400000; assert.equal(store.session(req), null);
    for (let i = 0; i < 10; i++) await assert.rejects(store.login({ email: input.email, password: 'wrong' }, 'throttled'), error => error.status === 401);
    await assert.rejects(store.login(input, 'throttled'), error => error.status === 429);
    now += 16 * 60000; assert.equal((await store.login(input, 'throttled')).user.id, result.user.id);
  } finally { store.close(); }
});
