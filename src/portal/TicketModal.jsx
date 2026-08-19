import { useState } from 'react';
import { MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { ACCENT_CLASSES, TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from '../lib/constants';

export default function TicketModal({
  ticket,
  client,
  projects = [],
  senderRole = 'client', // 'client' | 'admin'
  senderName = 'User',
  onClose,
  onSaveTicket,
  onAddReply,
}) {
  const isNew = !ticket;

  const [formData, setFormData] = useState({
    title: ticket?.title || '',
    projectId: ticket?.projectId || (projects[0]?.id ?? ''),
    category: ticket?.category || TICKET_CATEGORIES[0],
    priority: ticket?.priority || 'medium',
    description: ticket?.description || '',
  });

  const [replyText, setReplyText] = useState('');

  const statusObj = TICKET_STATUSES.find((s) => s.id === ticket?.status) || TICKET_STATUSES[0];
  const priorityObj = TICKET_PRIORITIES.find((p) => p.id === ticket?.priority) || TICKET_PRIORITIES[1];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSaveTicket({
      ...formData,
      clientId: client?.id || ticket?.clientId || '',
    });
    onClose();
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !ticket) return;

    onAddReply(ticket.id, {
      sender: senderRole,
      senderName,
      message: replyText.trim(),
    });
    setReplyText('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-slate-950 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            {!isNew ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${ACCENT_CLASSES[statusObj.accent]?.bg} ${ACCENT_CLASSES[statusObj.accent]?.text} border ${ACCENT_CLASSES[statusObj.accent]?.border}`}>
                  {statusObj.label}
                </span>
                <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${ACCENT_CLASSES[priorityObj.accent]?.bg} ${ACCENT_CLASSES[priorityObj.accent]?.text} border ${ACCENT_CLASSES[priorityObj.accent]?.border}`}>
                  Priority: {priorityObj.label}
                </span>
                <span className="text-xs text-slate-500">&bull; {ticket.category}</span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-300">
                <Sparkles size={13} className="text-cyan-400" />
                New Change Request / Ticket
              </span>
            )}
            <h2 className="mt-2 font-heading text-lg font-bold text-white sm:text-xl">
              {isNew ? 'Submit Request to Engineering Team' : ticket.title}
            </h2>
            <p className="text-xs text-slate-400">
              {isNew
                ? 'Our team usually responds within 2-4 business hours.'
                : `Created on ${new Date(ticket.createdAt).toLocaleDateString()}`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isNew ? (
            <form id="new-ticket-form" onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                  Request Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Add export to CSV on customer table"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    {TICKET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    {TICKET_PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {projects.length > 1 && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Associated Project
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                  Detailed Description & Context
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what needs to be changed, relevant URLs or reproduction steps..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Request Summary:
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-200">
                  {ticket.description || 'No description provided.'}
                </p>
              </div>

              <div className="space-y-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <MessageSquare size={14} className="text-cyan-400" />
                  Conversation Activity:
                </p>

                {ticket.replies && ticket.replies.length > 0 ? (
                  ticket.replies.map((reply) => {
                    const isAdmin = reply.sender === 'admin';
                    return (
                      <div
                        key={reply.id}
                        className={`flex flex-col rounded-xl p-3.5 text-xs ${
                          isAdmin
                            ? 'border border-cyan-500/20 bg-cyan-950/30 ml-4'
                            : 'border border-white/10 bg-white/[0.02] mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1 text-[11px]">
                          <span className={`font-semibold ${isAdmin ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {reply.senderName} {isAdmin && '• Agency Team'}
                          </span>
                          <span className="text-slate-500">
                            {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-300">{reply.message}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs italic text-slate-500">No replies yet. Send a note below.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 sm:px-6">
          {isNew ? (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="new-ticket-form"
                className="btn-primary px-5 py-2 text-xs font-semibold"
              >
                Submit Request &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply as ${senderName}...`}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
              >
                <Send size={13} /> Reply
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
