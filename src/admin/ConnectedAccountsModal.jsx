import { useState } from 'react';
import {
  Mail,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';

function InstagramIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ConnectedAccountsModal({ onClose }) {
  const [selectedChannel, setSelectedChannel] = useState(null);

  const channels = [
    {
      id: 'EMAIL',
      name: 'Google Workspace / Custom Email (IMAP/SMTP)',
      icon: Mail,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      desc: 'Sync incoming client emails and reply directly from your agency email address (hello@tanvo.tech).',
      status: 'Not connected yet',
      fields: ['Email Address', 'App Password / OAuth Client ID', 'IMAP Server Host', 'Port (Default: 993)'],
    },
    {
      id: 'WHATSAPP',
      name: 'WhatsApp Business Cloud API',
      icon: MessageCircle,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      desc: 'Receive inbound client chats and trigger automated sprint updates via official Meta WhatsApp Business Cloud API.',
      status: 'Not connected yet',
      fields: ['Meta Business Account ID', 'WhatsApp Phone Number ID', 'Permanent System User Access Token', 'Webhook Verify Token'],
    },
    {
      id: 'INSTAGRAM',
      name: 'Instagram Direct Message Graph API',
      icon: InstagramIcon,
      color: 'text-pink-400',
      border: 'border-pink-500/30',
      bg: 'bg-pink-500/10',
      desc: 'Monitor incoming prospect inquiries and DM conversations from your official Instagram agency handle.',
      status: 'Not connected yet',
      fields: ['Connected Facebook Page ID', 'Instagram Professional Account ID', 'Page Access Token', 'Webhook Callback URL'],
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-white sm:text-xl">
                Connected Inbound Accounts
              </span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                Channel Integrations
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Configure real-time webhooks and OAuth API connections for Email, WhatsApp, and Instagram DMs.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Integration Cards */}
        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {channels.map((ch) => {
            const Icon = ch.icon;
            const isSelected = selectedChannel === ch.id;

            return (
              <div
                key={ch.id}
                className={`rounded-2xl border ${isSelected ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10 bg-white/[0.02]'} p-5 transition`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${ch.border} ${ch.bg} ${ch.color}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-white">{ch.name}</h4>
                      <p className="mt-0.5 text-xs text-slate-400">{ch.desc}</p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                    {ch.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[11px] text-slate-500">Backend API Webhook integration placeholder</span>
                  <button
                    type="button"
                    onClick={() => setSelectedChannel(isSelected ? null : ch.id)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    {isSelected ? 'Hide Config' : 'View API Config'}
                  </button>
                </div>

                {isSelected && (
                  <div className="mt-4 rounded-xl border border-white/5 bg-slate-900/80 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                      <ShieldCheck size={14} /> Production API Credential Slots
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {ch.fields.map((f) => (
                        <div key={f}>
                          <label className="block text-[10px] uppercase font-mono text-slate-500">{f}</label>
                          <input
                            type="text"
                            disabled
                            placeholder="Pending Backend Setup..."
                            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      ℹ️ Webhook dispatchers will be wired automatically once official Meta / Google API credentials are provided.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary px-5 py-2 text-xs"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
