import { useState } from 'react';
import {
  Pencil,
  Plus,
  Printer,
  Send,
  Trash2,
} from 'lucide-react';
import {
  ACCENT_CLASSES,
  CURRENCIES,
  INVOICE_STATUSES,
  SITE,
} from '../lib/constants';
import {
  deleteInvoice,
  emptyInvoice,
  markInvoicePaid,
  saveInvoice,
  uid,
  useContent,
} from '../lib/store';
import Modal from './Modal';
import Field from './Field';
import ClientNotifierModal from './ClientNotifierModal';

export default function InvoicesPanel({ onConfirmDelete }) {
  const { invoices = [], clients = [], projects = [] } = useContent();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [notifyInvoice, setNotifyInvoice] = useState(null);

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
        { id: uid('item'), description: 'Milestone scope deliverable', qty: 1, rate: 2500, sacCode: '998311', amount: 2500 },
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

      return {
        ...prev,
        items,
        subtotal,
        taxAmount,
        amount,
      };
    });
  };

  const handleRemoveItem = (itemId) => {
    setFormData((prev) => {
      const items = (prev.items || []).filter((it) => it.id !== itemId);
      const subtotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
      const taxAmount = Math.round(subtotal * ((Number(prev.taxRatePct) || 0) / 100));
      const amount = subtotal + taxAmount;
      return { ...prev, items, subtotal, taxAmount, amount };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    saveInvoice(formData);
    setIsEditing(false);
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalCollected = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Invoicing & Tax Engine</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              GST / Multi-Currency Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Generate itemized tax invoices with SAC codes, 18% GST calculation, and printable agency letterhead receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="btn-primary inline-flex items-center gap-2 self-start px-4 py-2 text-xs font-semibold"
        >
          <Plus size={15} /> Issue New Invoice
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total Billed & Issued</p>
          <p className="mt-1 font-heading text-2xl font-bold text-white">
            ${totalInvoiced.toLocaleString()} USD
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate-500">≈ ₹{(totalInvoiced * 83).toLocaleString()} INR</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wider text-emerald-400">Collected Revenue</p>
          <p className="mt-1 font-heading text-2xl font-bold text-emerald-400">
            ${totalCollected.toLocaleString()} USD
          </p>
          <p className="mt-1 text-[11px] text-emerald-300">
            {invoices.filter((i) => i.status === 'paid').length} invoices settled
          </p>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-wider text-rose-400">Outstanding Receivables</p>
          <p className="mt-1 font-heading text-2xl font-bold text-rose-400">
            ${totalPending.toLocaleString()} USD
          </p>
          <p className="mt-1 text-[11px] text-rose-300">
            {invoices.filter((i) => i.status !== 'paid').length} pending payment
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-white/[0.02] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Client</th>
              <th className="p-4">Milestone Title</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {invoices.map((inv) => {
              const client = clients.find((c) => c.id === inv.clientId);
              const statusObj =
                INVOICE_STATUSES.find((s) => s.id === inv.status) || INVOICE_STATUSES[0];
              const accent = ACCENT_CLASSES[statusObj.accent] || ACCENT_CLASSES.amber;
              const currencyObj = CURRENCIES.find((c) => c.id === inv.currency) || CURRENCIES[1];

              return (
                <tr key={inv.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-mono font-bold text-cyan-400">{inv.invoiceNumber}</td>
                  <td className="p-4 font-medium text-white">{client?.company || client?.name || '—'}</td>
                  <td className="p-4 text-slate-200">{inv.title}</td>
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const client = clients.find((c) => c.id === inv.clientId) || null;
                          setNotifyInvoice(client || { id: inv.clientId, company: inv.clientName || 'Client' });
                        }}
                        className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20"
                        title="Send Invoice via WhatsApp / Email"
                      >
                        <Send size={11} /> Send
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrintInvoice(inv)}
                        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white"
                        title="Print / View Tax Invoice"
                      >
                        <Printer size={12} /> Tax Invoice
                      </button>

                      {inv.status !== 'paid' && (
                        <button
                          type="button"
                          onClick={() => markInvoicePaid(inv.id)}
                          className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/25"
                        >
                          Mark Paid
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleEdit(inv)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                        title="Edit Invoice"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onConfirmDelete({
                            title: `Delete Invoice ${inv.invoiceNumber}?`,
                            message: 'This will remove the invoice record permanently.',
                            onConfirm: () => deleteInvoice(inv.id),
                          })
                        }
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                        title="Delete Invoice"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Printable Tax Invoice Modal */}
      {printInvoice && (
        <Modal
          title={`Formal Tax Invoice: ${printInvoice.invoiceNumber}`}
          onClose={() => setPrintInvoice(null)}
        >
          <div className="space-y-6">
            {/* Invoice Print Container */}
            <div id="printable-tax-invoice" className="rounded-2xl border border-white/10 bg-white text-slate-950 p-6 sm:p-8 space-y-6 shadow-xl">
              {/* Header Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-slate-950">{SITE.legalName}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {SITE.location} &bull; {SITE.email}<br />
                    <strong>GSTIN:</strong> {SITE.gstin} &bull; <strong>PAN:</strong> {SITE.pan}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-cyan-600 block">TAX INVOICE</span>
                  <span className="font-mono text-base font-bold text-slate-950">{printInvoice.invoiceNumber}</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Issued: {printInvoice.issuedDate}<br />
                    Due: {printInvoice.dueDate || 'Upon Receipt'}
                  </p>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Billed To (Client)</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">
                    {clients.find((c) => c.id === printInvoice.clientId)?.company || 'Client Organization'}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Attn: {clients.find((c) => c.id === printInvoice.clientId)?.name}<br />
                    {clients.find((c) => c.id === printInvoice.clientId)?.email}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Payment Status</p>
                  <span className={`inline-block mt-1 font-bold text-xs px-2.5 py-1 rounded ${
                    printInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {printInvoice.status === 'paid' ? '✓ FULLY PAID & SETTLED' : 'PAYMENT PENDING'}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border-t border-b border-slate-200">
                <thead className="text-[10px] uppercase text-slate-500 bg-slate-50">
                  <tr>
                    <th className="p-2.5">Scope Description</th>
                    <th className="p-2.5 w-16 text-center">SAC</th>
                    <th className="p-2.5 w-12 text-center">Qty</th>
                    <th className="p-2.5 w-24 text-right">Rate</th>
                    <th className="p-2.5 w-24 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {(printInvoice.items?.length ? printInvoice.items : [{ description: printInvoice.title, qty: 1, rate: printInvoice.amount, sacCode: printInvoice.sacCode || '998311', amount: printInvoice.amount }]).map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{it.description}</td>
                      <td className="p-2.5 font-mono text-center text-slate-500">{it.sacCode || '998311'}</td>
                      <td className="p-2.5 text-center">{it.qty}</td>
                      <td className="p-2.5 text-right font-mono">{printInvoice.currency === 'INR' ? '₹' : '$'}{Number(it.rate).toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-bold">{printInvoice.currency === 'INR' ? '₹' : '$'}{Number(it.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1 text-slate-700">
                  <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Settlement & Wire Details</p>
                  <p>Bank: {SITE.bankDetails.bankName} ({SITE.bankDetails.branch})</p>
                  <p>Account: {SITE.bankDetails.accountNumber} &bull; IFSC: {SITE.bankDetails.ifsc}</p>
                  <p>UPI ID: <span className="font-mono font-semibold">{SITE.bankDetails.upiId}</span></p>
                </div>

                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold">{printInvoice.currency === 'INR' ? '₹' : '$'}{(printInvoice.subtotal || printInvoice.amount).toLocaleString()}</span>
                  </div>
                  {printInvoice.taxAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>GST ({printInvoice.taxRatePct}%):</span>
                      <span className="font-mono">+{printInvoice.currency === 'INR' ? '₹' : '$'}{printInvoice.taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-300 pt-2 flex justify-between font-heading font-extrabold text-base text-slate-950">
                    <span>Total Due:</span>
                    <span className="font-mono text-cyan-700">{printInvoice.currency === 'INR' ? '₹' : '$'}{Number(printInvoice.amount).toLocaleString()} {printInvoice.currency}</span>
                  </div>
                </div>
              </div>

              {/* Signatory */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span>Computer generated tax invoice. No signature required.</span>
                <span className="font-bold text-slate-800">For {SITE.legalName}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPrintInvoice(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold"
              >
                <Printer size={13} /> Print Invoice
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit / Create Invoice Modal */}
      {isEditing && formData && (
        <Modal
          title={formData.title ? 'Edit Invoice' : 'Issue Milestone Invoice'}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Invoice Number">
                <input
                  type="text"
                  required
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="TNV/2026/001"
                  className="w-full font-mono rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-cyan-300 outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Currency">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="GST Tax Rate %">
                <select
                  value={formData.taxRatePct}
                  onChange={(e) => {
                    const taxRatePct = Number(e.target.value);
                    const subtotal = formData.subtotal || formData.amount;
                    const taxAmount = Math.round(subtotal * (taxRatePct / 100));
                    setFormData({ ...formData, taxRatePct, taxAmount, amount: subtotal + taxAmount });
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value={0}>0% (Export LUT / Exempt)</option>
                  <option value={18}>18% GST (Domestic India)</option>
                </select>
              </Field>
            </div>

            <Field label="Milestone Title / Summary">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Milestone 2: Core Engineering & Staging Sign-off"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Client">
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

              <Field label="Project">
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

            {/* Line Items List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
                <span>Invoice Items</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  + Add Line Item
                </button>
              </div>

              {(formData.items || []).map((item) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                    className="w-16 text-center rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                    className="w-24 text-right rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={(formData.items || []).length <= 1}
                    className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Issued Date">
                <input
                  type="date"
                  value={formData.issuedDate}
                  onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Due Date">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2 text-xs font-semibold">
                Save Invoice ({formData.currency} {Number(formData.amount).toLocaleString()})
              </button>
            </div>
          </form>
        </Modal>
      )}
      {/* Invoice Notifier Modal */}
      {notifyInvoice && (
        <ClientNotifierModal
          initialClient={notifyInvoice}
          onClose={() => setNotifyInvoice(null)}
        />
      )}
    </div>
  );
}
