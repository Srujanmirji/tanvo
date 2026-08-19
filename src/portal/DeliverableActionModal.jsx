import { useState } from 'react';
import { CheckCircle2, ExternalLink, MessageSquareQuote, RotateCcw, X } from 'lucide-react';
import { ACCENT_CLASSES, DELIVERABLE_STATUSES } from '../lib/constants';

export default function DeliverableActionModal({ deliverable, onClose, onUpdateStatus }) {
  const [feedback, setFeedback] = useState(deliverable.feedback || '');
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'revise'

  const currentStatusObj = DELIVERABLE_STATUSES.find((s) => s.id === deliverable.status) || DELIVERABLE_STATUSES[0];
  const accent = ACCENT_CLASSES[currentStatusObj.accent] || ACCENT_CLASSES.amber;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actionType === 'approve') {
      onUpdateStatus(deliverable.id, 'approved', feedback || 'Approved by client.');
    } else {
      onUpdateStatus(deliverable.id, 'changes_requested', feedback || 'Client requested revisions.');
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${accent.bg} ${accent.text} border ${accent.border}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
              {currentStatusObj.label}
            </span>
            <h2 className="mt-2 font-heading text-lg font-bold text-white sm:text-xl">
              {deliverable.title}
            </h2>
            <p className="text-xs text-slate-400">
              Version: {deliverable.version} &bull; Type: {deliverable.type}
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

        {deliverable.description && (
          <p className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-300">
            {deliverable.description}
          </p>
        )}

        {deliverable.url && (
          <div className="mt-4">
            <a
              href={deliverable.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
            >
              <ExternalLink size={14} /> Open Live Deliverable Link &rarr;
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActionType('approve')}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                actionType === 'approve'
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <CheckCircle2 size={16} /> Approve Asset
            </button>
            <button
              type="button"
              onClick={() => setActionType('revise')}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                actionType === 'revise'
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <RotateCcw size={16} /> Request Changes
            </button>
          </div>

          <div>
            <label htmlFor="feedbackText" className="block text-xs font-medium uppercase tracking-wider text-slate-400">
              {actionType === 'approve' ? 'Optional Note / Comments' : 'Detailed Revision Feedback (Required)'}
            </label>
            <div className="relative mt-2">
              <textarea
                id="feedbackText"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'e.g. Looks great! We approve this design for the engineering sprint.'
                    : 'e.g. Please update the primary CTA button color and adjust the header padding.'
                }
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <MessageSquareQuote size={15} className="pointer-events-none absolute right-3 top-3 text-slate-600" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-slate-950 transition ${
                actionType === 'approve'
                  ? 'bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20'
                  : 'bg-rose-400 hover:bg-rose-300 shadow-lg shadow-rose-500/20'
              }`}
            >
              {actionType === 'approve' ? 'Confirm Approval' : 'Submit Revision Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
