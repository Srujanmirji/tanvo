import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, KeyRound, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { useContent } from '../lib/store';

export default function ClientLogin({ onLogin }) {
  const { clients = [] } = useContent();
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const code = accessCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter your client access code.');
      return;
    }

    const matchedClient = clients.find(
      (c) => c.accessCode.toUpperCase() === code || c.email.toLowerCase() === accessCode.trim().toLowerCase(),
    );

    if (matchedClient) {
      onLogin(matchedClient);
    } else {
      setError('Access code or email not found. Please check your invitation or use a demo profile below.');
    }
  };

  const handleDemoSelect = (client) => {
    onLogin(client);
  };

  return (
    <div className="site-ambience flex min-h-dvh flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between py-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
          <ArrowLeft size={16} /> Back to main site
        </Link>
        <Link to="/admin" className="text-xs text-slate-500 hover:text-slate-400">
          Agency Admin Login &rarr;
        </Link>
      </header>

      {/* Main card */}
      <main className="mx-auto my-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,242,254,0.15)]">
              <Logo className="h-8 w-8" showText={false} />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <ShieldCheck size={13} className="text-cyan-400" />
              Client Workspace Portal
            </span>

            <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome to Your Portal
            </h1>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Track project milestones, approve deliverables, review invoices, and submit support requests in real time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="accessCode" className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                Client Access Code or Email
              </label>
              <div className="relative mt-2">
                <input
                  id="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. NOVA-2026 or sarah@novatech.io"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-400"
                />
                <KeyRound size={17} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-500" />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 text-sm font-semibold shadow-lg shadow-cyan-500/20"
            >
              Access Portal <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          {clients.length > 0 && (
            <div className="mt-8 border-t border-white/5 pt-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Sparkles size={13} className="text-amber-400" />
                  Quick Demo Access:
                </span>
                <span className="text-[11px] text-slate-500">1-click login</span>
              </div>

              <div className="mt-3 space-y-2">
                {clients.slice(0, 3).map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleDemoSelect(client)}
                    className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-left transition hover:border-cyan-500/30 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      {client.avatar ? (
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="h-8 w-8 rounded-full border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                          {client.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-cyan-300">
                          {client.company || client.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{client.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-cyan-400">
                      <span className="font-mono text-[10px] rounded bg-white/5 px-1.5 py-0.5">{client.accessCode}</span>
                      <UserCheck size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Tanvo Tech &bull; Secure Client Project Management
      </footer>
    </div>
  );
}
