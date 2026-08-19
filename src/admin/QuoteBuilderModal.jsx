import { useState } from 'react';
import { Plus, Send, Trash2, X } from 'lucide-react';
import { CURRENCIES, SITE } from '../lib/constants';
import { saveQuote, uid, useContent } from '../lib/store';

export default function QuoteBuilderModal({ lead, onClose, onCreated }) {
  const { services = [] } = useContent();

  const [currency, setCurrency] = useState('USD');
  const [discountPct, setDiscountPct] = useState(0);
  const [taxRatePct, setTaxRatePct] = useState(0); // 0% for export LUT, 18% for GST
  const [notes, setNotes] = useState('Fixed-deliverable scope. Includes 100% intellectual property ownership & 30-day warranty.');
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  );

  const [items, setItems] = useState([
    {
      id: uid('qi'),
      description: 'Production Architecture & Next.js 16 Web Application Frontend',
      qty: 1,
      rate: currency === 'INR' ? 500000 : 6000,
      sacCode: '998311',
      amount: currency === 'INR' ? 500000 : 6000,
    },
  ]);

  const currencyObj = CURRENCIES.find((c) => c.id === currency) || CURRENCIES[1];

  const handleAddItem = (service = null) => {
    const rate = service
      ? currency === 'INR'
        ? service.basePrice
        : service.basePriceUSD || 5000
      : currency === 'INR'
        ? 300000
        : 4000;

    setItems((prev) => [
      ...prev,
      {
        id: uid('qi'),
        description: service ? `${service.name} (${service.deliverables.slice(0, 2).join(', ')})` : 'Engineering Deliverable Scope',
        qty: 1,
        rate,
        sacCode: service?.sacCode || '998311',
        amount: rate,
      },
    ]);
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        if (field === 'qty' || field === 'rate') {
          updated.amount = (Number(updated.qty) || 0) * (Number(updated.rate) || 0);
        }
        return updated;
      }),
    );
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subtotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const discountAmount = Math.round(subtotal * ((Number(discountPct) || 0) / 100));
  const taxable = subtotal - discountAmount;
  const taxAmount = Math.round(taxable * ((Number(taxRatePct) || 0) / 100));
  const total = taxable + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuote = {
      id: uid('q'),
      quoteNumber: `TNV-Q-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      leadId: lead?.id || '',
      clientName: lead?.company || lead?.name || 'Prospect Client',
      contactEmail: lead?.email || '',
      currency,
      subtotal,
      discountPct: Number(discountPct) || 0,
      discountAmount,
      taxRatePct: Number(taxRatePct) || 0,
      taxAmount,
      total,
      validUntil,
      status: 'SENT',
      notes,
      items,
      isSample: false,
    };

    saveQuote(newQuote);
    if (onCreated) onCreated(newQuote);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-white/10 bg-slate-950 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-300">
                PROPOSAL BUILDER
              </span>
              <span className="text-xs text-slate-400">
                For: <strong className="text-white">{lead?.company || lead?.name || 'Prospect Client'}</strong>
              </span>
            </div>
            <h2 className="mt-2 font-heading text-xl font-bold text-white">
              Generate Formal Scope Proposal & Quote
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form id="quote-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preset Services Quick-Add */}
          {services.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Quick-Add from Services Catalog:
              </p>
              <div className="flex flex-wrap gap-2">
                {services.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleAddItem(srv)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    <Plus size={12} className="text-cyan-400" />
                    {srv.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3">Deliverable / Scope Description</th>
                  <th className="p-3 w-20">Qty</th>
                  <th className="p-3 w-28">Rate ({currencyObj.symbol})</th>
                  <th className="p-3 w-28">Amount</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2.5">
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-center text-white outline-none focus:border-cyan-400"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min="0"
                        required
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                      />
                    </td>
                    <td className="p-2.5 font-mono font-medium text-slate-100">
                      {currencyObj.symbol}{Number(item.amount).toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-2.5 bg-white/[0.01] border-t border-white/5">
              <button
                type="button"
                onClick={() => handleAddItem()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
              >
                <Plus size={13} /> Add Custom Line Item
              </button>
            </div>
          </div>

          {/* Pricing & Tax Calculations */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-slate-400 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block uppercase tracking-wider text-slate-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-slate-400 mb-1">Tax Rate (GST %)</label>
                  <select
                    value={taxRatePct}
                    onChange={(e) => setTaxRatePct(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value={0}>0% (Export LUT / Exempt)</option>
                    <option value={18}>18% GST (Domestic India)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-slate-400 mb-1">Validity Date</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Calculations Box */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({items.length} items):</span>
                <span>{currencyObj.symbol}{subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPct}%):</span>
                  <span>−{currencyObj.symbol}{discountAmount.toLocaleString()}</span>
                </div>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>GST ({taxRatePct}%):</span>
                  <span>+{currencyObj.symbol}{taxAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-white/10 pt-2 flex justify-between font-heading text-base font-bold text-white">
                <span>Grand Total Quote:</span>
                <span className="text-cyan-300 font-mono">{currencyObj.symbol}{total.toLocaleString()} {currency}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Proposal Terms & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 p-4 sm:px-6">
          <span className="text-xs text-slate-500">
            Authorized by {SITE.name}
          </span>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="quote-form"
              className="btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold shadow-lg shadow-cyan-500/20"
            >
              <Send size={13} /> Save & Issue Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
