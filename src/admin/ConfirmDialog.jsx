import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

/**
 * Destructive actions get an explicit confirmation step — deletions
 * here cannot be undone, since there is no server-side history.
 */
export default function ConfirmDialog({ request, onClose }) {
  if (!request) return null;

  const { title, kind = 'item', confirmLabel = 'Delete', onConfirm } = request;

  return (
    <Modal
      open
      onClose={onClose}
      title={`Delete this ${kind}?`}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-2.5 font-heading text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <AlertTriangle size={20} aria-hidden="true" />
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          <span className="font-semibold text-white">{title}</span> will be removed
          permanently. There is no undo — export a backup first if you might want it
          back.
        </p>
      </div>
    </Modal>
  );
}
