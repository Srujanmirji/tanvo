import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, Trophy } from 'lucide-react';
import Modal from './Modal';
import Field from './Field';
import {
  deleteAchievement,
  emptyAchievement,
  saveAchievement,
  useContent,
} from '../lib/store';

function validate(item) {
  const errors = {};
  if (!item.title.trim()) errors.title = 'Give the achievement a name.';
  if (!item.metric.trim()) errors.metric = 'Add the headline number.';
  if (!item.metricLabel.trim()) errors.metricLabel = 'Say what the number measures.';
  return errors;
}

function AchievementDialog({ open, item, onClose }) {
  const [draft, setDraft] = useState(item);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDraft(item);
    setErrors({});
  }, [item]);

  if (!draft) return null;

  const set = (key) => (event) => {
    const { value } = event.target;
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(draft);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    saveAchievement({
      ...draft,
      title: draft.title.trim(),
      metric: draft.metric.trim(),
      metricLabel: draft.metricLabel.trim(),
      detail: draft.detail.trim(),
      isSample: false,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item?.title ? 'Edit achievement' : 'Add achievement'}
      description="These appear in the Track Record section on the public site."
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">
            Cancel
          </button>
          <button type="submit" form="achievement-form" className="btn-primary px-6 py-2.5 text-sm">
            Save
          </button>
        </>
      }
    >
      <form id="achievement-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field
          label="Achievement"
          value={draft.title}
          onChange={set('title')}
          error={errors.title}
          placeholder="e.g. Zero-downtime migration"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Headline number"
            value={draft.metric}
            onChange={set('metric')}
            error={errors.metric}
            placeholder="e.g. 73% or 24"
            hint="Kept short — it renders large."
          />
          <Field
            label="What it measures"
            value={draft.metricLabel}
            onChange={set('metricLabel')}
            error={errors.metricLabel}
            placeholder="e.g. tickets auto-resolved"
          />
        </div>

        <Field
          label="Detail"
          as="textarea"
          rows={3}
          value={draft.detail}
          onChange={set('detail')}
          className="resize-y"
          placeholder="One or two sentences of context."
        />

        <Field label="Date achieved" type="date" value={draft.date} onChange={set('date')} />
      </form>
    </Modal>
  );
}

export default function AchievementsPanel({ onRequestDelete }) {
  const { achievements } = useContent();
  const [editing, setEditing] = useState(null);

  const sorted = [...achievements].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">Past achievements</h2>
          <p className="mt-1 text-sm text-slate-500">
            Measurable outcomes, newest first. All of these are public.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyAchievement())}
          className="btn-primary px-5 py-2.5 text-sm"
        >
          <Plus size={16} aria-hidden="true" /> Add achievement
        </button>
      </div>

      {sorted.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sorted.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-xl border border-white/5 bg-slate-950/50 p-5 transition-colors hover:border-white/15"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Trophy size={18} aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  {item.isSample && (
                    <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300">
                      Sample
                    </span>
                  )}
                </div>

                <p className="mb-2 text-xs text-slate-500">
                  <span className="font-heading text-base font-bold text-cyan-400">
                    {item.metric}
                  </span>{' '}
                  {item.metricLabel}
                </p>

                <p className="mb-3 text-xs leading-relaxed text-slate-400">{item.detail}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-[11px] text-slate-600">{item.date || '—'}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-cyan-400"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onRequestDelete({
                          title: item.title,
                          kind: 'achievement',
                          onConfirm: () => deleteAchievement(item.id),
                        })
                      }
                      className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-600">
          No achievements yet. The public Track Record section stays hidden until you add
          one.
        </p>
      )}

      <AchievementDialog
        open={Boolean(editing)}
        item={editing}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
