import { useState } from 'react';
import {
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  deleteService,
  emptyService,
  saveService,
  toggleServicePublish,
  useContent,
} from '../lib/store';
import Modal from './Modal';
import Field from './Field';

export default function ServicesCMSPanel({ onConfirmDelete }) {
  const { services = [] } = useContent();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleCreateNew = () => {
    const fresh = emptyService();
    setFormData(fresh);
    setDeliverablesInput(fresh.deliverables.join('\n'));
    setTagsInput(fresh.tags.join(', '));
    setIsEditing(true);
  };

  const handleEdit = (service) => {
    setFormData({ ...service });
    setDeliverablesInput(service.deliverables.join('\n'));
    setTagsInput(service.tags.join(', '));
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const deliverables = deliverablesInput
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    saveService({
      ...formData,
      deliverables,
      tags,
      basePrice: Number(formData.basePrice) || 0,
      basePriceUSD: Number(formData.basePriceUSD) || 0,
    });

    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Services Catalog CMS</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              {services.filter((s) => s.isPublished).length} Published Offerings
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Define standardized agency service packages, deliverables checklists, SAC codes, and pricing models used across proposals and public site.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold"
        >
          <Plus size={14} /> Add Service Offering
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition ${
              service.isPublished
                ? 'border-white/10 bg-slate-950/70 hover:border-cyan-500/30'
                : 'border-white/5 bg-slate-950/40 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                    {service.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleServicePublish(service.id)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                      service.isPublished
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {service.isPublished ? '● Published' : '○ Draft'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                    title="Edit Service"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onConfirmDelete({
                        title: `Delete Service "${service.name}"?`,
                        message: 'This will remove the service offering from the catalog.',
                        onConfirm: () => deleteService(service.id),
                      })
                    }
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                    title="Delete Service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="mt-3 font-heading text-base font-bold text-white">{service.name}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{service.shortDesc}</p>

              {/* Pricing badge */}
              <div className="mt-3 flex items-center gap-3 font-mono text-xs">
                <span className="font-bold text-emerald-400">
                  ₹{service.basePrice.toLocaleString()} INR
                </span>
                <span className="text-slate-500">/</span>
                <span className="font-semibold text-slate-300">
                  ${(service.basePriceUSD || Math.round(service.basePrice * 0.012)).toLocaleString()} USD
                </span>
                <span className="text-[10px] text-slate-500">(SAC {service.sacCode})</span>
              </div>

              {/* Deliverables checklist preview */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Included Deliverables ({service.deliverables.length}):
                </p>
                {service.deliverables.slice(0, 3).map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 size={12} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Tags */}
            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
              {service.tags.map((tag, idx) => (
                <span key={idx} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && formData && (
        <Modal
          title={formData.name ? `Edit Service: ${formData.name}` : 'New Service Offering'}
          onClose={() => setIsEditing(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Service Name (Required)">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Web Application Development"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Category">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="Development">Development</option>
                  <option value="AI & Automations">AI & Automations</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Digital Growth">Digital Growth</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Base Price (INR ₹)">
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="Base Price (USD $)">
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.basePriceUSD}
                  onChange={(e) => setFormData({ ...formData, basePriceUSD: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>

              <Field label="SAC / HSN Code">
                <input
                  type="text"
                  value={formData.sacCode}
                  onChange={(e) => setFormData({ ...formData, sacCode: e.target.value })}
                  placeholder="998311"
                  className="w-full font-mono rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </Field>
            </div>

            <Field label="Short Overview Description">
              <input
                type="text"
                required
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="High-performance MERN & Next.js applications engineered for enterprise scale."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <Field label="Deliverables Checklist (1 item per line)">
              <textarea
                rows={4}
                required
                value={deliverablesInput}
                onChange={(e) => setDeliverablesInput(e.target.value)}
                placeholder="Production Next.js Frontend&#10;Node.js API Backend&#10;PostgreSQL Database Setup"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-cyan-400 font-mono"
              />
            </Field>

            <Field label="Technology Tags (comma separated)">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Next.js, React, TypeScript, Node.js, PostgreSQL"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </Field>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="servicePublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400"
              />
              <label htmlFor="servicePublished" className="text-xs text-slate-300">
                Publish this service live in the agency catalog & proposals
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
                Save Service Offering
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
