import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  Mail,
  Pencil,
  Phone,
  Send,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { deleteClient, emptyClient, saveClient, useContent } from '../lib/store';
import Modal from './Modal';
import Field from './Field';
import ClientNotifierModal from './ClientNotifierModal';

export default function ClientsPanel({ onConfirmDelete }) {
  const { clients = [], projects = [], invoices = [], tickets = [] } = useContent();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [notifyingClient, setNotifyingClient] = useState(null);

  const handleCreate = () => {
    setFormData(emptyClient());
    setIsEditing(true);
  };

  const handleEdit = (client) => {
    setFormData({ ...client });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    saveClient(formData);
    setIsEditing(false);
  };

  const handleCopyCode = (client) => {
    navigator.clipboard.writeText(client.accessCode);
    setCopiedCodeId(client.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Client Accounts & Workspaces</h2>
          <p className="text-xs text-slate-400">
            Manage client profiles, access codes, and live workspaces.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="btn-primary inline-flex items-center gap-2 self-start px-4 py-2 text-xs font-semibold"
        >
          <UserPlus size={15} /> Add New Client
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const clientProjects = projects.filter(
            (p) =>
              p.clientId === client.id ||
              (client.company && p.client?.toLowerCase().includes(client.company.toLowerCase())),
          );
          const clientInvoices = invoices.filter((inv) => inv.clientId === client.id);
          const totalSpent = clientInvoices
            .filter((i) => i.status === 'paid')
            .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
          const openTickets = tickets.filter(
            (t) => t.clientId === client.id && t.status !== 'resolved',
          ).length;

          return (
            <div
              key={client.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl transition hover:border-cyan-500/30"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="h-11 w-11 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-300">
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading text-sm font-bold text-white">
                        {client.company || client.name}
                      </h3>
                      <p className="text-xs text-slate-400">{client.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setNotifyingClient(client)}
                      title="Send WhatsApp / Email Update"
                      className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                    >
                      <Send size={14} />
                    </button>
                    <Link
                      to={`/portal?code=${client.accessCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Client Workspace"
                      className="rounded-lg p-1.5 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(client)}
                      title="Edit Client"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onConfirmDelete({
                          title: `Delete ${client.company || client.name}?`,
                          message: 'This will remove the client account and workspace access.',
                          onConfirm: () => deleteClient(client.id),
                        })
                      }
                      title="Delete Client"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-500" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-500" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>

                {/* Access Code Box */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                  <div className="flex items-center gap-2">
                    <KeyRound size={14} className="text-cyan-400" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-500">Access Code</p>
                      <p className="font-mono text-xs font-bold text-white">{client.accessCode}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(client)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10"
                  >
                    {copiedCodeId === client.id ? (
                      <>
                        <Check size={12} className="text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-500">Projects</p>
                  <p className="font-semibold text-slate-200">{clientProjects.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Paid Revenue</p>
                  <p className="font-semibold text-emerald-400">${totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Open Tickets</p>
                  <p className="font-semibold text-sky-400">{openTickets}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Client Modal */}
      {isEditing && formData && (
        <Modal
          title={formData.name ? `Edit ${formData.company || formData.name}` : 'Add New Client'}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Client Contact Person (Required)">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </Field>

            <Field label="Company / Organisation Name">
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. NovaTech Analytics"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email Address">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@novatech.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Phone / WhatsApp">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Access Code (For Client Portal)">
                <input
                  type="text"
                  required
                  value={formData.accessCode}
                  onChange={(e) =>
                    setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. NOVA-2026"
                  className="w-full font-mono rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Client Avatar / Logo URL">
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://... or empty for initials"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <Field label="Internal Client Notes (Visible in Portal Overview)">
              <textarea
                rows={3}
                value={formData.portalNotes || ''}
                onChange={(e) => setFormData({ ...formData, portalNotes: e.target.value })}
                placeholder="High-priority client. Weekly syncs on Thursday 4 PM IST."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2 text-xs font-semibold">
                Save Client Account
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Client Notifier Modal */}
      {notifyingClient && (
        <ClientNotifierModal
          initialClient={notifyingClient}
          onClose={() => setNotifyingClient(null)}
        />
      )}
    </div>
  );
}
