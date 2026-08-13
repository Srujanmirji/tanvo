import { useEffect, useState } from 'react';
import Modal from './Modal';
import Field from './Field';
import { CATEGORIES, STATUSES } from '../lib/constants';
import { saveProject } from '../lib/store';

function validate(project) {
  const errors = {};
  if (!project.title.trim()) errors.title = 'A title is required.';
  if (!project.desc.trim()) errors.desc = 'Describe the work in a sentence or two.';
  if (
    project.startDate &&
    project.targetDate &&
    project.startDate > project.targetDate
  ) {
    errors.targetDate = 'The target date is before the start date.';
  }
  if (project.link && !/^https?:\/\//i.test(project.link)) {
    errors.link = 'Include the full URL, starting with https://';
  }
  return errors;
}

export default function ProjectDialog({ open, project, onClose }) {
  const [draft, setDraft] = useState(project);
  const [errors, setErrors] = useState({});

  // Re-seed the form whenever a different project is opened.
  useEffect(() => {
    setDraft(project);
    setErrors({});
  }, [project]);

  if (!draft) return null;

  const set = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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
    saveProject({
      ...draft,
      title: draft.title.trim(),
      desc: draft.desc.trim(),
      progress: draft.status === 'completed' ? 100 : Number(draft.progress) || 0,
      // Editing a record means it is no longer placeholder content.
      isSample: false,
    });
    onClose();
  };

  const isNew = !project?.title;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Add project' : 'Edit project'}
      description="Completed and in-progress work appears on the public site. Upcoming work stays private to this board."
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            className="btn-primary px-6 py-2.5 text-sm"
          >
            {isNew ? 'Add project' : 'Save changes'}
          </button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field
          label="Project title"
          value={draft.title}
          onChange={set('title')}
          error={errors.title}
          placeholder="e.g. Northwind Inventory Platform"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Client"
            value={draft.client}
            onChange={set('client')}
            placeholder="e.g. Northwind Ltd"
            hint="Only shown publicly if you add it to the description."
          />
          <Field label="Category" as="select" value={draft.category} onChange={set('category')}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Field>
        </div>

        <Field
          label="Description"
          as="textarea"
          rows={3}
          value={draft.desc}
          onChange={set('desc')}
          error={errors.desc}
          className="resize-y"
          placeholder="What you built and what it does for them."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Status" as="select" value={draft.status} onChange={set('status')}>
            {STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label} — {status.hint}
              </option>
            ))}
          </Field>

          <div className="flex flex-col">
            <label
              htmlFor="project-progress"
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
            >
              Progress — {draft.status === 'completed' ? 100 : draft.progress}%
            </label>
            <input
              id="project-progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={draft.status === 'completed' ? 100 : draft.progress}
              onChange={set('progress')}
              disabled={draft.status === 'completed'}
              className="mt-3 w-full accent-cyan-400 disabled:opacity-50"
            />
            {draft.status === 'completed' && (
              <p className="mt-1.5 text-[11px] text-slate-600">
                Completed projects are always 100%.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Start date" type="date" value={draft.startDate} onChange={set('startDate')} />
          <Field
            label="Target date"
            type="date"
            value={draft.targetDate}
            onChange={set('targetDate')}
            error={errors.targetDate}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Cover image path"
            value={draft.image}
            onChange={set('image')}
            placeholder="/images/dashboard.png"
            hint="Put files in /public/images, then reference them like this."
          />
          <Field
            label="Case study URL"
            type="url"
            value={draft.link}
            onChange={set('link')}
            error={errors.link}
            placeholder="https://…"
            hint="Leave blank to show 'coming soon'."
          />
        </div>

        <Field
          label="Tech stack"
          value={draft.tech.join(', ')}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              tech: e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
            }))
          }
          placeholder="React, Node.js, PostgreSQL"
          hint="Comma separated."
        />

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={set('featured')}
            className="mt-0.5 h-4 w-4 accent-cyan-400"
          />
          <span>
            <span className="block text-sm font-medium text-white">Feature this project</span>
            <span className="block text-xs text-slate-500">
              Flags it as a highlight for future layout work.
            </span>
          </span>
        </label>
      </form>
    </Modal>
  );
}
