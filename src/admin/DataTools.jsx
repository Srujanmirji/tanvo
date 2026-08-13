import { useRef, useState } from 'react';
import { Download, Info, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { exportJson, importJson, purgeSamples, resetToSeed, useContent } from '../lib/store';

export default function DataTools({ onRequestConfirm }) {
  const content = useContent();
  const fileRef = useRef(null);
  const [message, setMessage] = useState(null);

  const sampleCount =
    content.projects.filter((p) => p.isSample).length +
    content.achievements.filter((a) => a.isSample).length;

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tanvo-content-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage({ tone: 'ok', text: 'Exported. Commit this into src/data/seed.js to publish it.' });
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importJson(text);
    setMessage(
      result.ok
        ? { tone: 'ok', text: 'Content replaced from file.' }
        : { tone: 'error', text: `Import failed — ${result.error}` },
    );
    // Reset so re-selecting the same file fires change again.
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Data</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Edits here are saved in this browser only. To publish them to visitors, export
          the JSON and commit it into the site.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4 text-xs leading-relaxed text-cyan-100/70">
        <Info size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <strong className="font-semibold text-cyan-200">Publishing workflow</strong>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>Make your edits on the Pipeline and Achievements tabs.</li>
            <li>Click <em>Export JSON</em> below.</li>
            <li>
              Paste the <code>projects</code> and <code>achievements</code> arrays into{' '}
              <code>src/data/seed.js</code>.
            </li>
            <li>Commit and redeploy.</li>
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
          <Download size={16} aria-hidden="true" /> Export JSON
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="btn-secondary justify-start px-5 py-3 text-sm"
        >
          <Upload size={16} aria-hidden="true" /> Import JSON
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
                setMessage({ tone: 'ok', text: 'Sample content removed.' });
              },
            })
          }
          className="btn-secondary justify-start px-5 py-3 text-sm disabled:opacity-40"
        >
          <Sparkles size={16} aria-hidden="true" />
          {sampleCount > 0 ? `Remove ${sampleCount} sample records` : 'No samples left'}
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
                setMessage({ tone: 'ok', text: 'Content reset to the shipped defaults.' });
              },
            })
          }
          className="btn-secondary justify-start px-5 py-3 text-sm hover:border-red-500/30 hover:text-red-300"
        >
          <RotateCcw size={16} aria-hidden="true" /> Reset to defaults
        </button>
      </div>
    </div>
  );
}
