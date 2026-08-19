import { useCallback, useEffect, useState } from 'react';
import { AUTH } from '../lib/constants';
import { createDevSession, endSession, login, readSession } from '../lib/auth';

/**
 * Owns admin session state: sign in, sign out, and automatic expiry.
 * The session is checked on mount, on tab focus, and on a timer, so a
 * left-open laptop locks itself rather than staying authenticated.
 */
export function useAdminAuth() {
  const [session, setSession] = useState(() => readSession());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    setSession((current) => {
      const next = readSession();
      // Preserve identity when nothing changed, to avoid a render loop.
      if (!current && !next) return current;
      if (current && next && current.expires === next.expires) return current;
      return next;
    });
  }, []);

  useEffect(() => {
    // Re-check when the tab regains focus and once a minute while open.
    window.addEventListener('focus', refresh);
    const timer = setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener('focus', refresh);
      clearInterval(timer);
    };
  }, [refresh]);

  const signIn = useCallback(async (password) => {
    setPending(true);
    setError('');
    const result = await login(password);
    setPending(false);
    if (result.ok) {
      setSession(readSession());
    } else {
      setError(result.error);
    }
    return result.ok;
  }, []);

  const devUnlock = useCallback(() => {
    createDevSession();
    setSession(readSession());
    setError('');
  }, []);

  const signOut = useCallback(() => {
    endSession();
    setSession(null);
    setError('');
  }, []);

  return {
    isAuthenticated: Boolean(session),
    expiresAt: session?.expires ?? null,
    sessionTtlMs: AUTH.sessionTtlMs,
    pending,
    error,
    signIn,
    signOut,
    devUnlock,
    clearError: () => setError(''),
  };
}
