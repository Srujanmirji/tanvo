import { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Landmark,
  QrCode,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { ACCENT_CLASSES, BANK_DETAILS, CURRENCIES, INVOICE_STATUSES, SITE } from '../lib/constants';

export default function InvoicePaymentModal({ invoice, client, project, onClose, onPaySuccess }) {
  const [method, setMethod] = useState(invoice.currency === 'INR' ? 'upi' : 'card');
  const [paying, setPaying] = useState(false);
  const [paidComplete, setPaidComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const statusObj = INVOICE_STATUSES.find((s) => s.id === invoice.status) || INVOICE_STATUSES[0];
  const accent = ACCENT_CLASSES[statusObj.accent] || ACCENT_CLASSES.amber;
  const currencyObj = CURRENCIES.find((c) => c.id === invoice.currency) || CURRENCIES[1];

  const upiIntent = `upi://pay?pa=${BANK_DETAILS.upiId}&pn=Tanvo%20Tech&am=${invoice.amount}&cu=INR&tn=${encodeURIComponent(invoice.invoiceNumber)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiIntent)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(BANK_DETAILS.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaidComplete(true);
      onPaySuccess(invoice.id);
    }, 1200);
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
              <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${accent.bg} ${accent.text} border ${accent.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                {paidComplete ? 'Settled Just Now' : statusObj.label}
              </span>
            </div>
            <h2 className="mt-2 font-heading text-lg font-bold text-white sm:text-xl">
              {invoice.title}
            </h2>
            <p className="text-xs text-slate-400">
              Project: {project?.title || 'Agency Scope'} &bull; Client: {client?.company || client?.name}
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

        {/* Invoice Summary Box */}
        <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400">Total Amount Due</span>
            <span className="font-heading text-2xl font-bold text-emerald-400 font-mono">
              {currencyObj.symbol}{Number(invoice.amount).toLocaleString()} {invoice.currency}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-500">Issued Date</p>
              <p className="font-medium text-slate-300">{invoice.issuedDate || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500">Due Date</p>
              <p className="font-medium text-slate-300">{invoice.dueDate || 'Upon receipt'}</p>
            </div>
          </div>
        </div>

        {paidComplete ? (
          <div className="my-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="mt-3 font-heading text-lg font-bold text-white">Payment Confirmed & Settled!</h3>
            <p className="mt-1 text-xs text-emerald-200">
              Receipt #{invoice.invoiceNumber}-REC has been automatically credited and recorded in your workspace.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary mt-5 px-6 py-2 text-xs font-semibold"
            >
              Back to Invoices
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {invoice.status === 'paid' ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-xs text-emerald-300">
                This invoice was paid in full on {invoice.paidDate || 'record'}.
              </div>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Select Payment Method
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {invoice.currency === 'INR' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMethod('upi')}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          method === 'upi'
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <QrCode size={18} className="text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">UPI Instant QR</p>
                          <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod('card')}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          method === 'card'
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <CreditCard size={18} className="text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">Razorpay Checkout</p>
                          <p className="text-[10px] text-slate-500">Cards & Netbanking</p>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setMethod('card')}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          method === 'card'
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <CreditCard size={18} className="text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">Stripe Checkout</p>
                          <p className="text-[10px] text-slate-500">Instant online receipt</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod('wire')}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          method === 'wire'
                            ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <Landmark size={18} className="text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">ACH / Wire Transfer</p>
                          <p className="text-[10px] text-slate-500">Bank transfer details</p>
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {/* UPI QR Display */}
                {method === 'upi' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
                    <div className="rounded-xl border border-white/20 bg-white p-2 shadow-lg">
                      <img src={qrUrl} alt="UPI Payment QR" className="h-36 w-36" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-white">Scan with any UPI App</p>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-slate-400">
                      <span>UPI ID: <strong className="text-cyan-300">{BANK_DETAILS.upiId}</strong></span>
                      <button
                        type="button"
                        onClick={handleCopyUPI}
                        className="rounded p-1 text-slate-400 hover:text-white"
                        title="Copy UPI ID"
                      >
                        <Copy size={12} />
                      </button>
                      {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
                    </div>
                  </div>
                )}

                {/* Wire Bank Details Display */}
                {method === 'wire' && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Beneficiary:</span>
                      <span className="font-semibold text-white">{BANK_DETAILS.accountName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Bank:</span>
                      <span className="text-white">{BANK_DETAILS.bankName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Account Number:</span>
                      <span className="font-mono text-cyan-300">{BANK_DETAILS.accountNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>IFSC Code:</span>
                      <span className="font-mono text-white">{BANK_DETAILS.ifsc}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>SWIFT / BIC:</span>
                      <span className="font-mono text-white">{BANK_DETAILS.swift}</span>
                    </div>
                  </div>
                )}

                {/* Card input display */}
                {method === 'card' && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 4242"
                        className="w-full font-mono rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Expiry</label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full font-mono rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">CVC</label>
                        <input
                          type="text"
                          defaultValue="•••"
                          className="w-full font-mono rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-slate-300 font-medium mb-1">
                    <ShieldCheck size={14} className="text-emerald-400" /> 256-Bit Encrypted Agency Billing Gateway
                  </div>
                  Settlement will be processed under {SITE.legalName} (GSTIN: {SITE.gstin}).
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={paying}
                    className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold shadow-lg shadow-cyan-500/20"
                  >
                    {paying ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                        Processing Settlement...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Settle {currencyObj.symbol}{Number(invoice.amount).toLocaleString()} Now
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
