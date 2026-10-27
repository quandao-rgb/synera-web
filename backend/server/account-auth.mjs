import { DatabaseSync } from 'node:sqlite';
import { randomBytes, createHash, scrypt as rawScrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';
import { DomainError, createDemo } from './domain.mjs';

const scrypt = promisify(rawScrypt);
const SESSION_TTL = 7 * 86400;
const COOKIE = 'synera_session';
const hashToken = token => createHash('sha256').update(token).digest('hex');
const SCHEME = 'scrypt:32768:8:3:';
const derive = (password, salt, parallelism = 3) => scrypt(password, salt, 64, { N: 32768, r: 8, p: parallelism, maxmem: 64 * 1024 * 1024 });
const publicUser = row => ({ id: row.id, name: row.name, email: row.email });
const validObject = value => value && typeof value === 'object' && !Array.isArray(value);

export function createAccountAuth({ filename, secureCookies = false, now = Date.now }) {
  mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(filename);
  try { chmodSync(filename, 0o600); } catch { /* Windows inherits the account directory ACL. */ }
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS workspaces (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, state TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);`);
  const attempts = new Map();
  const dummySalt = randomBytes(16).toString('hex');
  const dummyHash = randomBytes(64);
  const cookie = (token, age = SESSION_TTL) => `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${secureCookies ? '; Secure' : ''}`;
  function tokenFrom(req) {
    const values = (req.headers.cookie || '').split(';').map(part => part.trim()).filter(part => part.startsWith(`${COOKIE}=`));
    if (!values.length) return null;
    return values.length === 1 && /^[a-f0-9]{64}$/.test(values[0].slice(COOKIE.length + 1)) ? values[0].slice(COOKIE.length + 1) : '';
  }
  function session(req) {
    const token = tokenFrom(req);
    if (!token) return null;
    const row = db.prepare('SELECT u.id, u.name, u.email, s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').get(hashToken(token), now());
    return row ? { user: publicUser(row), expiresAt: row.expires_at } : null;
  }
  function throttle(key, maximum, windowMs) {
    const stamp = now();
    for (const [id, item] of attempts) if (item.until <= stamp) attempts.delete(id);
    const item = attempts.get(key) || { count: 0, until: stamp + windowMs };
    if (item.count >= maximum || attempts.size >= 10000 && !attempts.has(key)) throw new DomainError('Bạn đã thử quá nhiều lần. Vui lòng chờ rồi thử lại.', 429);
    item.count++; attempts.set(key, item);
  }
  function validate(value, registering = false) {
    if (!validObject(value)) throw new DomainError('Thông tin biểu mẫu không hợp lệ.', 400);
    const email = typeof value.email === 'string' ? value.email.trim().toLowerCase() : '';
    const password = typeof value.password === 'string' ? value.password : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) throw new DomainError('Vui lòng nhập email hợp lệ.');
    if (password.length > 128 || password.length < (registering ? 12 : 1)) throw new DomainError(registering ? 'Mật khẩu cần từ 12 đến 128 ký tự.' : 'Vui lòng nhập mật khẩu.');
    const name = typeof value.name === 'string' ? value.name.trim() : '';
    if (registering && (name.length < 2 || name.length > 80)) throw new DomainError('Họ và tên cần từ 2 đến 80 ký tự.');
    if (registering && value.confirmPassword !== password) throw new DomainError('Mật khẩu nhập lại chưa khớp.');
    return { email, password, name };
  }
  function issue(userId) {
    const token = randomBytes(32).toString('hex');
    db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(now());
    db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(hashToken(token), userId, now() + SESSION_TTL * 1000);
    return cookie(token);
  }
  async function register(value, address) {
    throttle(`register:${address}`, 10, 3600000);
    const input = validate(value, true);
    if (db.prepare('SELECT id FROM users WHERE email=?').get(input.email)) throw new DomainError('Email đã được sử dụng. Bạn có thể đăng nhập bằng email này.', 409);
    const salt = randomBytes(16).toString('hex'), passwordHash = SCHEME + (await derive(input.password, salt)).toString('hex');
    const user = { id: randomBytes(16).toString('hex'), name: input.name, email: input.email };
    db.exec('BEGIN IMMEDIATE');
    try {
      db.prepare('INSERT INTO users(id,name,email,salt,password_hash,created_at) VALUES(?,?,?,?,?,?)').run(user.id, user.name, user.email, salt, passwordHash, now());
      db.prepare('INSERT INTO workspaces(user_id,state) VALUES(?,?)').run(user.id, JSON.stringify(createDemo()));
      const setCookie = issue(user.id);
      db.exec('COMMIT');
      return { user, setCookie };
    } catch (error) {
      db.exec('ROLLBACK');
      if (String(error.code || '').includes('CONSTRAINT') || /UNIQUE constraint failed: users.email/.test(error.message || '')) throw new DomainError('Email đã được sử dụng. Bạn có thể đăng nhập bằng email này.', 409);
      throw error;
    }
  }
  async function login(value, address) {
    const input = validate(value);
    throttle(`login-ip:${address}`, 40, 900000);
    throttle(`login-email:${hashToken(input.email)}`, 10, 900000);
    const row = db.prepare('SELECT * FROM users WHERE email=?').get(input.email);
    // The prefix records the work factor. Retain compatibility with the initial local hashes.
    const legacy = !!row && /^[a-f0-9]{128}$/.test(row.password_hash);
    const candidate = await derive(input.password, row?.salt || dummySalt, legacy ? 1 : 3);
    const expected = row ? Buffer.from(legacy ? row.password_hash : row.password_hash.startsWith(SCHEME) ? row.password_hash.slice(SCHEME.length) : '', 'hex') : dummyHash;
    if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected) || !row) throw new DomainError('Email hoặc mật khẩu chưa đúng.', 401);
    attempts.delete(`login-email:${hashToken(input.email)}`);
    return { user: publicUser(row), setCookie: issue(row.id) };
  }
  function logout(req) {
    const token = tokenFrom(req);
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(token));
    return cookie('', 0);
  }
  function readWorkspace(userId) {
    const row = db.prepare('SELECT state FROM workspaces WHERE user_id=?').get(userId);
    if (!row) throw new DomainError('Không tìm thấy không gian tài khoản.', 404);
    return JSON.parse(row.state);
  }
  function writeWorkspace(userId, state, expectedVersion) {
    const result = db.prepare("UPDATE workspaces SET state=? WHERE user_id=? AND json_extract(state,'$.version')=?").run(JSON.stringify(state), userId, expectedVersion);
    if (result.changes !== 1) throw new DomainError('Dữ liệu đã đổi ở cửa sổ khác. Tải lại rồi thử tiếp.', 409);
  }
  return { session, hasCookie: req => tokenFrom(req) !== null, register, login, logout, readWorkspace, writeWorkspace, close: () => db.close() };
}
