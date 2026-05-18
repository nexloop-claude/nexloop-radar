const HASH_KEY     = 'nexloop_auth_hash';
const SALT_KEY     = 'nexloop_auth_salt';
const SESSION_KEY  = 'nexloop_session';
const ATTEMPTS_KEY = 'nexloop_auth_attempts';
const LOCKOUT_KEY  = 'nexloop_auth_lockout';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 30 * 60 * 1000; // 30 minutes

// ── Crypto helpers ────────────────────────────────────────────────

function getOrCreateSalt() {
  let salt = localStorage.getItem(SALT_KEY);
  if (!salt) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    salt = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(SALT_KEY, salt);
  }
  return salt;
}

// PBKDF2: 100,000 iterations of SHA-256 — industry standard, brute-force resistant
async function deriveHash(password) {
  const salt = getOrCreateSalt();
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100_000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Password management ───────────────────────────────────────────

export function hasPasswordSet() {
  return !!localStorage.getItem(HASH_KEY);
}

export async function setupPassword(password) {
  const hash = await deriveHash(password);
  localStorage.setItem(HASH_KEY, hash);
  createSession();
}

export async function verifyPassword(password) {
  const stored = localStorage.getItem(HASH_KEY);
  if (!stored) return false;
  const hash = await deriveHash(password);
  return hash === stored;
}

export async function changePassword(currentPassword, newPassword) {
  const valid = await verifyPassword(currentPassword);
  if (!valid) return false;
  // Generate new salt for new password
  localStorage.removeItem(SALT_KEY);
  const hash = await deriveHash(newPassword);
  localStorage.setItem(HASH_KEY, hash);
  return true;
}

// ── Brute-force protection ────────────────────────────────────────

export function getLockoutUntil() {
  const lockout = localStorage.getItem(LOCKOUT_KEY);
  if (!lockout) return null;
  const until = parseInt(lockout, 10);
  if (Date.now() >= until) {
    localStorage.removeItem(LOCKOUT_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
    return null;
  }
  return until;
}

export function recordFailedAttempt() {
  const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
  if (attempts >= MAX_ATTEMPTS) {
    const until = Date.now() + LOCKOUT_MS;
    localStorage.setItem(LOCKOUT_KEY, String(until));
    localStorage.removeItem(ATTEMPTS_KEY);
    return { locked: true, until };
  }
  localStorage.setItem(ATTEMPTS_KEY, String(attempts));
  return { locked: false, remaining: MAX_ATTEMPTS - attempts };
}

export function clearAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(LOCKOUT_KEY);
}

// ── Session management (sessionStorage — clears on tab close) ─────

export function createSession() {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  sessionStorage.setItem(SESSION_KEY, token);
}

export function isAuthenticated() {
  return !!sessionStorage.getItem(SESSION_KEY);
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}
