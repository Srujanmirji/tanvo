import { useState } from 'react';
import {
  Download,
  FileText,
  Lock,
  Pencil,
  Plus,
  Printer,
  Repeat,
  Send,
  Trash2,
} from 'lucide-react';
import {
  ACCENT_CLASSES,
  BANK_DETAILS,
  CURRENCIES,
  INVOICE_STATUSES,
  SITE,
} from '../lib/constants';
import {
  deleteInvoice,
  emptyInvoice,
  getReceivablesAgeing,
  saveInvoice,
  uid,
  useContent,
} from '../lib/store';
import Modal from './Modal';
import Field from './Field';
import ClientNotifierModal from './ClientNotifierModal';
import RecordPaymentModal from './RecordPaymentModal';
import CreditNoteModal from './CreditNoteModal';
import RecurringInvoicesModal from './RecurringInvoicesModal';
import { downloadInvoicePDF } from '../lib/pdfGenerator';

export default function InvoicesPanel({ onConfirmDelete: _onConfirmDelete }) {
  const {
    invoices = [],
    clients = [],
    projects = [],
    creditNotes = [],
    recurringProfiles = [],
  } = useContent();

  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'ageing' | 'creditNotes'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [notifyInvoice, setNotifyInvoice] = useState(null);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [creditNoteInvoice, setCreditNoteInvoice] = useState(null);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);

  const ageingBuckets = getReceivablesAgeing(invoices);

  const handleCreate = () => {
    setFormData({
      ...emptyInvoice(),
      clientId: clients[0]?.id || '',
      projectId: projects[0]?.id || '',
    });
    setIsEditing(true);
  };

  const handleEdit = (inv) => {
    setFormData({ ...inv });
    setIsEditing(true);
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { id: uid('item'), description: 'Milestone scope deliverable', qty: 1, rate: 250000, sacCode: '998311', amount: 250000 },
      ],
    }));
  };

  const handleItemChange = (itemId, field, value) => {
    setFormData((prev) => {
      const items = (prev.items || []).map((it) => {
        if (it.id !== itemId) return it;
        const updated = { ...it, [field]: value };
        if (field === 'qty' || field === 'rate') {
          updated.amount = (Number(updated.qty) || 0) * (Number(updated.rate) || 0);
        }
        return updated;
      });

      const subtotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
      const taxAmount = Math.round(subtotal * ((Number(prev.taxRatePct) || 0) / 100));
      const amount = subtotal + taxAmount;
      const balanceDue = Math.max(0, amount - (Number(prev.paidAmount) || 0));

      return {
        ...prev,
        items,
        subtotal,
        taxAmount,
        amount,
        balanceDue,
      };
    });
  };

  const handleRemoveItem = (itemId) => {
    setFormData((prev) => {
      const items = (prev.items || []).filter((it) => it.id !== itemId);
      const subtotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
      const taxAmount = Math.round(subtotal * ((Number(prev.taxRatePct) || 0) / 100));
      const amount = subtotal + taxAmount;
      const balanceDue = Math.max(0, amount - (Number(prev.paidAmount) || 0));
      return { ...prev, items, subtotal, taxAmount, amount, balanceDue };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    saveInvoice(formData);
    setIsEditing(false);
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + (Number(inv.balanceDue) || Number(inv.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Invoicing & Tax Engine</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              GST / Multi-Currency / FY Series
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Generate sequential tax invoices (TNV/25-26/xxxx), track receivables ageing, issue credit notes, and record settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRecurringModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <Repeat size={14} className="text-cyan-400" /> Retainers ({recurringProfiles.length})
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold shadow-lg shadow-cyan-500/20"
          >
            <Plus size={14} /> New Tax Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total Billed</p>
          <p className="mt-1 font-heading text-2xl font-bold text-white font-mono">
            ₹{totalInvoiced.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{invoices.length} Invoices Issued</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Total Collected</p>
          <p className="mt-1 font-heading text-2xl font-bold text-emerald-300 font-mono">
            ₹{totalCollected.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Settled in corporate ledger</p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Outstanding Receivables</p>
          <p className="mt-1 font-heading text-2xl font-bold text-amber-300 font-mono">
            ₹{totalOutstanding.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Pending milestone settlement</p>
        </div>
      </div>

      {/* Receivables Ageing Bar */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-300">
            📊 Receivables Ageing Analysis
          </h3>
          <span className="text-[11px] text-slate-500">Overdue breakdown</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5">
            <p className="text-[10px] text-emerald-400 font-semibold uppercase">{ageingBuckets.current.label}</p>
            <p className="font-heading text-base font-bold text-white font-mono mt-0.5">
              ₹{ageingBuckets.current.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">{ageingBuckets.current.count} invoices</p>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-2.5">
            <p className="text-[10px] text-cyan-400 font-semibold uppercase">{ageingBuckets.overdue30.label}</p>
            <p className="font-heading text-base font-bold text-cyan-300 font-mono mt-0.5">
              ₹{ageingBuckets.overdue30.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">{ageingBuckets.overdue30.count} invoices</p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
            <p className="text-[10px] text-amber-400 font-semibold uppercase">{ageingBuckets.overdue60.label}</p>
            <p className="font-heading text-base font-bold text-amber-300 font-mono mt-0.5">
              ₹{ageingBuckets.overdue60.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">{ageingBuckets.overdue60.count} invoices</p>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-2.5">
            <p className="text-[10px] text-rose-400 font-semibold uppercase">{ageingBuckets.overdue90.label}</p>
            <p className="font-heading text-base font-bold text-rose-300 font-mono mt-0.5">
              ₹{ageingBuckets.overdue90.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">{ageingBuckets.overdue90.count} invoices</p>
          </div>

          <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-2.5">
            <p className="text-[10px] text-red-400 font-semibold uppercase">{ageingBuckets.overdue90Plus.label}</p>
            <p className="font-heading text-base font-bold text-red-400 font-mono mt-0.5">
              ₹{ageingBuckets.overdue90Plus.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">{ageingBuckets.overdue90Plus.count} invoices</p>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex gap-2 border-b border-white/10 pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`rounded-lg px-3 py-1.5 font-semibold transition ${
            activeTab === 'invoices'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Invoices ({invoices.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('creditNotes')}
          className={`rounded-lg px-3 py-1.5 font-semibold transition ${
            activeTab === 'creditNotes'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Credit Notes ({creditNotes.length})
        </button>
      </div>

      {/* Main Invoices Table */}
      {activeTab === 'invoices' ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 bg-slate-900/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3.5">Invoice Series #</th>
                  <th className="px-4 py-3.5">Client & Project</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Total & Balance</th>
                  <th className="px-4 py-3.5">Due Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No invoices generated yet. Click "New Tax Invoice" to create one.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const client = clients.find((c) => c.id === inv.clientId);
                    const project = projects.find((p) => p.id === inv.projectId);
                    const statusObj = INVOICE_STATUSES.find((s) => s.id === inv.status) || INVOICE_STATUSES[0];
                    const accent = ACCENT_CLASSES[statusObj.accent] || ACCENT_CLASSES.amber;
                    const currencyObj = CURRENCIES.find((c) => c.id === inv.currency) || CURRENCIES[0];

                    return (
                      <tr key={inv.id} className="transition hover:bg-white/[0.02]">
                        {/* Invoice Number */}
                        <td className="px-4 py-3 font-mono font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            {inv.locked && <Lock size={12} className="text-slate-500" title="Locked against item modifications" />}
                            <span className="text-cyan-400">{inv.invoiceNumber}</span>
                          </div>
                          <span className="block text-[10px] font-sans font-normal text-slate-500">
                            Issued: {inv.issuedDate}
                          </span>
                        </td>

                        {/* Client & Project */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white">{client?.company || client?.name || 'Unknown Client'}</p>
                          <p className="text-[11px] text-slate-400">{inv.title}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${accent.bg} ${accent.text} border ${accent.border}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                            {statusObj.label}
                          </span>
                        </td>

                        {/* Total & Balance */}
                        <td className="px-4 py-3 font-mono">
                          <p className="font-bold text-white">
                            {currencyObj.symbol}{Number(inv.amount).toLocaleString()} {inv.currency}
                          </p>
                          {inv.status !== 'paid' && Number(inv.balanceDue) > 0 && (
                            <p className="text-[10px] text-amber-400">
                              Bal: {currencyObj.symbol}{Number(inv.balanceDue).toLocaleString()}
                            </p>
                          )}
                        </td>

                        {/* Due Date */}
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {inv.dueDate || 'Upon receipt'}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Record Payment Button */}
                            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => setPaymentInvoice(inv)}
                                title="Record Settlement"
                                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20"
                              >
                                Record Pay
                              </button>
                            )}

                            {/* Download PDF */}
                            <button
                              type="button"
                              onClick={() => downloadInvoicePDF(inv, client, project, BANK_DETAILS, SITE)}
                              title="Download Official PDF"
                              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                            >
                              <Download size={13} />
                            </button>

                            {/* Print / View Letterhead */}
                            <button
                              type="button"
                              onClick={() => setPrintInvoice(inv)}
                              title="Print Letterhead Receipt"
                              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                            >
                              <Printer size={13} />
                            </button>

                            {/* Send via WhatsApp / Email */}
                            <button
                              type="button"
                              onClick={() => setNotifyInvoice(inv)}
                              title="Send Update to Client"
                              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                            >
                              <Send size={13} />
                            </button>

                            {/* Issue Credit Note */}
                            {inv.locked && inv.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => setCreditNoteInvoice(inv)}
                                title="Issue Credit Note Correction"
                                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:bg-amber-500/10 hover:text-amber-300"
                              >
                                <FileText size={13} />
                              </button>
                            )}

                            {/* Edit (only if draft) */}
                            {!inv.locked && (
                              <button
                                type="button"
                                onClick={() => handleEdit(inv)}
                                title="Edit Draft"
                                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                              >
                                <Pencil size={13} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                                  deleteInvoice(inv.id);
                                }
                              }}
                              title="Delete Invoice"
                              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Credit Notes Tab */
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl">
          <h3 className="font-heading text-sm font-bold text-white mb-4">Issued Credit Notes</h3>
          {creditNotes.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No credit notes issued yet.</p>
          ) : (
            <div className="space-y-3">
              {creditNotes.map((cn) => {
                const currObj = CURRENCIES.find((c) => c.id === cn.currency) || CURRENCIES[0];
                return (
                  <div key={cn.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
                        <span>{cn.creditNoteNumber}</span>
                        <span className="text-slate-500">&bull; Linked to {cn.invoiceNumber}</span>
                      </div>
                      <p className="text-xs font-semibold text-white mt-1">{cn.clientName}</p>
                      <p className="text-[11px] text-slate-400">{cn.reason}</p>
                      <span className="text-[10px] text-slate-500">Issued: {cn.issuedDate}</span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="font-heading text-base font-bold text-rose-400">
                        -{currObj.symbol}{Number(cn.amount).toLocaleString()} {cn.currency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit / Create Invoice Modal */}
      {isEditing && formData && (
        <Modal
          title={formData.id && invoices.some((i) => i.id === formData.id) ? `Edit Invoice (${formData.invoiceNumber})` : 'New Sequential Tax Invoice'}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Invoice Series #">
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="field-input font-mono font-bold text-cyan-400"
                  required
                />
              </Field>

              <Field label="Client Account">
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="field-input"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.company || c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Invoice Title / Milestone Name" full>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="field-input"
                  required
                />
              </Field>

              <Field label="Currency">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="field-input"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="GST Tax Rate (%)">
                <input
                  type="number"
                  value={formData.taxRatePct}
                  onChange={(e) => {
                    const rate = Number(e.target.value) || 0;
                    const subtotal = (formData.items || []).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
                    const taxAmount = Math.round(subtotal * (rate / 100));
                    setFormData({
                      ...formData,
                      taxRatePct: rate,
                      taxAmount,
                      amount: subtotal + taxAmount,
                      balanceDue: subtotal + taxAmount - (Number(formData.paidAmount) || 0),
                    });
                  }}
                  className="field-input"
                />
              </Field>

              <Field label="Issued Date">
                <input
                  type="date"
                  value={formData.issuedDate}
                  onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                  className="field-input"
                />
              </Field>

              <Field label="Payment Due Date">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="field-input"
                />
              </Field>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-300">
                  Itemized Scope & SAC Deliverables
                </h4>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  + Add Item Line
                </button>
              </div>

              {(formData.items || []).map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 rounded-xl border border-white/5 bg-slate-900/60 p-2 text-xs">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Scope description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full rounded border border-white/10 bg-slate-950 p-1.5 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="SAC 998311"
                      value={item.sacCode}
                      onChange={(e) => handleItemChange(item.id, 'sacCode', e.target.value)}
                      className="w-full rounded border border-white/10 bg-slate-950 p-1.5 font-mono text-white text-center"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                      className="w-full rounded border border-white/10 bg-slate-950 p-1.5 font-mono text-white text-right"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="rounded-xl border border-white/5 bg-slate-900 p-4 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formData.currency} {Number(formData.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax ({formData.taxRatePct}%):</span>
                <span className="font-mono text-white">{formData.currency} {Number(formData.taxAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-cyan-400 border-t border-white/10 pt-2">
                <span>Grand Total:</span>
                <span className="font-mono">{formData.currency} {Number(formData.amount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2 text-xs font-semibold">
                Save & Lock Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Record Payment Modal */}
      {paymentInvoice && (
        <RecordPaymentModal
          invoice={paymentInvoice}
          client={clients.find((c) => c.id === paymentInvoice.clientId)}
          onClose={() => setPaymentInvoice(null)}
        />
      )}

      {/* Issue Credit Note Modal */}
      {creditNoteInvoice && (
        <CreditNoteModal
          invoice={creditNoteInvoice}
          client={clients.find((c) => c.id === creditNoteInvoice.clientId)}
          onClose={() => setCreditNoteInvoice(null)}
        />
      )}

      {/* Recurring Retainers Modal */}
      {isRecurringModalOpen && (
        <RecurringInvoicesModal onClose={() => setIsRecurringModalOpen(false)} />
      )}

      {/* Notifier Modal */}
      {notifyInvoice && (
        <ClientNotifierModal
          initialClient={clients.find((c) => c.id === notifyInvoice.clientId)}
          onClose={() => setNotifyInvoice(null)}
        />
      )}

      {/* Printable Invoice Modal */}
      {printInvoice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-white p-8 text-slate-900 shadow-2xl">
            <div className="flex justify-between border-b-2 border-cyan-600 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-cyan-600 tracking-tight">TANVO TECH</h2>
                <p className="text-xs text-slate-500 font-semibold">{SITE.legalName}</p>
                <p className="text-[11px] text-slate-500">GSTIN: {SITE.gstin} | PAN: {SITE.pan}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold uppercase text-slate-900">TAX INVOICE</p>
                <p className="font-mono text-xs font-bold text-cyan-600">{printInvoice.invoiceNumber}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setPrintInvoice(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => downloadInvoicePDF(printInvoice, clients.find((c) => c.id === printInvoice.clientId), projects.find((p) => p.id === printInvoice.projectId), BANK_DETAILS, SITE)}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
