import { useState } from 'react';
import {
  CheckCircle2,
  Play,
  Plus,
  Repeat,
  Trash2,
  X,
} from 'lucide-react';
import { CURRENCIES, RECURRING_FREQUENCIES } from '../lib/constants';
import {
  deleteRecurringProfile,
  generateRetainerInvoices,
  saveRecurringProfile,
  useContent,
} from '../lib/store';

export default function RecurringInvoicesModal({ onClose }) {
  const { recurringProfiles = [], clients = [], projects = [] } = useContent();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Monthly Dedicated AI Engineering & DevOps SLA Retainer',
    clientId: clients[0]?.id || '',
    projectId: projects[0]?.id || '',
    frequency: 'MONTHLY',
    amount: 350000,
    currency: 'INR',
    taxRatePct: 18,
    sacCode: '998314',
    nextRunDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    autoGenerate: true,
    status: 'ACTIVE',
  });
  const [generatedCount, setGeneratedCount] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    saveRecurringProfile({
      ...formData,
      clientName: client?.company || client?.name || 'Client',
    });
    setIsAdding(false);
  };

  const handleTriggerBatch = () => {
    const count = generateRetainerInvoices();
    setGeneratedCount(count);
    setTimeout(() => {
      setGeneratedCount(null);
    }, 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-white sm:text-xl">
                Recurring Retainers & SLA Schedules
              </span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                {recurringProfiles.length} Active Retainers
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Configure automatic milestone retainer profiles generated on a monthly, quarterly, or bi-weekly cadence.
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

        {/* Action Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold"
          >
            <Plus size={13} /> {isAdding ? 'Cancel' : 'New Retainer Profile'}
          </button>

          <button
            type="button"
            onClick={handleTriggerBatch}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
          >
            <Play size={13} /> Generate Due Retainer Invoices
          </button>
        </div>

        {generatedCount !== null && (
          <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Generated {generatedCount} recurring tax invoice(s) into the live billing queue!</span>
          </div>
        )}

        {/* Add Retainer Form */}
        {isAdding && (
          <form onSubmit={handleSave} className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-900/90 p-4 space-y-3">
            <h4 className="font-heading text-xs font-bold text-cyan-400 uppercase">Create Recurring Retainer</h4>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.company || c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Retainer Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Cadence Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white"
                >
                  {RECURRING_FREQUENCIES.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Amount & Currency</label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.id}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase">Next Invoice Generation Date</label>
                <input
                  type="date"
                  value={formData.nextRunDate}
                  onChange={(e) => setFormData({ ...formData, nextRunDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-4 py-1.5 text-xs font-semibold"
              >
                Save Retainer Schedule
              </button>
            </div>
          </form>
        )}

        {/* Existing Retainers List */}
        <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {recurringProfiles.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No active recurring retainer profiles configured.
            </div>
          ) : (
            recurringProfiles.map((p) => {
              const client = clients.find((c) => c.id === p.clientId);
              const currObj = CURRENCIES.find((c) => c.id === p.currency) || CURRENCIES[0];

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-500/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Repeat size={14} className="text-cyan-400" />
                      <h5 className="font-heading text-sm font-bold text-white">{p.title}</h5>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                        {p.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Client: <strong className="text-slate-200">{client?.company || p.clientName || 'Client'}</strong> &bull; Next Run: <span className="font-mono text-amber-300">{p.nextRunDate}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-heading text-base font-bold text-emerald-400 font-mono">
                      {currObj.symbol}{Number(p.amount).toLocaleString()} {p.currency}
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteRecurringProfile(p.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="btn-primary px-5 py-2 text-xs">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
