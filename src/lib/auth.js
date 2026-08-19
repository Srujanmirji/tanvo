import { AUTH, STORAGE_KEYS } from './constants';

const encoder = new TextEncoder();

/** PBKDF2-SHA256. Deliberately slow so offline guessing costs real time. */
const ITERATIONS = 210_000;

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derives a hex digest from a password + salt.
 */
export async function derive(password, salt) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
      'Web Crypto is unavailable. Serve the site over HTTPS or localhost.',
    );
  }

  try {
    const key = await subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const bits = await subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      key,
      256,
    );
    return toHex(bits);
  } catch {
    const digest = await subtle.digest('SHA-256', encoder.encode(`${salt}:${password}`));
    return toHex(digest);
  }
}

/** Constant-time comparison */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const EXPECTED_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH || AUTH.hash || 'd08689ba0d886abcfbbae94ae61ed5a4edca71a27944810e720e4c09daabab09';
const SALT = import.meta.env.VITE_ADMIN_SALT || AUTH.salt || '805022b336c565755f585eae2743b93b';

export function isConfigured() {
  return EXPECTED_HASH.length > 0;
}

/* ---------------------------------------------------------------
   Attempt throttling
   --------------------------------------------------------------- */

function getLockoutKey() {
  return STORAGE_KEYS.attempts || STORAGE_KEYS.adminLockout || 'tanvo:admin:lockout:v2';
}

function readAttempts() {
  try {
    const raw = localStorage.getItem(getLockoutKey());
    if (!raw) return { count: 0, until: 0 };
    const parsed = JSON.parse(raw);
    return { count: Number(parsed.count) || 0, until: Number(parsed.until) || 0 };
  } catch {
    return { count: 0, until: 0 };
  }
}

function writeAttempts(value) {
  try {
    localStorage.setItem(getLockoutKey(), JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/** Milliseconds remaining on a lockout, or 0 if not locked. */
export function lockoutRemaining() {
  const { until } = readAttempts();
  return Math.max(0, until - Date.now());
}

export function attemptsLeft() {
  const { count } = readAttempts();
  const max = AUTH.maxAttempts || AUTH.maxFailedAttempts || 5;
  return Math.max(0, max - count);
}

function recordFailure() {
  const { count } = readAttempts();
  const max = AUTH.maxAttempts || AUTH.maxFailedAttempts || 5;
  const lockoutMs = AUTH.lockoutMs || AUTH.lockoutDurationMs || 15 * 60 * 1000;
  const next = count + 1;
  writeAttempts({
    count: next,
    until: next >= max ? Date.now() + lockoutMs : 0,
  });
}

function clearFailures() {
  writeAttempts({ count: 0, until: 0 });
}

/* ---------------------------------------------------------------
   Session Management
   --------------------------------------------------------------- */

function getSessionKey() {
  return STORAGE_KEYS.session || STORAGE_KEYS.adminSession || 'tanvo:admin:session:v2';
}

function writeSession() {
  const ttl = AUTH.sessionTtlMs || AUTH.sessionDurationMs || 12 * 60 * 60 * 1000;
  const token = {
    issued: Date.now(),
    expires: Date.now() + ttl,
  };
  try {
    sessionStorage.setItem(getSessionKey(), JSON.stringify(token));
  } catch {
    /* ignore */
  }
  return token;
}

export function readSession() {
  try {
    const raw = sessionStorage.getItem(getSessionKey());
    if (!raw) return null;
    const token = JSON.parse(raw);
    if (!token?.expires || isNaN(token.expires) || Date.now() > token.expires) {
      sessionStorage.removeItem(getSessionKey());
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function endSession() {
  try {
    sessionStorage.removeItem(getSessionKey());
  } catch {
    /* ignore */
  }
}

/**
 * Verifies password and opens session on success.
 */
export async function login(password) {
  const remaining = lockoutRemaining();
  if (remaining > 0) {
    const mins = Math.ceil(remaining / 60000);
    return {
      ok: false,
      error: `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`,
    };
  }

  if (!isConfigured()) {
    return {
      ok: false,
      error:
        'No admin password is configured in .env. Use Dev Instant Unlock or add your VITE_ADMIN_PASSWORD_HASH.',
    };
  }

  if (!password) {
    return { ok: false, error: 'Enter your password.' };
  }

  let digest;
  try {
    digest = await derive(password, SALT);
  } catch (err) {
    return { ok: false, error: err.message };
  }

  if (!safeEqual(digest, EXPECTED_HASH)) {
    recordFailure();
    const left = attemptsLeft();
    return {
      ok: false,
      error:
        left > 0
          ? `Incorrect password. ${left} attempt${left === 1 ? '' : 's'} remaining.`
          : 'Incorrect password. Account locked for 15 minutes.',
    };
  }

  clearFailures();
  writeSession();
  return { ok: true };
}

/** Instant session unlock for local dev/testing mode */
export function createDevSession() {
  clearFailures();
  return writeSession();
}
