import { useState } from 'react';
import {
  Code2,
  ExternalLink,
  Mail,
  Trash2,
} from 'lucide-react';
import {
  deleteApplication,
  deleteTestimonial,
  setApplicationStatus,
  useContent,
} from '../lib/store';

export default function InboxPanel({ onConfirmDelete }) {
  const { applications = [], testimonials = [] } = useContent();

  const [activeTab, setActiveTab] = useState('applications');

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Inbound Applications & Reviews</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {applications.length} Candidates &bull; {testimonials.length} Testimonials
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Review candidate engineering dossiers, GitHub repositories, and curate client testimonial approvals.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl border border-white/10 bg-slate-900/60 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'applications'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Engineering Dossiers ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testimonials')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'testimonials'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Testimonial Approvals ({testimonials.length})
          </button>
        </div>
      </div>

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl transition hover:border-cyan-500/30"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">
                      {app.candidateName}
                    </h3>
                    <p className="font-mono text-xs text-cyan-400">
                      {app.role} &bull; {app.experience}
                    </p>
                  </div>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      app.status === 'SHORTLISTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-300 border border-white/10'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-500" />
                    <span>{app.email}</span>
                  </div>
                  {app.githubUrl && (
                    <div className="flex items-center gap-2">
                      <Code2 size={13} className="text-cyan-400" />
                      <a
                        href={app.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:underline inline-flex items-center gap-1"
                      >
                        GitHub Profile <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-300">
                  <strong className="text-slate-400 font-semibold">Background:</strong> {app.notes}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[11px] text-slate-500">
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </span>

                <div className="flex gap-2">
                  {app.status !== 'SHORTLISTED' && (
                    <button
                      type="button"
                      onClick={() => setApplicationStatus(app.id, 'SHORTLISTED')}
                      className="rounded-lg bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25"
                    >
                      Shortlist Candidate
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      onConfirmDelete({
                        title: `Delete Application from ${app.candidateName}?`,
                        message: 'This will remove the candidate dossier.',
                        onConfirm: () => deleteApplication(app.id),
                      })
                    }
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">{test.author}</h3>
                    <p className="text-xs text-cyan-400">{test.company}</p>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    {test.status}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-300 italic border-l-2 border-cyan-400/40 pl-3">
                  &quot;{test.quote}&quot;
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-white/5 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    onConfirmDelete({
                      title: `Delete Testimonial from ${test.author}?`,
                      message: 'This will remove the testimonial.',
                      onConfirm: () => deleteTestimonial(test.id),
                    })
                  }
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
