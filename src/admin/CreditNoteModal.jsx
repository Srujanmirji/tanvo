import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CURRENCIES } from '../lib/constants';
import { issueCreditNote } from '../lib/store';

export default function CreditNoteModal({ invoice, client, onClose }) {
  const currencyObj = CURRENCIES.find((c) => c.id === invoice.currency) || CURRENCIES[0];

  const maxCredit = Number(invoice.balanceDue) > 0 ? Number(invoice.balanceDue) : Number(invoice.amount);
  const [amount, setAmount] = useState(maxCredit);
  const [reason, setReason] = useState('Scope adjustment / milestone revision discount');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    issueCreditNote({
      invoiceId: invoice.id,
      clientName: client?.company || client?.name || 'Client',
      amount: Number(amount),
      reason,
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
              <span className="font-mono text-xs font-bold text-amber-400">CN-{invoice.invoiceNumber}</span>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
                Issue Credit Note
              </span>
            </div>
            <h2 className="mt-1 font-heading text-lg font-bold text-white">
              Credit Note for {invoice.invoiceNumber}
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
            <h3 className="mt-3 font-heading text-lg font-bold text-white">Credit Note Issued!</h3>
            <p className="mt-1 text-xs text-emerald-300">
              CN-{invoice.invoiceNumber} recorded and linked to invoice.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>
                Credit notes create a legal accounting correction for sent invoices without modifying historical tax filings.
              </span>
            </div>

            {/* Credit Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Credit Adjustment Amount ({invoice.currency})
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
              <p className="mt-1 text-[11px] text-slate-500">
                Original invoice amount: {currencyObj.symbol}{Number(invoice.amount).toLocaleString()}
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Reason for Credit Note
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the scope reduction, pricing discount, or error correction..."
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 p-2.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                required
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
                className="rounded-xl border border-rose-500/30 bg-rose-500/20 px-5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 shadow-lg shadow-rose-500/10"
              >
                Issue Formal Credit Note
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
