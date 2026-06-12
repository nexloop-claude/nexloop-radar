import * as OTPAuth from 'otpauth';

const USERS_KEY   = 'nexloop_users_v2';
const SESSION_KEY = 'nexloop_session_v2';
const PENDING_KEY = 'nexloop_pending_v2';
const ITERATIONS  = 300_000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 30 * 60 * 1000;

// ── Crypto helpers ────────────────────────────────────────────────

function hexToBytes(hex) {
  const b = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) b[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  return b;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function randomHex(len = 16) {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(len)));
}

async function pbkdf2Hash(password, saltHex) {
  const enc = new TextEncoder();
  const km  = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: ITERATIONS, hash: 'SHA-256' },
    km, 256
  );
  return bytesToHex(new Uint8Array(bits));
}

async function pbkdf2Key(password, saltHex) {
  const enc = new TextEncoder();
  const km  = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: ITERATIONS, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function aesEncrypt(plaintext, password, saltHex) {
  const key = await pbkdf2Key(password, saltHex);
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const ct  = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  return { ct: bytesToHex(new Uint8Array(ct)), iv: bytesToHex(iv) };
}

async function aesDecrypt(ctHex, ivHex, password, saltHex) {
  const key = await pbkdf2Key(password, saltHex);
  const pt  = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: hexToBytes(ivHex) },
    key,
    hexToBytes(ctHex)
  );
  return new TextDecoder().decode(pt);
}

// ── TOTP ─────────────────────────────────────────────────────────

export function generateTOTPSecret() {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

export function getTOTPUri(secret, username) {
  return new OTPAuth.TOTP({
    issuer:    'Nexloop Radar',
    label:     username,
    algorithm: 'SHA1',
    digits:    6,
    period:    30,
    secret:    OTPAuth.Secret.fromBase32(secret),
  }).toString();
}

export function verifyTOTPCode(secret, code) {
  const totp = new OTPAuth.TOTP({
    issuer:    'Nexloop Radar',
    algorithm: 'SHA1',
    digits:    6,
    period:    30,
    secret:    OTPAuth.Secret.fromBase32(secret),
  });
  return totp.validate({ token: code.replace(/\s/g, ''), window: 1 }) !== null;
}

// ── User store ───────────────────────────────────────────────────

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function hasUsers() {
  return readUsers().length > 0;
}

export function listUsers() {
  return readUsers().map(({ id, username, role, createdAt }) => ({ id, username, role, createdAt }));
}

// ── Brute-force ───────────────────────────────────────────────────

function getLockoutKey(username) { return `nexloop_lockout_${username.toLowerCase()}`; }
function getAttemptsKey(username) { return `nexloop_attempts_${username.toLowerCase()}`; }

export function getLockoutUntil(username) {
  const raw = localStorage.getItem(getLockoutKey(username));
  if (!raw) return null;
  const until = parseInt(raw, 10);
  if (Date.now() >= until) {
    localStorage.removeItem(getLockoutKey(username));
    localStorage.removeItem(getAttemptsKey(username));
    return null;
  }
  return until;
}

function recordFail(username) {
  const lk = getLockoutKey(username);
  const ak = getAttemptsKey(username);
  const n  = parseInt(localStorage.getItem(ak) || '0', 10) + 1;
  if (n >= MAX_ATTEMPTS) {
    localStorage.setItem(lk, String(Date.now() + LOCKOUT_MS));
    localStorage.removeItem(ak);
    return { locked: true, until: Date.now() + LOCKOUT_MS };
  }
  localStorage.setItem(ak, String(n));
  return { locked: false, remaining: MAX_ATTEMPTS - n };
}

function clearAttempts(username) {
  localStorage.removeItem(getLockoutKey(username));
  localStorage.removeItem(getAttemptsKey(username));
}

// ── Account creation ─────────────────────────────────────────────

export async function createUser({ username, password, role = 'user' }) {
  const users = readUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error('Nome de usuário já existe.');

  const salt   = randomHex(16);
  const hash   = await pbkdf2Hash(password, salt);
  const secret = generateTOTPSecret();
  const { ct, iv } = await aesEncrypt(secret, password, salt);

  const user = {
    id: randomHex(8),
    username: username.trim(),
    salt,
    hash,
    role,
    totpEnabled: true,
    totpCt: ct,
    totpIv: iv,
    createdAt: Date.now(),
  };
  users.push(user);
  writeUsers(users);
  return { user: { id: user.id, username: user.username, role: user.role }, totpSecret: secret };
}

// ── Login (2 steps) ───────────────────────────────────────────────

export async function loginStep1(username, password) {
  // Lockout check (before heavy PBKDF2)
  const until = getLockoutUntil(username);
  if (until) {
    const err = new Error('Acesso bloqueado temporariamente.');
    err.locked = true;
    err.until  = until;
    throw err;
  }

  const users = readUsers();
  const user  = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  // Same error for wrong username or wrong password (prevents enumeration)
  if (!user) {
    recordFail(username);
    throw new Error('Usuário ou senha incorretos.');
  }

  const hash = await pbkdf2Hash(password, user.salt);
  if (hash !== user.hash) {
    const result = recordFail(username);
    if (result.locked) {
      const err = new Error('Acesso bloqueado por 30 minutos após 5 tentativas.');
      err.locked = true;
      err.until  = result.until;
      throw err;
    }
    const err = new Error(
      result.remaining === 1
        ? 'Senha incorreta. Última tentativa antes do bloqueio.'
        : `Senha incorreta. ${result.remaining} tentativas restantes.`
    );
    throw err;
  }

  // Decrypt TOTP secret (password just verified — safe to do now)
  let totpSecret = null;
  if (user.totpEnabled && user.totpCt) {
    try {
      totpSecret = await aesDecrypt(user.totpCt, user.totpIv, password, user.salt);
    } catch {
      throw new Error('Falha na verificação de autenticação. Contate o administrador.');
    }
  }

  // Store pending state in sessionStorage (ephemeral, cleared after step 2)
  sessionStorage.setItem(PENDING_KEY, JSON.stringify({
    userId: user.id, username: user.username, role: user.role,
    totpEnabled: user.totpEnabled, totpSecret,
  }));

  return { totpEnabled: user.totpEnabled, username: user.username };
}

export function loginStep2(code) {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) throw new Error('Sessão expirada. Faça login novamente.');

  const pending = JSON.parse(raw);
  sessionStorage.removeItem(PENDING_KEY);

  if (pending.totpEnabled && pending.totpSecret) {
    if (!verifyTOTPCode(pending.totpSecret, code))
      throw new Error('Código inválido. Verifique o app autenticador e tente novamente.');
  }

  clearAttempts(pending.username);

  const session = {
    userId:   pending.userId,
    username: pending.username,
    role:     pending.role,
    token:    randomHex(16),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

// ── Session ───────────────────────────────────────────────────────

export function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

export function isAuthenticated() {
  return !!getSession();
}

export function isAdmin() {
  return getSession()?.role === 'admin';
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(PENDING_KEY);
}

// ── Admin operations ──────────────────────────────────────────────

function requireAdmin() {
  if (!isAdmin()) throw new Error('Acesso negado. Apenas administradores.');
}

export async function adminCreateUser(username, password, role) {
  requireAdmin();
  return createUser({ username, password, role });
}

export async function adminResetUserPassword(userId, newPassword) {
  requireAdmin();
  const users = readUsers();
  const idx   = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Usuário não encontrado.');

  const salt   = randomHex(16);
  const hash   = await pbkdf2Hash(newPassword, salt);
  const secret = generateTOTPSecret();
  const { ct, iv } = await aesEncrypt(secret, newPassword, salt);

  users[idx] = { ...users[idx], salt, hash, totpCt: ct, totpIv: iv, totpEnabled: true };
  writeUsers(users);
  return { username: users[idx].username, totpSecret: secret };
}

export function adminDeleteUser(userId) {
  requireAdmin();
  const session = getSession();
  if (userId === session.userId) throw new Error('Não é possível excluir o próprio usuário.');
  writeUsers(readUsers().filter(u => u.id !== userId));
  localStorage.removeItem(`nexloop_history_${userId}`);
  localStorage.removeItem(`nexloop_drafts_${userId}`);
}

export function adminUpdateUserRole(userId, newRole) {
  requireAdmin();
  const session = getSession();
  if (userId === session.userId) throw new Error('Não é possível alterar o próprio perfil.');
  const users = readUsers();
  const idx   = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Usuário não encontrado.');
  users[idx].role = newRole;
  writeUsers(users);
}

// ── Own password change ───────────────────────────────────────────

export async function changeOwnPassword(currentPassword, newPassword) {
  const session = getSession();
  if (!session) throw new Error('Não autenticado.');

  const users = readUsers();
  const idx   = users.findIndex(u => u.id === session.userId);
  if (idx === -1) throw new Error('Usuário não encontrado.');

  const user = users[idx];
  const hash = await pbkdf2Hash(currentPassword, user.salt);
  if (hash !== user.hash) throw new Error('Senha atual incorreta.');

  // Re-encrypt TOTP with new password
  const secret = await aesDecrypt(user.totpCt, user.totpIv, currentPassword, user.salt);
  const salt   = randomHex(16);
  const newHash = await pbkdf2Hash(newPassword, salt);
  const { ct, iv } = await aesEncrypt(secret, newPassword, salt);

  users[idx] = { ...user, salt, hash: newHash, totpCt: ct, totpIv: iv };
  writeUsers(users);
}

// ── Migration from v1 ─────────────────────────────────────────────

export function migrateV1Data(adminUserId) {
  try {
    const h = localStorage.getItem('nexloop_history');
    if (h) { localStorage.setItem(`nexloop_history_${adminUserId}`, h); localStorage.removeItem('nexloop_history'); }

    const d = localStorage.getItem('nexloop_drafts');
    if (d) { localStorage.setItem(`nexloop_drafts_${adminUserId}`, d); localStorage.removeItem('nexloop_drafts'); }

    localStorage.removeItem('nexloop_auth_hash');
    localStorage.removeItem('nexloop_auth_salt');
    localStorage.removeItem('nexloop_current_assessment');
    sessionStorage.removeItem('nexloop_session');
  } catch { /* ignore */ }
}

// ── Password strength ─────────────────────────────────────────────

export function passwordStrength(password) {
  let score = 0;
  if (password.length >= 10) score++;
  if (password.length >= 14) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 0, label: 'Muito fraca', color: '#EF4444' };
  if (score === 2) return { level: 1, label: 'Fraca',      color: '#F97316' };
  if (score === 3) return { level: 2, label: 'Razoável',   color: '#EAB308' };
  if (score === 4) return { level: 3, label: 'Forte',      color: '#22C55E' };
  return               { level: 4, label: 'Muito forte', color: '#18B8FF' };
}
