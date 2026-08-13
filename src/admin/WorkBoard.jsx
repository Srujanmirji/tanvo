import { useMemo, useState } from 'react';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import ProjectDialog from './ProjectDialog';
import { ACCENT_CLASSES, STATUSES, STATUS_IDS } from '../lib/constants';
import { deleteProject, emptyProject, setProjectStatus, useContent } from '../lib/store';

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Days until a target date — negative once it has slipped. */
function daysUntil(iso) {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86_400_000);
}

function DeadlineBadge({ targetDate, status }) {
  const days = daysUntil(targetDate);
  if (days === null || status === 'completed') return null;

  if (days < 0) {
    return (
      <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
        {Math.abs(days)}d overdue
      </span>
    );
  }
  if (days <= 14) {
    return (
      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
        {days}d left
      </span>
    );
  }
  return null;
}

function ProjectCard({ project, onEdit, onDelete }) {
  const index = STATUS_IDS.indexOf(project.status);
  const accent = ACCENT_CLASSES[STATUSES[index]?.accent ?? 'cyan'];

  return (
    <li className="group rounded-xl border border-white/5 bg-slate-950/50 p-4 transition-colors hover:border-white/15">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug text-white">{project.title}</h4>
        {project.isSample && (
          <span
            title="Placeholder content — replace before launch"
            className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300"
          >
            Sample
          </span>
        )}
      </div>

      {project.client && (
        <p className="mb-2 text-xs text-slate-500">{project.client}</p>
      )}

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-400">
        {project.desc}
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-white/5 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
          {project.category}
        </span>
        <DeadlineBadge targetDate={project.targetDate} status={project.status} />
        {project.status === 'upcoming' && (
          <span
            title="Not shown on the public site"
            className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-600"
          >
            <EyeOff size={10} aria-hidden="true" /> Private
          </span>
        )}
      </div>

      {project.status !== 'upcoming' && (
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-[10px] text-slate-500">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={project.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${project.title} progress`}
            className="h-1.5 overflow-hidden rounded-full bg-white/5"
          >
            <div
              className={`h-full rounded-full ${accent.bar} transition-[width] duration-500`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {project.targetDate && (
        <p className="mb-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <CalendarClock size={11} aria-hidden="true" />
          Target {formatDate(project.targetDate)}
        </p>
      )}

      <div className="flex items-center justify-between gap-1 border-t border-white/5 pt-3">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-cyan-400"
            aria-label={`Edit ${project.title}`}
          >
            <Pencil size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(project)}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label={`Delete ${project.title}`}
          >
            <Trash2 size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Keyboard-accessible alternative to drag and drop. */}
        <div className="flex gap-1">
          <button
            type="button"
            disabled={index <= 0}
            onClick={() => setProjectStatus(project.id, STATUS_IDS[index - 1])}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
            aria-label={`Move ${project.title} to ${STATUSES[index - 1]?.label ?? ''}`}
          >
            <ChevronLeft size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={index >= STATUS_IDS.length - 1}
            onClick={() => setProjectStatus(project.id, STATUS_IDS[index + 1])}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
            aria-label={`Move ${project.title} to ${STATUSES[index + 1]?.label ?? ''}`}
          >
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

export default function WorkBoard({ onRequestDelete }) {
  const { projects } = useContent();
  const [editing, setEditing] = useState(null);

  const columns = useMemo(
    () =>
      STATUSES.map((status) => ({
        ...status,
        items: projects
          .filter((p) => p.status === status.id)
          .sort((a, b) => (a.targetDate || '9999').localeCompare(b.targetDate || '9999')),
      })),
    [projects],
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">Work pipeline</h2>
          <p className="mt-1 text-sm text-slate-500">
            Move a project between columns with the arrow buttons.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyProject())}
          className="btn-primary px-5 py-2.5 text-sm"
        >
          <Plus size={16} aria-hidden="true" /> Add project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {columns.map((column) => {
          const accent = ACCENT_CLASSES[column.accent];
          return (
            <section
              key={column.id}
              aria-label={`${column.label} — ${column.items.length} projects`}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
            >
              <header className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${accent.dot}`} aria-hidden="true" />
                  <h3 className={`font-heading text-sm font-bold uppercase tracking-wide ${accent.text}`}>
                    {column.label}
                  </h3>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-semibold text-slate-400">
                  {column.items.length}
                </span>
              </header>

              {column.items.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {column.items.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={setEditing}
                      onDelete={(p) =>
                        onRequestDelete({
                          title: p.title,
                          kind: 'project',
                          onConfirm: () => deleteProject(p.id),
                        })
                      }
                    />
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-dashed border-white/5 py-8 text-center text-xs text-slate-600">
                  Nothing here yet
                </p>
              )}
            </section>
          );
        })}
      </div>

      <ProjectDialog
        open={Boolean(editing)}
        project={editing}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
