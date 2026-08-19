import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import { isConfigured, lockoutRemaining } from '../lib/auth';

export default function AdminGate({ onSubmit, onDevUnlock, pending, error }) {
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [lockMs, setLockMs] = useState(() => lockoutRemaining());
  const fieldId = useId();
  const configured = isConfigured();

  // Tick down a visible lockout so the user knows when to try again.
  useEffect(() => {
    if (lockMs <= 0) return undefined;
    const timer = setInterval(() => setLockMs(lockoutRemaining()), 1000);
    return () => clearInterval(timer);
  }, [lockMs]);

  const locked = lockMs > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await onSubmit(password);
    if (!ok) {
      setPassword('');
      setLockMs(lockoutRemaining());
    }
  };

  const lockLabel = () => {
    const total = Math.ceil(lockMs / 1000);
    const mins = String(Math.floor(total / 60)).padStart(2, '0');
    const secs = String(total % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <main
      id="main"
      className="site-ambience flex min-h-dvh flex-col items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo className="h-11 w-11" showText />
        </div>

        <div className="glass-card p-8 md:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <Lock size={24} aria-hidden="true" />
            </div>
            <h1 className="mb-2 font-heading text-2xl font-bold text-white">
              Agency Admin Access
            </h1>
            <p className="text-sm leading-relaxed text-slate-400">
              Enter your team password to manage client workspaces, deliverables, and invoices.
            </p>
          </div>

          {!configured && (
            <div
              role="alert"
              className="mb-6 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-200/90"
            >
              <ShieldAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <strong className="font-semibold">Password not configured in .env yet.</strong> Run{' '}
                <code className="rounded bg-black/30 px-1 py-0.5">npm run admin:hash</code>, paste into <code>.env</code>, and restart Vite.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor={fieldId}
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                Admin password
              </label>
              <div className="relative">
                <input
                  id={fieldId}
                  type={reveal ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={pending || locked || !configured}
                  className="field-input pr-12"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${fieldId}-error` : undefined}
                />
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={reveal ? 'Hide password' : 'Show password'}
                  aria-pressed={reveal}
                >
                  {reveal ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div aria-live="polite" aria-atomic="true">
              {error && (
                <p
                  id={`${fieldId}-error`}
                  className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs leading-relaxed text-red-300"
                >
                  <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
              {locked && (
                <p className="mt-3 text-center text-xs text-amber-300/80">
                  Locked for{' '}
                  <span className="font-mono font-semibold">{lockLabel()}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending || locked || !configured}
              className="btn-primary w-full py-3.5 font-semibold shadow-lg shadow-cyan-500/20"
            >
              {pending ? 'Verifying…' : 'Unlock Admin Hub'}
            </button>

            {onDevUnlock && (
              <button
                type="button"
                onClick={onDevUnlock}
                className="mt-2 flex items-center justify-center gap-1.5 w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <Sparkles size={14} /> ⚡ 1-Click Dev Instant Unlock
              </button>
            )}
          </form>
        </div>

        <p className="mx-auto mt-6 max-w-sm text-center text-[11px] leading-relaxed text-slate-600">
          This gate keeps the page private from visitors and search engines.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Back to the public site
          </Link>
        </div>
      </div>
    </main>
  );
}
