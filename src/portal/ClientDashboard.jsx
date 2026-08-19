import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileCheck2,
  FileCode,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MessageSquarePlus,
  Radio,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Logo from '../components/Logo';
import {
  ACCENT_CLASSES,
  CURRENCIES,
  DELIVERABLE_STATUSES,
  INVOICE_STATUSES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '../lib/constants';
import {
  addTicketReply,
  markInvoicePaid,
  saveTicket,
  updateDeliverableStatus,
  useContent,
} from '../lib/store';
import DeliverableActionModal from './DeliverableActionModal';
import InvoicePaymentModal from './InvoicePaymentModal';
import TicketModal from './TicketModal';

export default function ClientDashboard({ client, onSignOut }) {
  const {
    projects = [],
    deliverables = [],
    invoices = [],
    tickets = [],
    documents = [],
    updates = [],
  } = useContent();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Modals state
  const [activeDeliverable, setActiveDeliverable] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // Client-specific filtered records
  const clientProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.clientId === client.id ||
        (client.company && p.client?.toLowerCase().includes(client.company.toLowerCase())),
    );
  }, [projects, client]);

  // Active project selection
  const currentProject = useMemo(() => {
    if (selectedProjectId) {
      return clientProjects.find((p) => p.id === selectedProjectId) || clientProjects[0];
    }
    return clientProjects[0] || null;
  }, [clientProjects, selectedProjectId]);

  const clientDeliverables = useMemo(() => {
    return deliverables.filter(
      (d) =>
        d.clientId === client.id ||
        (currentProject && d.projectId === currentProject.id),
    );
  }, [deliverables, client, currentProject]);

  const clientInvoices = useMemo(() => {
    return invoices.filter(
      (inv) =>
        inv.clientId === client.id ||
        (currentProject && inv.projectId === currentProject.id),
    );
  }, [invoices, client, currentProject]);

  const clientTickets = useMemo(() => {
    return tickets.filter(
      (t) =>
        t.clientId === client.id ||
        (currentProject && t.projectId === currentProject.id),
    );
  }, [tickets, client, currentProject]);

  const clientDocs = useMemo(() => {
    return documents.filter(
      (doc) =>
        doc.clientId === client.id ||
        (currentProject && doc.projectId === currentProject.id),
    );
  }, [documents, client, currentProject]);

  const clientUpdates = useMemo(() => {
    return updates.filter(
      (u) =>
        u.clientId === client.id ||
        (currentProject && u.projectId === currentProject.id),
    );
  }, [updates, client, currentProject]);

  // Key metrics
  const metrics = useMemo(() => {
    const pendingDeliverables = clientDeliverables.filter((d) => d.status === 'pending').length;
    const unpaidInvoices = clientInvoices.filter((inv) => inv.status !== 'paid');
    const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const totalBilled = clientInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const openTickets = clientTickets.filter((t) => t.status !== 'resolved').length;

    return {
      progress: currentProject ? currentProject.progress : 0,
      pendingDeliverables,
      unpaidCount: unpaidInvoices.length,
      unpaidAmount,
      totalBilled,
      openTickets,
    };
  }, [clientDeliverables, clientInvoices, clientTickets, currentProject]);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'milestones',
      label: 'Milestones & Roadmap',
      icon: TrendingUp,
      badge: currentProject?.milestones?.length || null,
    },
    {
      id: 'updates',
      label: 'Sprint Updates',
      icon: Radio,
      badge: clientUpdates.length > 0 ? `${clientUpdates.length}` : null,
    },
    {
      id: 'deliverables',
      label: 'Deliverables & Approvals',
      icon: FileCheck2,
      badge: metrics.pendingDeliverables > 0 ? `${metrics.pendingDeliverables} pending` : null,
      badgeAccent: 'amber',
    },
    {
      id: 'invoices',
      label: 'Invoices & Billing',
      icon: CreditCard,
      badge: metrics.unpaidCount > 0 ? `$${metrics.unpaidAmount.toLocaleString()}` : null,
      badgeAccent: 'rose',
    },
    {
      id: 'tickets',
      label: 'Support & Requests',
      icon: MessageSquare,
      badge: metrics.openTickets > 0 ? metrics.openTickets : null,
    },
    { id: 'documents', label: 'Documents & Assets', icon: FileCode },
  ];

  return (
    <div className="site-ambience flex min-h-dvh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/85 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center" aria-label="Tanvo Tech Home">
              <Logo className="h-8 w-8" showText={false} />
            </Link>

            <div className="h-6 w-px bg-white/10" />

            <div className="flex items-center gap-2.5">
              {client.avatar ? (
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="h-8 w-8 rounded-full border border-white/15 object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-white sm:text-sm">
                  {client.company || client.name}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>{client.name}</span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="font-mono text-cyan-400">{client.accessCode}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {clientProjects.length > 1 && (
              <select
                value={currentProject?.id || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="hidden rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 md:block"
              >
                {clientProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => setIsCreatingTicket(true)}
              className="hidden items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 sm:inline-flex"
            >
              <MessageSquarePlus size={14} /> Submit Request
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-white/5 bg-white/[0.01]">
          <div className="container-page flex overflow-x-auto no-scrollbar py-1">
            <nav className="flex gap-1">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                    }`}
                  >
                    <Icon size={14} className={active ? 'text-cyan-400' : 'text-slate-500'} />
                    {t.label}
                    {t.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                          t.badgeAccent === 'rose'
                            ? 'bg-rose-500/20 text-rose-300'
                            : t.badgeAccent === 'amber'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="container-page flex-1 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {currentProject ? (
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div className="max-w-2xl space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-300">
                        <Sparkles size={12} /> Active Project Workspace
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300">
                        {currentProject.category}
                      </span>
                    </div>

                    <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                      {currentProject.title}
                    </h1>

                    <p className="text-xs text-slate-400 sm:text-sm leading-relaxed">
                      {currentProject.desc}
                    </p>

                    {currentProject.link && (
                      <a
                        href={currentProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:underline"
                      >
                        <ExternalLink size={13} /> View Live Staging Environment
                      </a>
                    )}
                  </div>

                  {/* Progress Gauge */}
                  <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:min-w-[280px]">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-wider text-slate-400">Total Completion</span>
                      <span className="font-heading text-2xl font-bold text-cyan-300">
                        {currentProject.progress}%
                      </span>
                    </div>

                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${currentProject.progress}%` }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: {currentProject.targetDate || 'TBD'}</span>
                      <span className="capitalize text-slate-300">Status: {currentProject.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-slate-400">
                No active projects assigned to your account yet. Contact agency admin.
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Pending Approvals</p>
                <p className="mt-1 font-heading text-2xl font-bold text-amber-400">
                  {metrics.pendingDeliverables}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('deliverables')}
                  className="mt-2 text-[11px] text-slate-400 hover:text-cyan-300"
                >
                  Review assets &rarr;
                </button>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Unpaid Invoices</p>
                <p className="mt-1 font-heading text-2xl font-bold text-rose-400">
                  ${metrics.unpaidAmount.toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('invoices')}
                  className="mt-2 text-[11px] text-slate-400 hover:text-cyan-300"
                >
                  View billing &rarr;
                </button>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Open Tickets</p>
                <p className="mt-1 font-heading text-2xl font-bold text-sky-400">
                  {metrics.openTickets}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('tickets')}
                  className="mt-2 text-[11px] text-slate-400 hover:text-cyan-300"
                >
                  Track requests &rarr;
                </button>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Dedicated Lead</p>
                <p className="mt-1 font-heading text-base font-bold text-white">Tanvo Studio Lead</p>
                <p className="mt-2 text-[11px] text-slate-400">hello@tanvo.tech</p>
              </div>
            </div>

            {/* Latest Sprint Updates & Deliverables Preview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Sprint Updates Feed */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <Radio size={18} className="text-cyan-400" />
                    <h3 className="font-heading text-base font-bold text-white">
                      Latest Sprint Deployments & Notes
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('updates')}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View all ({clientUpdates.length})
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {clientUpdates.length > 0 ? (
                    clientUpdates.slice(0, 3).map((up) => (
                      <div key={up.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-semibold text-cyan-300 border border-cyan-500/20">
                            {up.category}
                          </span>
                          <span className="text-slate-500">{up.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{up.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{up.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-slate-500">
                      No sprint updates posted yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Deliverables Preview */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <FileCheck2 size={18} className="text-cyan-400" />
                    <h3 className="font-heading text-base font-bold text-white">
                      Deliverables Awaiting Review
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('deliverables')}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View all ({clientDeliverables.length})
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {clientDeliverables.length > 0 ? (
                    clientDeliverables.slice(0, 3).map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition hover:border-white/15"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{d.title}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Version {d.version} &bull; {d.type}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveDeliverable(d)}
                          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20"
                        >
                          Review &rarr;
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-slate-500">
                      No deliverables uploaded yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sprint Updates Tab */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Sprint Changelog & Deployment Feed</h2>
              <p className="text-xs text-slate-400">
                Transparent weekly logs, architecture decisions, and staging releases from the engineering pod.
              </p>
            </div>

            <div className="space-y-4">
              {clientUpdates.length > 0 ? (
                clientUpdates.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                          {u.category}
                        </span>
                        <h3 className="font-heading text-base font-bold text-white">{u.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{u.author}</span>
                        <span>&bull;</span>
                        <span>{u.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {u.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-slate-400">
                  No sprint updates recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Project Roadmap & Milestones</h2>
              <p className="text-xs text-slate-400">
                Target milestones and delivery sprint stages for {currentProject?.title}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentProject?.milestones?.map((milestone, index) => {
                const isComplete = milestone.status === 'completed';
                const isInProgress = milestone.status === 'in-progress';
                return (
                  <div
                    key={milestone.id || index}
                    className={`rounded-2xl border p-5 transition ${
                      isComplete
                        ? 'border-emerald-500/20 bg-emerald-950/10'
                        : isInProgress
                          ? 'border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_20px_rgba(0,242,254,0.05)]'
                          : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl font-heading text-xs font-bold ${
                            isComplete
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isInProgress
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {isComplete ? <CheckCircle2 size={16} /> : index + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">{milestone.title}</h3>
                          <p className="text-xs text-slate-400">
                            Due target: {milestone.dueDate || 'Sprint schedule'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isComplete
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isInProgress
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'bg-white/5 text-slate-400 border border-white/10'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Deliverables Tab */}
        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Project Deliverables & Sign-offs</h2>
              <p className="text-xs text-slate-400">
                Review production assets, interactive designs, and provide approval or change requests.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {clientDeliverables.map((del) => {
                const statusObj =
                  DELIVERABLE_STATUSES.find((s) => s.id === del.status) || DELIVERABLE_STATUSES[0];
                const accent = ACCENT_CLASSES[statusObj.accent] || ACCENT_CLASSES.amber;

                return (
                  <div
                    key={del.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium ${accent.bg} ${accent.text} border ${accent.border}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                          {statusObj.label}
                        </span>
                        <span className="font-mono text-xs text-slate-400">{del.version}</span>
                      </div>

                      <h3 className="mt-3 font-heading text-base font-bold text-white">{del.title}</h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {del.description || 'No description provided.'}
                      </p>

                      {del.feedback && (
                        <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-xs text-slate-300">
                          <span className="font-medium text-slate-400">Feedback log:</span> {del.feedback}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                      {del.url ? (
                        <a
                          href={del.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:underline"
                        >
                          <ExternalLink size={13} /> View Live Deliverable
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">Internal package</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveDeliverable(del)}
                        className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        Review / Action &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-xl font-bold text-white">Invoices & Financial Summary</h2>
                <p className="text-xs text-slate-400">
                  Track milestone billings, receipts, and settled invoices.
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2 text-xs">
                <div>
                  <p className="text-slate-400">Total Invoiced</p>
                  <p className="font-heading text-sm font-bold text-white">
                    ${metrics.totalBilled.toLocaleString()}
                  </p>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div>
                  <p className="text-slate-400">Pending Due</p>
                  <p className="font-heading text-sm font-bold text-rose-400">
                    ${metrics.unpaidAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.02] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Milestone Description</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {clientInvoices.map((inv) => {
                    const statusObj =
                      INVOICE_STATUSES.find((s) => s.id === inv.status) || INVOICE_STATUSES[0];
                    const accent = ACCENT_CLASSES[statusObj.accent] || ACCENT_CLASSES.amber;
                    const currencyObj = CURRENCIES.find((c) => c.id === inv.currency) || CURRENCIES[1];

                    return (
                      <tr key={inv.id} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono font-medium text-cyan-400">{inv.invoiceNumber}</td>
                        <td className="p-4 font-medium text-white">{inv.title}</td>
                        <td className="p-4 font-heading font-semibold text-slate-100">
                          {currencyObj.symbol}{Number(inv.amount).toLocaleString()} {inv.currency}
                        </td>
                        <td className="p-4 text-slate-400">{inv.dueDate || '—'}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${accent.bg} ${accent.text} border ${accent.border}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                            {statusObj.label}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveInvoice(inv)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              inv.status === 'paid'
                                ? 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md shadow-cyan-500/20'
                            }`}
                          >
                            {inv.status === 'paid' ? 'View Receipt' : 'Pay Now'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tickets / Requests Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-xl font-bold text-white">Support & Scope Requests</h2>
                <p className="text-xs text-slate-400">
                  Direct communication channel with your dedicated engineering & design team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingTicket(true)}
                className="btn-primary inline-flex items-center gap-2 self-start px-4 py-2 text-xs font-semibold"
              >
                <MessageSquarePlus size={15} /> Raise a Request
              </button>
            </div>

            <div className="space-y-3">
              {clientTickets.length > 0 ? (
                clientTickets.map((t) => {
                  const statusObj =
                    TICKET_STATUSES.find((s) => s.id === t.status) || TICKET_STATUSES[0];
                  const priorityObj =
                    TICKET_PRIORITIES.find((p) => p.id === t.priority) || TICKET_PRIORITIES[1];

                  return (
                    <div
                      key={t.id}
                      onClick={() => setActiveTicket(t)}
                      className="group flex cursor-pointer flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl transition hover:border-cyan-500/40 hover:bg-white/[0.03] sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${ACCENT_CLASSES[statusObj.accent]?.bg} ${ACCENT_CLASSES[statusObj.accent]?.text}`}
                          >
                            {statusObj.label}
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold ${ACCENT_CLASSES[priorityObj.accent]?.bg} ${ACCENT_CLASSES[priorityObj.accent]?.text}`}
                          >
                            {priorityObj.label}
                          </span>
                          <span className="text-xs text-slate-500">&bull; {t.category}</span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-white group-hover:text-cyan-300">
                          {t.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MessageSquare size={13} className="text-slate-500" />
                          {t.replies?.length || 0} replies
                        </span>
                        <span className="text-[11px] text-cyan-400">Open discussion &rarr;</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-slate-400">
                  No requests submitted yet. Need a feature change or have a question? Click "Raise a Request".
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Project Documents & Assets</h2>
              <p className="text-xs text-slate-400">
                Shared contracts, Figma files, staging access, and architectural blueprints.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {clientDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="rounded bg-white/5 px-2 py-0.5 font-medium text-slate-400">
                        {doc.category}
                      </span>
                      <span>{doc.size}</span>
                    </div>

                    <h3 className="mt-3 font-heading text-sm font-bold text-white">{doc.title}</h3>
                    <p className="mt-1 text-[11px] text-slate-400">Date: {doc.date}</p>
                  </div>

                  <div className="mt-5 border-t border-white/5 pt-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                    >
                      <ExternalLink size={13} /> Access Document
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeDeliverable && (
        <DeliverableActionModal
          deliverable={activeDeliverable}
          onClose={() => setActiveDeliverable(null)}
          onUpdateStatus={updateDeliverableStatus}
        />
      )}

      {activeInvoice && (
        <InvoicePaymentModal
          invoice={activeInvoice}
          client={client}
          project={currentProject}
          onClose={() => setActiveInvoice(null)}
          onPaySuccess={(id) => markInvoicePaid(id)}
        />
      )}

      {(activeTicket || isCreatingTicket) && (
        <TicketModal
          ticket={activeTicket}
          client={client}
          projects={clientProjects}
          senderRole="client"
          senderName={client.name}
          onClose={() => {
            setActiveTicket(null);
            setIsCreatingTicket(false);
          }}
          onSaveTicket={saveTicket}
          onAddReply={addTicketReply}
        />
      )}
    </div>
  );
}
