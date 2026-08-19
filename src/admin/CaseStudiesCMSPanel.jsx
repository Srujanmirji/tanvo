import { useState } from 'react';
import {
  MessageSquareQuote,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import {
  deleteCaseStudy,
  emptyCaseStudy,
  saveCaseStudy,
  useContent,
} from '../lib/store';
import Modal from './Modal';
import Field from './Field';

export default function CaseStudiesCMSPanel({ onConfirmDelete }) {
  const { caseStudies = [] } = useContent();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [stackInput, setStackInput] = useState('');

  const handleCreateNew = () => {
    const fresh = emptyCaseStudy();
    setFormData(fresh);
    setStackInput(fresh.stack.join(', '));
    setIsEditing(true);
  };

  const handleEdit = (cs) => {
    setFormData({ ...cs });
    setStackInput(cs.stack.join(', '));
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const stack = stackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    saveCaseStudy({
      ...formData,
      stack,
    });

    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Portfolio & Case Studies CMS</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {caseStudies.length} Case Studies Published
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Publish client case studies with Problem, Solution, Outcome architectures, quantified metrics, and verified testimonials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold"
        >
          <Plus size={14} /> New Case Study
        </button>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {caseStudies.map((cs) => (
          <div
            key={cs.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl transition hover:border-cyan-500/30"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                    {cs.industry}
                  </span>
                  {cs.featured && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      <Star size={10} className="fill-amber-400" /> Featured
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-slate-500">
                    {cs.clientName}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(cs)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                    title="Edit Case Study"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onConfirmDelete({
                        title: `Delete Case Study "${cs.title}"?`,
                        message: 'This will remove the case study from the public site.',
                        onConfirm: () => deleteCaseStudy(cs.id),
                      })
                    }
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                    title="Delete Case Study"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="mt-3 font-heading text-base font-bold text-white">{cs.title}</h3>

              {/* Outcome summary */}
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-300">Outcome:</strong> {cs.outcome}
              </p>

              {/* Metrics Grid */}
              {cs.metrics && cs.metrics.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cs.metrics.map((m, idx) => (
                    <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-center">
                      <p className="text-[10px] uppercase text-slate-500">{m.label}</p>
                      <p className="font-heading text-sm font-bold text-cyan-400">{m.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Testimonial Quote */}
              {cs.testimonial && cs.testimonial.quote && (
                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                    <MessageSquareQuote size={13} className="text-cyan-400" />
                    {cs.testimonial.author} ({cs.testimonial.role}, {cs.testimonial.company})
                  </div>
                  <p className="text-slate-300 italic line-clamp-2">
                    &quot;{cs.testimonial.quote}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Stack Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
              {cs.stack.map((tech, idx) => (
                <span key={idx} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && formData && (
        <Modal
          title={formData.title ? `Edit Case Study: ${formData.title}` : 'Create New Case Study'}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Case Study Title (Required)">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Autonomous Logistics Dispatch Engine"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Client Name / Override">
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Nexus Global Logistics"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Industry Sector">
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. Supply Chain & Logistics"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <Field label="Problem & Architectural Bottlenecks">
              <textarea
                rows={2}
                required
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="What was broken or inefficient before engagement..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <Field label="Engineering Solution & Implementation">
              <textarea
                rows={2}
                required
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="What architecture, microservices, or frontend we built..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <Field label="Quantified Outcome & Business Impact">
              <textarea
                rows={2}
                required
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                placeholder="Measured latency drops, cost reductions, uptime..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Key Metric 1 (Label & Value)">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Dispatch Latency"
                    value={formData.metrics[0]?.label || ''}
                    onChange={(e) => {
                      const m = [...(formData.metrics || [])];
                      m[0] = { label: e.target.value, value: m[0]?.value || '' };
                      setFormData({ ...formData, metrics: m });
                    }}
                    className="w-1/2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="4 mins"
                    value={formData.metrics[0]?.value || ''}
                    onChange={(e) => {
                      const m = [...(formData.metrics || [])];
                      m[0] = { label: m[0]?.label || '', value: e.target.value };
                      setFormData({ ...formData, metrics: m });
                    }}
                    className="w-1/2 font-bold text-cyan-300 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </Field>

              <Field label="Key Metric 2 (Label & Value)">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Error Rate"
                    value={formData.metrics[1]?.label || ''}
                    onChange={(e) => {
                      const m = [...(formData.metrics || [])];
                      m[1] = { label: e.target.value, value: m[1]?.value || '' };
                      setFormData({ ...formData, metrics: m });
                    }}
                    className="w-1/2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="0.02%"
                    value={formData.metrics[1]?.value || ''}
                    onChange={(e) => {
                      const m = [...(formData.metrics || [])];
                      m[1] = { label: m[1]?.label || '', value: e.target.value };
                      setFormData({ ...formData, metrics: m });
                    }}
                    className="w-1/2 font-bold text-cyan-300 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </Field>
            </div>

            <Field label="Client Testimonial Quote">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Author Name, Role & Company (e.g. Marcus Vance, VP Ops)"
                  value={formData.testimonial?.author ? `${formData.testimonial.author} (${formData.testimonial.role || ''}, ${formData.testimonial.company || ''})` : ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      testimonial: {
                        ...(formData.testimonial || {}),
                        author: e.target.value,
                      },
                    });
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
                <textarea
                  rows={2}
                  placeholder="Direct client quote..."
                  value={formData.testimonial?.quote || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      testimonial: {
                        ...(formData.testimonial || {}),
                        quote: e.target.value,
                      },
                    });
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-cyan-400 italic"
                />
              </div>
            </Field>

            <Field label="Technologies Used (comma separated)">
              <input
                type="text"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                placeholder="Next.js 16, React, TypeScript, Node.js, PostgreSQL"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="csFeatured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400"
              />
              <label htmlFor="csFeatured" className="text-xs text-slate-300">
                Feature prominently in top carousel & home page
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2 text-xs font-semibold">
                Save Case Study
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
