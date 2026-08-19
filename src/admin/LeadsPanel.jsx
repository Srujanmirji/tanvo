import { useState } from 'react';
import {
  Building,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  UserCheck,
} from 'lucide-react';
import {
  ACCENT_CLASSES,
  BUDGET_BANDS,
  LEAD_STATUSES,
} from '../lib/constants';
import {
  convertLeadToClient,
  deleteLead,
  emptyLead,
  saveLead,
  setLeadStatus,
  useContent,
} from '../lib/store';
import Modal from './Modal';
import Field from './Field';
import QuoteBuilderModal from './QuoteBuilderModal';

export default function LeadsPanel({ onConfirmDelete }) {
  const { leads = [], quotes = [] } = useContent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [leadFormData, setLeadFormData] = useState(null);

  // Quote Builder modal
  const [quoteLead, setQuoteLead] = useState(null);

  // Lost Dialog modal
  const [leadToLose, setLeadToLose] = useState(null);
  const [lostReasonInput, setLostReasonInput] = useState('');

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleStageMove = (leadId, newStatus) => {
    if (newStatus === 'LOST') {
      const target = leads.find((l) => l.id === leadId);
      if (target) {
        setLeadToLose(target);
        setLostReasonInput('');
      }
      return;
    }
    setLeadStatus(leadId, newStatus);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleConfirmLost = () => {
    if (!leadToLose || !lostReasonInput.trim()) return;
    setLeadStatus(leadToLose.id, 'LOST', lostReasonInput.trim());
    setLeadToLose(null);
    setLostReasonInput('');
  };

  const handleConvert = (lead) => {
    const result = convertLeadToClient(lead.id);
    if (result) {
      alert(`🎉 Lead successfully converted to Client: "${result.client.company}"! Project workspace created.`);
      setSelectedLead(null);
    }
  };

  const handleCreateNew = () => {
    setLeadFormData(emptyLead());
    setIsEditing(true);
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!leadFormData.name.trim()) return;
    saveLead(leadFormData);
    setIsEditing(false);
  };

  const activePipelineLeads = leads.filter((l) => l.status !== 'WON' && l.status !== 'LOST');

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">CRM & Inbound Leads Pipeline</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {activePipelineLeads.length} Active in Funnel
            </span>
          </div>
          <p className="text-xs text-slate-400">
            7-stage Kanban workflow: track prospects, issue formal quotes, and convert directly to client workspaces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, company, email..."
              className="w-56 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
            <Search size={13} className="pointer-events-none absolute left-2.5 top-2.5 text-slate-500" />
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
          >
            <Plus size={14} /> New Lead
          </button>
        </div>
      </div>

      {/* 7-Stage Kanban Board */}
      <div className="flex overflow-x-auto no-scrollbar gap-3.5 pb-4">
        {LEAD_STATUSES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
          const accent = ACCENT_CLASSES[stage.accent] || ACCENT_CLASSES.slate;

          return (
            <div
              key={stage.id}
              className="flex min-w-[260px] max-w-[280px] flex-1 flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                  <h3 className="font-heading text-xs font-bold text-white">{stage.label}</h3>
                </div>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="mt-3 flex flex-1 flex-col gap-2.5 min-h-[350px]">
                {stageLeads.map((lead) => {
                  const leadQuotes = quotes.filter((q) => q.leadId === lead.id);
                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="group flex cursor-pointer flex-col justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-cyan-500/40 hover:bg-white/[0.05]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-heading text-xs font-bold text-white group-hover:text-cyan-300">
                            {lead.company || lead.name}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-500">
                            {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <p className="mt-0.5 text-[11px] text-slate-400">{lead.name}</p>

                        <p className="mt-2 line-clamp-2 text-[11px] text-slate-300 leading-relaxed">
                          {lead.message || 'Inbound inquiry received.'}
                        </p>

                        {lead.lostReason && (
                          <div className="mt-2 rounded bg-rose-500/10 p-1.5 text-[10px] text-rose-300">
                            Lost: {lead.lostReason}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-slate-500">
                        <span className="capitalize">{lead.timeline || 'Flexible'}</span>
                        {leadQuotes.length > 0 ? (
                          <span className="font-semibold text-cyan-400">
                            Quote: ${leadQuotes[0].total.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-600">{lead.source}</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageLeads.length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/5 text-center text-[11px] text-slate-600 p-4">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Details Modal / Drawer */}
      {selectedLead && (
        <Modal
          title={selectedLead.company ? `${selectedLead.company} (${selectedLead.name})` : selectedLead.name}
          onClose={() => setSelectedLead(null)}
        >
          <div className="space-y-5">
            {/* Status Selector Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400">
                  Current Pipeline Stage
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStageMove(selectedLead.id, e.target.value)}
                  className="mt-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuoteLead(selectedLead)}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
                >
                  <FileText size={13} /> Build Quote
                </button>

                {selectedLead.status !== 'WON' && (
                  <button
                    type="button"
                    onClick={() => handleConvert(selectedLead)}
                    className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                  >
                    <UserCheck size={13} /> Convert to Client
                  </button>
                )}
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <User size={13} className="text-cyan-400" />
                  <span>Contact:</span> <strong className="text-white">{selectedLead.name}</strong>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Building size={13} className="text-cyan-400" />
                  <span>Company:</span> <span className="text-white">{selectedLead.company || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail size={13} className="text-cyan-400" />
                  <span>Email:</span> <a href={`mailto:${selectedLead.email}`} className="text-cyan-300 hover:underline">{selectedLead.email}</a>
                </div>
                {selectedLead.phone && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone size={13} className="text-cyan-400" />
                    <span>Phone:</span> <span className="text-white">{selectedLead.phone}</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
                <div className="text-slate-400">
                  <span>Budget Band:</span> <strong className="text-slate-200">{selectedLead.budgetBand}</strong>
                </div>
                <div className="text-slate-400">
                  <span>Timeline:</span> <span className="text-slate-200">{selectedLead.timeline}</span>
                </div>
                <div className="text-slate-400">
                  <span>Source:</span> <span className="text-slate-200">{selectedLead.source}</span>
                </div>
                <div className="text-slate-400">
                  <span>Inquired on:</span> <span className="text-slate-200">{new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Inbound Message */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Project Scope / Message:
              </p>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-200">
                {selectedLead.message || 'No initial message text recorded.'}
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Internal Sales & Scoping Notes:
              </p>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-slate-300 leading-relaxed">
                {selectedLead.notes || 'No sales notes recorded.'}
              </div>
            </div>

            {/* Associated Quotes */}
            {quotes.filter((q) => q.leadId === selectedLead.id).length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Issued Proposals & Quotes:
                </p>
                <div className="space-y-2">
                  {quotes
                    .filter((q) => q.leadId === selectedLead.id)
                    .map((quote) => (
                      <div
                        key={quote.id}
                        className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs"
                      >
                        <div>
                          <p className="font-mono font-bold text-cyan-300">{quote.quoteNumber}</p>
                          <p className="text-[11px] text-slate-400">
                            Valid until: {quote.validUntil} &bull; {quote.items.length} line items
                          </p>
                        </div>
                        <span className="font-heading text-sm font-bold text-white">
                          ${quote.total.toLocaleString()} {quote.currency}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() =>
                  onConfirmDelete({
                    title: `Delete Lead ${selectedLead.name}?`,
                    message: 'This will remove the lead record permanently.',
                    onConfirm: () => {
                      deleteLead(selectedLead.id);
                      setSelectedLead(null);
                    },
                  })
                }
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400"
              >
                <Trash2 size={13} /> Delete Lead
              </button>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Lost Reason Dialog */}
      {leadToLose && (
        <Modal
          title={`Mark "${leadToLose.company || leadToLose.name}" as Lost`}
          onClose={() => setLeadToLose(null)}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Please document the primary reason for losing this lead. This maintains agency CRM analytics integrity.
            </p>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Reason for Lost Deal (Required)
              </label>
              <textarea
                rows={3}
                required
                value={lostReasonInput}
                onChange={(e) => setLostReasonInput(e.target.value)}
                placeholder="e.g. Budget below minimum agency threshold ($6k baseline), or opted for internal team..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLeadToLose(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!lostReasonInput.trim()}
                onClick={handleConfirmLost}
                className="rounded-xl bg-rose-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                Confirm Lost Deal
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Lead Modal */}
      {isEditing && leadFormData && (
        <Modal title="Create New Inbound Lead" onClose={() => setIsEditing(false)}>
          <form onSubmit={handleSaveLead} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Contact Person Name (Required)">
                <input
                  type="text"
                  required
                  value={leadFormData.name}
                  onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  placeholder="e.g. Ananya Deshmukh"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Company Name">
                <input
                  type="text"
                  value={leadFormData.company}
                  onChange={(e) => setLeadFormData({ ...leadFormData, company: e.target.value })}
                  placeholder="e.g. HyperFlow Logistics"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Work Email">
                <input
                  type="email"
                  required
                  value={leadFormData.email}
                  onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                  placeholder="ananya@hyperflow.in"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Phone / WhatsApp">
                <input
                  type="text"
                  value={leadFormData.phone}
                  onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                  placeholder="+91 98000 00000"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Budget Band">
                <select
                  value={leadFormData.budgetBand}
                  onChange={(e) => setLeadFormData({ ...leadFormData, budgetBand: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {BUDGET_BANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Target Timeline">
                <input
                  type="text"
                  value={leadFormData.timeline}
                  onChange={(e) => setLeadFormData({ ...leadFormData, timeline: e.target.value })}
                  placeholder="e.g. 6-8 weeks"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <Field label="Project Scope & Message">
              <textarea
                rows={3}
                value={leadFormData.message}
                onChange={(e) => setLeadFormData({ ...leadFormData, message: e.target.value })}
                placeholder="Details on what they need built..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <Field label="Internal Sales Notes">
              <textarea
                rows={2}
                value={leadFormData.notes}
                onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                placeholder="Initial call takeaways, tech requirements..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-cyan-400"
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
                Save Lead to CRM
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Quote Builder Modal */}
      {quoteLead && (
        <QuoteBuilderModal
          lead={quoteLead}
          onClose={() => setQuoteLead(null)}
          onCreated={() => {
            if (selectedLead?.id === quoteLead.id) {
              setLeadStatus(quoteLead.id, 'PROPOSAL_SENT');
            }
          }}
        />
      )}
    </div>
  );
}
