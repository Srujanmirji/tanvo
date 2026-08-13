import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Database,
  ExternalLink,
  LayoutGrid,
  LogOut,
  ShieldAlert,
  Trophy,
} from 'lucide-react';
import Logo from '../components/Logo';
import WorkBoard from './WorkBoard';
import AchievementsPanel from './AchievementsPanel';
import DataTools from './DataTools';
import ConfirmDialog from './ConfirmDialog';
import { useContent } from '../lib/store';

const TABS = [
  { id: 'pipeline', label: 'Pipeline', icon: LayoutGrid },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'data', label: 'Data', icon: Database },
];

function SessionClock({ expiresAt }) {
  const remaining = expiresAt ? expiresAt - Date.now() : 0;
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);

  return (
    <span
      title="This session ends automatically"
      className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex"
    >
      <Clock size={12} aria-hidden="true" />
      {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`} left
    </span>
  );
}

function StatCard({ label, value, tone = 'text-white' }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1.5 font-heading text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard({ onSignOut, expiresAt }) {
  const { projects, achievements } = useContent();
  const [tab, setTab] = useState('pipeline');
  const [confirmRequest, setConfirmRequest] = useState(null);

  const stats = useMemo(() => {
    const byStatus = (status) => projects.filter((p) => p.status === status).length;
    const overdue = projects.filter((p) => {
      if (p.status === 'completed' || !p.targetDate) return false;
      return new Date(p.targetDate) < new Date();
    }).length;
    return {
      active: byStatus('in-progress'),
      upcoming: byStatus('upcoming'),
      shipped: byStatus('completed'),
      overdue,
      achievements: achievements.length,
    };
  }, [projects, achievements]);

  const sampleCount =
    projects.filter((p) => p.isSample).length +
    achievements.filter((a) => a.isSample).length;

  return (
    <div className="site-ambience flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-void/80 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Logo className="h-8 w-8" showText={false} />
            <div>
              <h1 className="font-heading text-sm font-bold text-white">
                Content dashboard
              </h1>
              <p className="text-xs text-slate-500">Team access</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SessionClock expiresAt={expiresAt} />
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg border border-white/5 px-3 py-2 text-xs text-slate-400 transition-colors hover:border-white/15 hover:text-white"
            >
              <ExternalLink size={13} aria-hidden="true" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-white/5 px-3 py-2 text-xs text-slate-400 transition-colors hover:border-red-500/30 hover:text-red-300"
            >
              <LogOut size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="container-page w-full flex-1 py-8">
        {sampleCount > 0 && (
          <div
            role="status"
            className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm text-amber-100/80"
          >
            <ShieldAlert size={17} className="shrink-0 text-amber-400" aria-hidden="true" />
            <p className="flex-1 text-xs leading-relaxed">
              <strong className="font-semibold">
                {sampleCount} placeholder record{sampleCount === 1 ? '' : 's'} still
                published.
              </strong>{' '}
              Invented case studies on a live agency site are a credibility risk — replace
              or remove them before launch.
            </p>
            <button
              type="button"
              onClick={() => setTab('data')}
              className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-500/10"
            >
              Manage
            </button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard label="In build" value={stats.active} tone="text-cyan-400" />
          <StatCard label="Upcoming" value={stats.upcoming} tone="text-amber-400" />
          <StatCard label="Shipped" value={stats.shipped} tone="text-emerald-400" />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            tone={stats.overdue > 0 ? 'text-red-400' : 'text-slate-600'}
          />
          <StatCard label="Achievements" value={stats.achievements} />
        </div>

        <div
          role="tablist"
          aria-label="Dashboard sections"
          className="mb-8 flex gap-1 rounded-xl border border-white/5 bg-slate-950/60 p-1.5"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
          className="rounded-2xl border border-white/5 bg-white/[0.015] p-6"
        >
          {tab === 'pipeline' && <WorkBoard onRequestDelete={setConfirmRequest} />}
          {tab === 'achievements' && (
            <AchievementsPanel onRequestDelete={setConfirmRequest} />
          )}
          {tab === 'data' && <DataTools onRequestConfirm={setConfirmRequest} />}
        </div>
      </main>

      <ConfirmDialog request={confirmRequest} onClose={() => setConfirmRequest(null)} />
    </div>
  );
}
