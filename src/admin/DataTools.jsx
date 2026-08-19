import { useRef, useState } from 'react';
import { Download, Info, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { exportJson, importJson, purgeSamples, resetToSeed, useContent } from '../lib/store';

export default function DataTools({ onRequestConfirm }) {
  const content = useContent();
  const fileRef = useRef(null);
  const [message, setMessage] = useState(null);

  const sampleCount =
    (content.projects?.filter((p) => p.isSample).length || 0) +
    (content.clients?.filter((c) => c.isSample).length || 0) +
    (content.leads?.filter((l) => l.isSample).length || 0) +
    (content.quotes?.filter((q) => q.isSample).length || 0) +
    (content.services?.filter((s) => s.isSample).length || 0) +
    (content.caseStudies?.filter((cs) => cs.isSample).length || 0) +
    (content.applications?.filter((a) => a.isSample).length || 0) +
    (content.testimonials?.filter((t) => t.isSample).length || 0) +
    (content.updates?.filter((u) => u.isSample).length || 0) +
    (content.deliverables?.filter((d) => d.isSample).length || 0) +
    (content.invoices?.filter((i) => i.isSample).length || 0) +
    (content.tickets?.filter((t) => t.isSample).length || 0) +
    (content.documents?.filter((doc) => doc.isSample).length || 0) +
    (content.achievements?.filter((a) => a.isSample).length || 0) +
    (content.dispatchLogs?.filter((dl) => dl.isSample).length || 0);

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tanvo-agency-store-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage({ tone: 'ok', text: 'Exported complete store JSON. You can backup or commit into src/data/seed.js.' });
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importJson(text);
    setMessage(
      result.ok
        ? { tone: 'ok', text: 'Content replaced successfully from file.' }
        : { tone: 'error', text: `Import failed — ${result.error}` },
    );
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Data Management & Full Store Backup</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          All changes to clients, leads, quotes, deliverables, invoices, tickets, services, and projects persist live in this browser.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4 text-xs leading-relaxed text-cyan-100/70">
        <Info size={15} className="mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
        <div>
          <strong className="font-semibold text-cyan-200">Production Agency Workflow</strong>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-slate-300">
            <li>Manage your real clients, proposals, invoices, and deliverables in the operations tabs.</li>
            <li>Click <em>Export Full Store JSON</em> below to download timestamped backups anytime.</li>
            <li>
              Use <em>Remove sample records</em> to start with a fresh clean workspace for your real live projects.
            </li>
          </ol>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-lg border p-3 text-xs ${
            message.tone === 'ok'
              ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
              : 'border-red-500/20 bg-red-500/5 text-red-300'
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" onClick={handleExport} className="btn-secondary justify-start px-5 py-3 text-sm">
          <Download size={16} aria-hidden="true" className="text-cyan-400" /> Export Full Store JSON
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="btn-secondary justify-start px-5 py-3 text-sm"
        >
          <Upload size={16} aria-hidden="true" className="text-cyan-400" /> Import Store JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          className="sr-only"
          aria-label="Choose a JSON file to import"
        />

        <button
          type="button"
          disabled={sampleCount === 0}
          onClick={() =>
            onRequestConfirm({
              title: `${sampleCount} sample record${sampleCount === 1 ? '' : 's'}`,
              kind: 'sample content',
              confirmLabel: 'Remove samples',
              onConfirm: () => {
                purgeSamples();
                setMessage({ tone: 'ok', text: 'All sample/demo content removed. Ready for live projects!' });
              },
            })
          }
          className="btn-secondary justify-start px-5 py-3 text-sm disabled:opacity-40"
        >
          <Sparkles size={16} aria-hidden="true" className="text-amber-400" />
          {sampleCount > 0 ? `Remove ${sampleCount} sample records (Go Clean)` : 'Clean State (No samples)'}
        </button>

        <button
          type="button"
          onClick={() =>
            onRequestConfirm({
              title: 'all your changes',
              kind: 'content',
              confirmLabel: 'Reset everything',
              onConfirm: () => {
                resetToSeed();
                setMessage({ tone: 'ok', text: 'Content reset to default seed data.' });
              },
            })
          }
          className="btn-secondary justify-start px-5 py-3 text-sm hover:border-red-500/30 hover:text-red-300"
        >
          <RotateCcw size={16} aria-hidden="true" className="text-rose-400" /> Reset to seed defaults
        </button>
      </div>
    </div>
  );
}
