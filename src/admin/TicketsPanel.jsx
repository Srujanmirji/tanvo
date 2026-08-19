import { useState } from 'react';
import {
  Filter,
  MessageSquare,
  MessageSquarePlus,
  Trash2,
} from 'lucide-react';
import {
  ACCENT_CLASSES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '../lib/constants';
import {
  addTicketReply,
  deleteTicket,
  saveTicket,
  updateTicketStatus,
  useContent,
} from '../lib/store';
import TicketModal from '../portal/TicketModal';

export default function TicketsPanel({ onConfirmDelete }) {
  const { tickets = [], clients = [], projects = [] } = useContent();

  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTicket, setActiveTicket] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Client Requests & Support Inbox</h2>
          <p className="text-xs text-slate-400">
            Triage change requests, communicate with clients, and update resolution statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
            <Filter size={13} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white outline-none"
            >
              <option value="all" className="bg-slate-900">All Statuses ({tickets.length})</option>
              {TICKET_STATUSES.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900">
                  {s.label} ({tickets.filter((t) => t.status === s.id).length})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
          >
            <MessageSquarePlus size={14} /> New Ticket
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((t) => {
            const client = clients.find((c) => c.id === t.clientId);
            const project = projects.find((p) => p.id === t.projectId);
            const statusObj =
              TICKET_STATUSES.find((s) => s.id === t.status) || TICKET_STATUSES[0];
            const priorityObj =
              TICKET_PRIORITIES.find((p) => p.id === t.priority) || TICKET_PRIORITIES[1];

            return (
              <div
                key={t.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl transition hover:border-cyan-500/30 sm:flex-row sm:items-center"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setActiveTicket(t)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${ACCENT_CLASSES[statusObj.accent]?.bg} ${ACCENT_CLASSES[statusObj.accent]?.text}`}
                    >
                      {statusObj.label}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${ACCENT_CLASSES[priorityObj.accent]?.bg} ${ACCENT_CLASSES[priorityObj.accent]?.text}`}
                    >
                      {priorityObj.label} Priority
                    </span>
                    <span className="text-xs text-slate-500">&bull; {t.category}</span>
                  </div>

                  <h3 className="mt-2 font-heading text-sm font-bold text-white hover:text-cyan-300">
                    {t.title}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                    {t.description || 'No description.'}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>Client: <strong className="text-slate-300">{client?.company || client?.name || '—'}</strong></span>
                    <span>&bull;</span>
                    <span>Project: {project?.title || 'General'}</span>
                    <span>&bull;</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <select
                    value={t.status}
                    onChange={(e) => updateTicketStatus(t.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-cyan-400"
                  >
                    {TICKET_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setActiveTicket(t)}
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20"
                  >
                    <MessageSquare size={13} />
                    <span>{t.replies?.length || 0}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onConfirmDelete({
                        title: `Delete Request "${t.title}"?`,
                        message: 'This will remove the ticket from the system.',
                        onConfirm: () => deleteTicket(t.id),
                      })
                    }
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                    title="Delete Request"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-slate-400">
            No support tickets match the current filter.
          </div>
        )}
      </div>

      {/* Ticket Modal for Thread & Reply */}
      {(activeTicket || isCreating) && (
        <TicketModal
          ticket={activeTicket}
          client={clients.find((c) => c.id === activeTicket?.clientId) || clients[0]}
          projects={projects}
          senderRole="admin"
          senderName="Tanvo Studio Team"
          onClose={() => {
            setActiveTicket(null);
            setIsCreating(false);
          }}
          onSaveTicket={saveTicket}
          onAddReply={addTicketReply}
        />
      )}
    </div>
  );
}
