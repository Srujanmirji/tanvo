import { useState } from 'react';
import {
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  ACCENT_CLASSES,
  DELIVERABLE_STATUSES,
} from '../lib/constants';
import {
  deleteDeliverable,
  emptyDeliverable,
  saveDeliverable,
  useContent,
} from '../lib/store';
import Modal from './Modal';
import Field from './Field';

export default function DeliverablesPanel({ onConfirmDelete }) {
  const { deliverables = [], clients = [], projects = [] } = useContent();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleCreate = () => {
    setFormData({
      ...emptyDeliverable(),
      clientId: clients[0]?.id || '',
      projectId: projects[0]?.id || '',
    });
    setIsEditing(true);
  };

  const handleEdit = (del) => {
    setFormData({ ...del });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    saveDeliverable(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Deliverables & Sign-offs</h2>
          <p className="text-xs text-slate-400">
            Publish client deliverables, prototypes, and track client approvals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="btn-primary inline-flex items-center gap-2 self-start px-4 py-2 text-xs font-semibold"
        >
          <Plus size={15} /> Add Deliverable
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {deliverables.map((del) => {
          const client = clients.find((c) => c.id === del.clientId);
          const project = projects.find((p) => p.id === del.projectId);
          const statusObj =
            DELIVERABLE_STATUSES.find((s) => s.id === del.status) || DELIVERABLE_STATUSES[0];
          const accent = ACCENT_CLASSES[statusObj.accent] || ACCENT_CLASSES.amber;

          return (
            <div
              key={del.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl transition hover:border-white/20"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${accent.bg} ${accent.text} border ${accent.border}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                      {statusObj.label}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{del.version}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(del)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                      title="Edit Deliverable"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onConfirmDelete({
                          title: `Delete ${del.title}?`,
                          message: 'This will remove the deliverable from the client portal.',
                          onConfirm: () => deleteDeliverable(del.id),
                        })
                      }
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                      title="Delete Deliverable"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-3 font-heading text-sm font-bold text-white">{del.title}</h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                  {del.description || 'No description provided.'}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span>Client: {client?.company || client?.name || 'Unassigned'}</span>
                  <span>&bull;</span>
                  <span>Project: {project?.title || 'General'}</span>
                  <span>&bull;</span>
                  <span>Type: {del.type}</span>
                </div>

                {del.feedback && (
                  <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-xs text-slate-300">
                    <span className="font-medium text-slate-400">Client Feedback:</span> {del.feedback}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                {del.url ? (
                  <a
                    href={del.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                  >
                    <ExternalLink size={13} /> Deliverable Link
                  </a>
                ) : (
                  <span className="text-xs text-slate-600">No URL configured</span>
                )}

                <span className="text-[11px] text-slate-500">Uploaded {del.uploadedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deliverable Modal */}
      {isEditing && formData && (
        <Modal
          title={formData.title ? 'Edit Deliverable' : 'Add New Deliverable'}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Deliverable Title (Required)">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Interactive Webhook Blueprint"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Assign to Client">
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company || c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Assign to Project">
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Deliverable Type">
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g. Figma / Design"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Version">
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="v1.0"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Approval Status">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {DELIVERABLE_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Asset URL / Preview Link">
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://figma.com/..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </Field>

            <Field label="Description & Scope Overview">
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details on what was completed in this deliverable..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </Field>

            <Field label="Client Feedback / Approval Note">
              <textarea
                rows={2}
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                placeholder="Notes or change requests submitted by the client..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2 text-xs font-semibold">
                Save Deliverable
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
