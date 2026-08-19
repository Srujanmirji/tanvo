import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CreditCard,
  Database,
  FileCheck2,
  Inbox,
  Kanban,
  Layers,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Package,
  Search,
  Send,
  Users,
} from 'lucide-react';
import Logo from '../components/Logo';
import WorkBoard from './WorkBoard';
import LeadsPanel from './LeadsPanel';
import ClientsPanel from './ClientsPanel';
import DeliverablesPanel from './DeliverablesPanel';
import InvoicesPanel from './InvoicesPanel';
import ServicesCMSPanel from './ServicesCMSPanel';
import CaseStudiesCMSPanel from './CaseStudiesCMSPanel';
import TicketsPanel from './TicketsPanel';
import InboxPanel from './InboxPanel';
import CommunicationsPanel from './CommunicationsPanel';
import DataTools from './DataTools';
import ConfirmDialog from './ConfirmDialog';
import CommandPalette from './CommandPalette';
import ClientNotifierModal from './ClientNotifierModal';
import { useContent } from '../lib/store';

const TABS = [
  { id: 'pipeline', label: 'Pipeline', icon: LayoutGrid },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'leads', label: 'CRM Leads', icon: Kanban },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'deliverables', label: 'Deliverables', icon: FileCheck2 },
  { id: 'invoices', label: 'Invoices', icon: CreditCard },
  { id: 'comms', label: 'Outbound Broadcasts', icon: Send },
  { id: 'services', label: 'Services CMS', icon: Package },
  { id: 'casestudies', label: 'Case Studies', icon: Layers },
  { id: 'tickets', label: 'Requests', icon: MessageSquare },
  { id: 'data', label: 'Data & Backup', icon: Database },
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

function StatCard({ label, value, subValue, tone = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 font-heading text-xl sm:text-2xl font-bold ${tone}`}>{value}</p>
      {subValue && <p className="mt-1 font-mono text-[11px] text-slate-500">{subValue}</p>}
    </div>
  );
}

export default function AdminDashboard({ onSignOut, expiresAt }) {
  const [tab, setTab] = useState('pipeline');
  const [confirmRequest, setConfirmRequest] = useState(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);

  const {
    leads = [],
    clients = [],
    projects = [],
    invoices = [],
    deliverables = [],
    tickets = [],
    conversations = [],
  } = useContent();

  const stats = useMemo(() => {
    const pipelineVolume = leads
      .filter((l) => l.status !== 'LOST')
      .reduce((sum, l) => sum + (l.budgetBand === 'ABOVE_25L' ? 3500000 : 650000), 0);

    const totalCollected = invoices.reduce((sum, i) => sum + (Number(i.paidAmount) || 0), 0);

    const unpaidAmount = invoices
      .filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
      .reduce((sum, i) => sum + (Number(i.balanceDue) || Number(i.amount) || 0), 0);

    const activeClientsCount = clients.length;
    const activeProjectsCount = projects.filter((p) => p.status === 'in-progress').length;
    const pendingDel = deliverables.filter((d) => d.status === 'pending').length;
    const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in-progress').length;
    const unreadInbox = conversations.filter((c) => c.unread).length;

    return {
      pipelineVolume,
      totalCollected,
      unpaidAmount,
      activeClientsCount,
      activeProjectsCount,
      pendingDel,
      openTickets,
      unreadInbox,
    };
  }, [leads, clients, projects, invoices, deliverables, tickets, conversations]);

  const handleTriggerAction = (actionId) => {
    if (actionId === 'new-lead') setTab('leads');
    if (actionId === 'new-client') setTab('clients');
    if (actionId === 'new-invoice') setTab('invoices');
    if (actionId === 'new-service') setTab('services');
    if (actionId === 'new-case-study') setTab('casestudies');
    if (actionId === 'new-project') setTab('pipeline');
  };

  return (
    <div className="site-ambience min-h-dvh flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <div className="flex flex-col">
                <span className="font-heading text-sm font-bold tracking-tight text-white">
                  Tanvo Tech
                </span>
                <span className="text-[10px] font-mono text-cyan-400">OPERATIONS OS</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Update Dispatcher */}
            <button
              type="button"
              onClick={() => setIsNotifierOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
            >
              <Send size={13} />
              <span className="hidden sm:inline">Send Update</span>
            </button>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <Search size={13} className="text-slate-400" />
              <span className="hidden sm:inline">Search / Actions</span>
              <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 md:inline">
                ⌘K
              </kbd>
            </button>

            <SessionClock expiresAt={expiresAt} />

            <button
              type="button"
              onClick={onSignOut}
              className="btn-secondary px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              <LogOut size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Lock Gate</span>
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            role="tablist"
            aria-label="Admin panels"
            className="no-scrollbar -mb-px flex gap-1 overflow-x-auto py-2"
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              let badge = null;
              if (id === 'inbox' && stats.unreadInbox > 0) {
                badge = stats.unreadInbox;
              } else if (id === 'leads' && leads.filter((l) => l.status === 'NEW').length > 0) {
                badge = leads.filter((l) => l.status === 'NEW').length;
              } else if (id === 'deliverables' && stats.pendingDel > 0) {
                badge = stats.pendingDel;
              } else if (id === 'invoices' && invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').length > 0) {
                badge = invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').length;
              } else if (id === 'tickets' && stats.openTickets > 0) {
                badge = stats.openTickets;
              }

              return (
                <button
                  key={id}
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={active}
                  aria-controls={`panel-${id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-300 shadow-sm border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-cyan-400' : 'text-slate-500'} />
                  <span>{label}</span>
                  {badge !== null && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                        active
                          ? 'bg-cyan-400 text-slate-950'
                          : id === 'inbox'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Executive KPI Header Bar */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          <StatCard
            label="Revenue Settled"
            value={`₹${(stats.totalCollected).toLocaleString()}`}
            subValue="Corporate Ledger"
            tone="text-emerald-400"
          />
          <StatCard
            label="Receivables Due"
            value={`₹${(stats.unpaidAmount).toLocaleString()}`}
            subValue={stats.unpaidAmount > 0 ? 'Pending Settlement' : 'All Settled'}
            tone={stats.unpaidAmount > 0 ? 'text-amber-400' : 'text-slate-400'}
          />
          <StatCard
            label="Deliverable Reviews"
            value={stats.pendingDel}
            subValue="Awaiting Sign-off"
            tone={stats.pendingDel > 0 ? 'text-amber-400' : 'text-slate-400'}
          />
          <StatCard
            label="Unread Inbound Messages"
            value={stats.unreadInbox}
            subValue="WhatsApp / Email / IG"
            tone={stats.unreadInbox > 0 ? 'text-cyan-400' : 'text-slate-400'}
          />
        </div>

        {/* Tab Panes */}
        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
          className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          {tab === 'pipeline' && <WorkBoard onRequestDelete={setConfirmRequest} />}
          {tab === 'inbox' && <InboxPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'leads' && <LeadsPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'clients' && <ClientsPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'deliverables' && <DeliverablesPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'invoices' && <InvoicesPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'comms' && <CommunicationsPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'services' && <ServicesCMSPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'casestudies' && <CaseStudiesCMSPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'tickets' && <TicketsPanel onConfirmDelete={setConfirmRequest} />}
          {tab === 'data' && <DataTools onRequestConfirm={setConfirmRequest} />}
        </div>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectTab={(newTab) => setTab(newTab)}
        onTriggerAction={handleTriggerAction}
      />

      {/* Quick Notifier Modal */}
      {isNotifierOpen && (
        <ClientNotifierModal onClose={() => setIsNotifierOpen(false)} />
      )}

      <ConfirmDialog request={confirmRequest} onClose={() => setConfirmRequest(null)} />
    </div>
  );
}
