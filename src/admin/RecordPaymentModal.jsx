import { useState } from 'react';
import {
  CheckCircle2,
  X,
} from 'lucide-react';
import { CURRENCIES, PAYMENT_MODES } from '../lib/constants';
import { recordInvoicePayment } from '../lib/store';

export default function RecordPaymentModal({ invoice, client, onClose }) {
  const currencyObj = CURRENCIES.find((c) => c.id === invoice.currency) || CURRENCIES[0];

  const currentBalance = Number(invoice.balanceDue) > 0 ? Number(invoice.balanceDue) : Number(invoice.amount);
  const [amount, setAmount] = useState(currentBalance);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [referenceId, setReferenceId] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    recordInvoicePayment(invoice.id, {
      amount: Number(amount),
      currency: invoice.currency,
      paymentMode,
      referenceId,
      paymentDate,
      notes,
    });

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400">{invoice.invoiceNumber}</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                Record Payment
              </span>
            </div>
            <h2 className="mt-1 font-heading text-lg font-bold text-white">
              {invoice.title}
            </h2>
            <p className="text-xs text-slate-400">
              Client: {client?.company || client?.name || 'Client'}
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

        {success ? (
          <div className="my-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="mt-3 font-heading text-lg font-bold text-white">Payment Recorded Successfully!</h3>
            <p className="mt-1 text-xs text-emerald-300">
              Settlement updated in ledger. Outstanding balance recalculated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Balance Overview */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
              <div>
                <p className="text-slate-500 uppercase font-mono text-[10px]">Total Invoice Amount</p>
                <p className="font-heading text-base font-bold text-white font-mono">
                  {currencyObj.symbol}{Number(invoice.amount).toLocaleString()} {invoice.currency}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase font-mono text-[10px]">Current Outstanding Due</p>
                <p className="font-heading text-base font-bold text-amber-400 font-mono">
                  {currencyObj.symbol}{currentBalance.toLocaleString()} {invoice.currency}
                </p>
              </div>
            </div>

            {/* Payment Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Amount ({invoice.currency})
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-500">
                  {currencyObj.symbol}
                </span>
                <input
                  type="number"
                  min="1"
                  max={invoice.amount}
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 pl-8 pr-3 py-2 text-sm text-white font-mono focus:border-cyan-500/50 focus:outline-none"
                  required
                />
              </div>
              {Number(amount) < currentBalance && (
                <p className="mt-1 text-[11px] text-cyan-400">
                  ℹ️ Partial settlement of {currencyObj.symbol}{Number(amount).toLocaleString()}. Remaining balance: {currencyObj.symbol}{(currentBalance - Number(amount)).toLocaleString()}
                </p>
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Channel / Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
              >
                {PAYMENT_MODES.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Reference ID / UTR */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Transaction Ref / UTR #
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR-HDFC-99281203"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white font-mono focus:border-cyan-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Settlement Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Receipt Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Settlement Notes / Memo
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Received full wire transfer via HDFC corporate account..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 p-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-5 py-2 text-xs font-semibold shadow-lg shadow-cyan-500/20"
              >
                Confirm & Record Settlement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
