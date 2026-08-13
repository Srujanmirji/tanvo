import { useId } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * A labelled form control with error wiring done correctly:
 * label/control association, aria-invalid, and aria-describedby all
 * derived from one generated id.
 */
export default function Field({
  label,
  error,
  hint,
  as = 'input',
  children,
  className = '',
  ...props
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(' ');

  const shared = {
    id,
    className: `field-input ${className}`,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
    ...props,
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>

      {as === 'textarea' && <textarea {...shared} />}
      {as === 'select' && <select {...shared}>{children}</select>}
      {as === 'input' && <input {...shared} />}

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[11px] text-slate-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={12} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
