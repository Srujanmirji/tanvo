import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Mail,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { SITE } from '../lib/constants';
import { emptyDispatchLog, saveDispatchLog, useContent } from '../lib/store';

const TEMPLATES = [
  {
    id: 'SPRINT_UPDATE',
    label: '🚀 Sprint & Deployment Update',
    subject: (ctx) => `[Sprint Update] ${ctx.clientName} Staging Deployment Live`,
    body: (ctx) =>
      `*Tanvo Tech Engineering Update*\n\n` +
      `Hi ${ctx.contactName},\n\n` +
      `We're excited to let you know that our latest engineering sprint for *${ctx.clientName}* is deployed and live on staging! 🚀\n\n` +
      `📌 *Key Deliverables in this Sprint:*\n` +
      `• Core architecture & modular backend APIs wired\n` +
      `• Staging integration tests passed with 0 regressions\n` +
      `• Mobile responsive UI flows optimized for sub-1s load\n\n` +
      `🔗 *Test on Staging:* https://staging.tanvo.tech/${ctx.accessCode?.toLowerCase()}\n` +
      `📊 *Client Workspace:* https://portal.tanvo.tech?code=${ctx.accessCode}\n\n` +
      `Let us know your feedback or reply here with any questions!\n\n` +
      `— Tanvo Tech Engineering Pod`,
  },
  {
    id: 'DELIVERABLE',
    label: '📋 Deliverable Ready for Sign-Off',
    subject: (ctx) => `[Review Required] Deliverable Ready for ${ctx.clientName}`,
    body: (ctx) =>
      `*Action Required: Deliverable Sign-Off*\n\n` +
      `Hi ${ctx.contactName},\n\n` +
      `A new deliverable milestone is ready for your team's review and sign-off in the *${ctx.clientName}* workspace.\n\n` +
      `📂 *Deliverable Scope:* Production Architecture & Staging Handover\n` +
      `📅 *Target Review Date:* Within 3 business days\n\n` +
      `👉 Please review and approve directly in your portal:\n` +
      `https://portal.tanvo.tech?code=${ctx.accessCode}\n\n` +
      `Feel free to add comments or request tweaks directly in the portal.\n\n` +
      `Best,\nTanvo Delivery Team`,
  },
  {
    id: 'INVOICE',
    label: '💳 Invoice Due & Payment Link',
    subject: (ctx) => `[Invoice] Milestone Billing for ${ctx.clientName}`,
    body: (ctx) =>
      `*Tanvo Tech Milestone Invoice*\n\n` +
      `Dear ${ctx.contactName},\n\n` +
      `Your milestone invoice for *${ctx.clientName}* has been issued and is ready for settlement.\n\n` +
      `📄 *Invoice No:* TNV-2026-${Math.floor(100 + Math.random() * 900)}\n` +
      `💳 *Settlement Options:* UPI QR, Razorpay, or Direct Wire Transfer\n\n` +
      `🔗 *View & Pay Online:* https://portal.tanvo.tech?code=${ctx.accessCode}\n\n` +
      `Thank you for your partnership!\n` +
      `— Tanvo Finance & Operations`,
  },
  {
    id: 'WELCOME',
    label: '🤝 Welcome & Portal Access Credentials',
    subject: () => 'Welcome to Tanvo Tech — Your Client Workspace Credentials',
    body: (ctx) =>
      `*Welcome to Tanvo Tech!* 🤝\n\n` +
      `Hi ${ctx.contactName},\n\n` +
      `Your dedicated client portal workspace for *${ctx.clientName}* is now active.\n\n` +
      `🔑 *Your Access Code:* \`${ctx.accessCode}\`\n` +
      `🌐 *Workspace URL:* https://portal.tanvo.tech?code=${ctx.accessCode}\n\n` +
      `Through your portal you can track real-time milestone progress, view sprint deployment changelogs, review deliverables, and submit scope addition requests.\n\n` +
      `Looking forward to building something grand together!\n\n` +
      `— ${SITE.name} Team`,
  },
  {
    id: 'CUSTOM',
    label: '✍️ Custom Announcement / Note',
    subject: (ctx) => `Update regarding ${ctx.clientName} project`,
    body: (ctx) =>
      `Hi ${ctx.contactName},\n\n` +
      `Here is a quick update regarding our ongoing engineering work for *${ctx.clientName}*:\n\n` +
      `[Type your custom message here...]\n\n` +
      `Best regards,\nTanvo Tech Team`,
  },
];

export default function ClientNotifierModal({ initialClient, onClose, onDispatched }) {
  const { clients = [] } = useContent();

  const [selectedClientId, setSelectedClientId] = useState(
    initialClient?.id || clients[0]?.id || '',
  );
  const [templateId, setTemplateId] = useState('SPRINT_UPDATE');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);

  const activeClient = clients.find((c) => c.id === selectedClientId) || initialClient || null;

  // Re-populate template when client or templateId changes
  useEffect(() => {
    if (!activeClient) return;

    setRecipientEmail(activeClient.email || '');
    setRecipientPhone(activeClient.phone || '');

    const ctx = {
      clientName: activeClient.company || activeClient.name || 'Client',
      contactName: activeClient.name || 'Team',
      accessCode: activeClient.accessCode || 'CLIENT-2026',
    };

    const tmpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    setSubject(tmpl.subject(ctx));
    setBody(tmpl.body(ctx));
  }, [activeClient, templateId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSend = () => {
    if (!recipientPhone) {
      alert('Please enter a valid WhatsApp phone number for this client.');
      return;
    }

    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(body)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');

    const log = {
      ...emptyDispatchLog(),
      clientId: activeClient?.id || '',
      clientName: activeClient?.company || activeClient?.name || 'Client',
      recipientEmail,
      recipientPhone,
      channel: 'WHATSAPP',
      templateType: templateId,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };

    saveDispatchLog(log);
    setDispatchStatus('WhatsApp message opened & logged to audit stream!');
    if (onDispatched) onDispatched(log);
  };

  const handleEmailSend = () => {
    if (!recipientEmail) {
      alert('Please enter a valid email address for this client.');
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    const log = {
      ...emptyDispatchLog(),
      clientId: activeClient?.id || '',
      clientName: activeClient?.company || activeClient?.name || 'Client',
      recipientEmail,
      recipientPhone,
      channel: 'EMAIL',
      templateType: templateId,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };

    saveDispatchLog(log);
    setDispatchStatus('Email draft generated & logged to audit stream!');
    if (onDispatched) onDispatched(log);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col rounded-2xl border border-white/10 bg-slate-950 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-300">
                CLIENT COMMUNICATIONS
              </span>
              <span className="text-xs text-slate-400">Email & WhatsApp Dispatcher</span>
            </div>
            <h2 className="mt-1 font-heading text-xl font-bold text-white">
              Send Live Updates to Client
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Target Client & Template Selectors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Target Client Workspace
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company || c.name} [{c.accessCode}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Notification Template Preset
              </label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Recipient Email Address
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                WhatsApp Phone (with Country Code)
              </label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+91 98000 00000 / +1 (555) 000-0000"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Message Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase tracking-wider text-slate-400">
                Message Body (Formatted for WhatsApp & Email)
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied to clipboard' : 'Copy Text'}
              </button>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-relaxed text-white font-mono outline-none focus:border-cyan-400"
            />
          </div>

          {dispatchStatus && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              {dispatchStatus}
            </div>
          )}
        </div>

        {/* Footer with Action Dispatchers */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-white/10 p-4 sm:px-6">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Sparkles size={13} className="text-cyan-400" />
            <span>Dual-channel instant delivery</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleWhatsAppSend}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-600/30"
            >
              <MessageCircle size={14} /> Send via WhatsApp
            </button>

            <button
              type="button"
              onClick={handleEmailSend}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 px-4 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-600/30"
            >
              <Mail size={14} /> Send via Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
