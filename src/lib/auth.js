import { AUTH, STORAGE_KEYS } from './constants';

/**
 * ADMIN GATE — READ THIS BEFORE RELYING ON IT
 *
 * This is a client-side gate on a static site. The password hash and
 * this verification code both ship inside the JavaScript bundle, so a
 * technically capable visitor can read the hash or patch the check out
 * entirely. It is *obfuscation*, not authentication.
 *
 * What it genuinely does:
 *   - keeps /admin out of search engines and away from casual visitors
 *   - stops shoulder-surfers and shared-laptop access
 *   - never stores the plaintext password anywhere
 *
 * What it does NOT do:
 *   - protect data from someone who opens devtools
 *   - survive a determined attacker
 *
 * For real protection, put auth in front of the file, not inside it:
 *   - Cloudflare Access / Vercel or Netlify password protection
 *   - HTTP Basic auth at the reverse proxy
 *   - a backend session API with an httpOnly cookie
 * See README → "Hardening the admin route".
 */

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
 * Falls back to plain SHA-256 where SubtleCrypto.deriveBits is missing
 * (non-secure contexts), which is weaker but keeps the page usable.
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

/** Constant-time-ish comparison. Avoids leaking match length via timing. */
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

const EXPECTED_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '';
const SALT = import.meta.env.VITE_ADMIN_SALT ?? 'tanvo-default-salt';

export function isConfigured() {
  return EXPECTED_HASH.length > 0;
}

/* ---------------------------------------------------------------
   Attempt throttling
   --------------------------------------------------------------- */

function readAttempts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.attempts);
    if (!raw) return { count: 0, until: 0 };
    const parsed = JSON.parse(raw);
    return { count: Number(parsed.count) || 0, until: Number(parsed.until) || 0 };
  } catch {
    return { count: 0, until: 0 };
  }
}

function writeAttempts(value) {
  try {
    localStorage.setItem(STORAGE_KEYS.attempts, JSON.stringify(value));
  } catch {
    /* storage unavailable — throttling degrades, login still works */
  }
}

/** Milliseconds remaining on a lockout, or 0 if not locked. */
export function lockoutRemaining() {
  const { until } = readAttempts();
  return Math.max(0, until - Date.now());
}

export function attemptsLeft() {
  const { count } = readAttempts();
  return Math.max(0, AUTH.maxAttempts - count);
}

function recordFailure() {
  const { count } = readAttempts();
  const next = count + 1;
  writeAttempts({
    count: next,
    until: next >= AUTH.maxAttempts ? Date.now() + AUTH.lockoutMs : 0,
  });
}

function clearFailures() {
  writeAttempts({ count: 0, until: 0 });
}

/* ---------------------------------------------------------------
   Session
   --------------------------------------------------------------- */

/** Session lives in sessionStorage so it dies when the tab closes. */
function writeSession() {
  const token = {
    issued: Date.now(),
    expires: Date.now() + AUTH.sessionTtlMs,
  };
  try {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(token));
  } catch {
    /* ignore */
  }
  return token;
}

export function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return null;
    const token = JSON.parse(raw);
    if (!token?.expires || Date.now() > token.expires) {
      sessionStorage.removeItem(STORAGE_KEYS.session);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function endSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.session);
  } catch {
    /* ignore */
  }
}

/**
 * Verifies a password and opens a session on success.
 * @returns {Promise<{ok: true} | {ok: false, error: string}>}
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
        'No admin password is configured. Run `npm run admin:hash` and add the output to your .env file.',
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
