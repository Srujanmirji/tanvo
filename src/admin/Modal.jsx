import { useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalBehavior } from '../hooks/useModalBehavior';

/**
 * Accessible dialog: focus trap, Escape to close, scroll lock, focus
 * restore — all supplied by useModalBehavior. Rendered through a portal
 * so it escapes any transformed/overflow-hidden ancestor.
 */
export default function Modal({ open, onClose, title, description, children, footer }) {
  const panelRef = useModalBehavior(open, onClose);
  const titleId = useId();
  const descId = useId();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto p-4 py-10 sm:p-6 sm:py-16">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className="glassmorphism relative w-full max-w-2xl rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/5 p-6">
          <div>
            <h2 id={titleId} className="font-heading text-xl font-bold text-white">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1.5 text-sm text-slate-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">{children}</div>

        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-white/5 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
