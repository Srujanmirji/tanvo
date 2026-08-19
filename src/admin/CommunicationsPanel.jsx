import { useState } from 'react';
import {
  Clock,
  Mail,
  MessageCircle,
  Send,
  Trash2,
  Users,
} from 'lucide-react';
import { deleteDispatchLog, useContent } from '../lib/store';
import ClientNotifierModal from './ClientNotifierModal';

export default function CommunicationsPanel({ onConfirmDelete }) {
  const { dispatchLogs = [], clients = [] } = useContent();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedClientForNotify, setSelectedClientForNotify] = useState(null);

  const whatsappCount = dispatchLogs.filter((d) => d.channel === 'WHATSAPP' || d.channel === 'BOTH').length;
  const emailCount = dispatchLogs.filter((d) => d.channel === 'EMAIL' || d.channel === 'BOTH').length;

  const handleCompose = (client = null) => {
    setSelectedClientForNotify(client);
    setIsComposeOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Client Communications & Broadcasts</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              Email & WhatsApp
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Dispatch sprint deployment updates, deliverable review requests, and milestone invoices directly to client emails & WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleCompose()}
          className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold shadow-lg shadow-cyan-500/20"
        >
          <Send size={14} /> Compose & Dispatch Update
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase tracking-wider font-semibold">
            <MessageCircle size={15} /> WhatsApp Broadcasts
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-emerald-300 font-mono">
            {whatsappCount} Dispatched
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Direct click-to-chat delivery</p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/10 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-blue-400 uppercase tracking-wider font-semibold">
            <Mail size={15} /> Email Notifications
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-blue-300 font-mono">
            {emailCount} Delivered
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Sprint digests & invoice notices</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-cyan-400 uppercase tracking-wider font-semibold">
            <Users size={15} /> Active Client Reach
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-white font-mono">
            {clients.length} Workspaces
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Synced across portal credentials</p>
        </div>
      </div>

      {/* Quick Launch Client Row */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Quick Notify by Client:
        </p>
        <div className="flex flex-wrap gap-2">
          {clients.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCompose(c)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Send size={12} className="text-cyan-400" />
              <span>{c.company || c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dispatch History Audit Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="border-b border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
            <Clock size={15} className="text-cyan-400" />
            Dispatch Log & Communication History
          </h3>
          <span className="text-xs text-slate-500 font-mono">{dispatchLogs.length} Total Logs</span>
        </div>

        {dispatchLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 font-mono">
            No updates dispatched yet. Click &quot;Compose & Dispatch Update&quot; above to send your first message.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.01] uppercase tracking-wider text-slate-400 text-[11px]">
              <tr>
                <th className="p-3.5">Client & Target</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Update Subject / Type</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {dispatchLogs.map((log) => {
                const isWa = log.channel === 'WHATSAPP' || log.channel === 'BOTH';
                const isEm = log.channel === 'EMAIL' || log.channel === 'BOTH';

                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-3.5">
                      <p className="font-semibold text-white">{log.clientName || 'Client'}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                        {log.recipientPhone || log.recipientEmail}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        {isWa && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                            <MessageCircle size={11} /> WhatsApp
                          </span>
                        )}
                        {isEm && (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                            <Mail size={11} /> Email
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <p className="font-medium text-slate-200">{log.subject}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-md mt-0.5">{log.body}</p>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="p-3.5">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        ● Delivered
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onConfirmDelete({
                            title: 'Delete this communication log?',
                            message: 'This will remove the dispatch entry from the audit history.',
                            onConfirm: () => deleteDispatchLog(log.id),
                          })
                        }
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                        title="Delete log"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Compose & Dispatch Modal */}
      {isComposeOpen && (
        <ClientNotifierModal
          initialClient={selectedClientForNotify}
          onClose={() => setIsComposeOpen(false)}
        />
      )}
    </div>
  );
}
