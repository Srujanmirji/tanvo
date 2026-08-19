import { useMemo, useState } from 'react';
import {
  Link as LinkIcon,
  Lock,
  Mail,
  MessageCircle,
  Search,
  Send,
  Settings,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  INBOX_CHANNELS,
} from '../lib/constants';
import {
  assignConversation,
  deleteConversation,
  linkConversationEntity,
  markConversationRead,
  saveConversation,
  sendMessage,
  setConversationStatus,
  useContent,
} from '../lib/store';
import ConnectedAccountsModal from './ConnectedAccountsModal';

function InstagramIcon({ size = 14, className = '' }) {
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

const PRESET_TEMPLATES = [
  {
    id: 'SPRINT_UPDATE',
    label: '🚀 Sprint & Deployment Update',
    subject: (ctx) => `[Sprint Update] ${ctx.name} Staging Deployment Live`,
    body: (ctx) =>
      `Hi ${ctx.name},\n\nWe're excited to let you know that our latest engineering sprint for your platform is deployed and live on staging! 🚀\n\n📌 *Key Deliverables:*\n• Core architecture & modular backend APIs wired\n• Staging integration tests passed with 0 regressions\n• Mobile responsive UI flows optimized for sub-1s load\n\nLet us know your feedback!\n\n— Tanvo Tech Team`,
  },
  {
    id: 'DELIVERABLE',
    label: '📋 Deliverable Ready for Sign-Off',
    subject: (ctx) => `[Review Required] Deliverable Ready for ${ctx.name}`,
    body: (ctx) =>
      `Hi ${ctx.name},\n\nA new deliverable milestone is ready for your team's review and sign-off.\n\n📂 Deliverable Scope: Production Architecture & Staging Handover\n📅 Target Review: Within 3 business days\n\nPlease review and approve when ready!\n\nBest,\nTanvo Delivery Team`,
  },
  {
    id: 'INVOICE',
    label: '💳 Invoice Issued & Payment Link',
    subject: (ctx) => `[Invoice] Milestone Billing for ${ctx.name}`,
    body: (ctx) =>
      `Dear ${ctx.name},\n\nYour milestone invoice has been issued and is ready for settlement.\n\nPayment options: UPI QR, Bank Wire Transfer, or Online Card Checkout.\n\nThank you for your partnership!\n— Tanvo Finance`,
  },
  {
    id: 'WELCOME',
    label: '🤝 Welcome & Workspace Credentials',
    subject: () => `Welcome to Tanvo Tech — Workspace Credentials`,
    body: (ctx) =>
      `Hi ${ctx.name},\n\nWelcome to Tanvo Tech! 🤝 Your private client workspace is active. You can track real-time sprint milestones and review deliverables anytime.\n\nLooking forward to building something grand together!\n\n— Tanvo Tech Team`,
  },
];

export default function InboxPanel() {
  const {
    conversations = [],
    messages = [],
    clients = [],
    leads = [],
    projects = [],
  } = useContent();

  const [selectedConvId, setSelectedConvId] = useState(conversations[0]?.id || null);
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reply Composer state
  const [composerMode, setComposerMode] = useState('message'); // 'message' | 'internal_note'
  const [replyText, setReplyText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Linker state
  const [isLinkingOpen, setIsLinkingOpen] = useState(false);

  // Filtered Conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (channelFilter !== 'ALL' && c.channel !== channelFilter) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (unreadOnly && !c.unread) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (c.contactName || '').toLowerCase().includes(q);
        const matchesHandle = (c.contactHandle || '').toLowerCase().includes(q);
        const matchesPreview = (c.lastMessagePreview || '').toLowerCase().includes(q);
        const matchesTags = (c.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesHandle && !matchesPreview && !matchesTags) return false;
      }
      return true;
    });
  }, [conversations, channelFilter, statusFilter, unreadOnly, searchQuery]);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || filteredConversations[0] || null;

  // Active Conversation Messages
  const activeMessages = useMemo(() => {
    if (!activeConv) return [];
    return messages
      .filter((m) => m.conversationId === activeConv.id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [messages, activeConv]);

  // Linked Client / Lead / Project
  const linkedClient = clients.find((cl) => cl.id === activeConv?.clientId) || null;
  const linkedLead = leads.find((l) => l.id === activeConv?.leadId) || null;
  const linkedProject = projects.find((p) => p.id === activeConv?.projectId || p.clientId === activeConv?.clientId) || null;

  const handleSelectConversation = (conv) => {
    setSelectedConvId(conv.id);
    if (conv.unread) {
      markConversationRead(conv.id);
    }
  };

  const handleSend = (resolve = false) => {
    if (!replyText.trim() || !activeConv) return;

    sendMessage(activeConv.id, {
      sender: 'team',
      senderName: 'Satvik Pandurangi',
      type: composerMode === 'internal_note' ? 'internal_note' : 'message',
      channel: activeConv.channel,
      content: composerMode === 'message' && activeConv.channel === 'EMAIL' && emailSubject
        ? `Subject: ${emailSubject}\n\n${replyText}`
        : replyText,
      resolve,
    });

    setReplyText('');
    setEmailSubject('');
    setSelectedPreset('');
  };

  const handleInsertPreset = (presetId) => {
    setSelectedPreset(presetId);
    const tmpl = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!tmpl || !activeConv) return;

    const ctx = { name: activeConv.contactName || 'Team' };
    if (activeConv.channel === 'EMAIL') {
      setEmailSubject(tmpl.subject(ctx));
    }
    setReplyText(tmpl.body(ctx));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim() || !activeConv) return;
    const currentTags = activeConv.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      saveConversation({
        ...activeConv,
        tags: [...currentTags, tagInput.trim()],
      });
    }
    setTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!activeConv) return;
    saveConversation({
      ...activeConv,
      tags: (activeConv.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  const getChannelIcon = (ch) => {
    if (ch === 'EMAIL') return <Mail size={14} className="text-blue-400" />;
    if (ch === 'WHATSAPP') return <MessageCircle size={14} className="text-emerald-400" />;
    return <InstagramIcon size={14} className="text-pink-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Settings Trigger */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Unified Multi-Channel Inbox</h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              Email &bull; WhatsApp &bull; Instagram DMs
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time multi-channel client communications with internal notes, lead linking, and quick dispatch presets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAccountsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
        >
          <Settings size={14} /> Connected Accounts (3)
        </button>
      </div>

      {/* 3-PANE INBOX CONTAINER */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 min-h-[750px] rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        
        {/* ========================================================= */}
        {/* PANE 1: CONVERSATION LIST (LEFT PANE - 4 COLS) */}
        {/* ========================================================= */}
        <div className="border-b border-white/10 p-4 lg:col-span-4 lg:border-b-0 lg:border-r flex flex-col justify-between">
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search messages, names, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            {/* Channel Filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setChannelFilter('ALL')}
                className={`rounded-lg px-2.5 py-1 font-medium transition shrink-0 ${
                  channelFilter === 'ALL'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                All Channels
              </button>
              {INBOX_CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChannelFilter(ch.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition shrink-0 ${
                    channelFilter === ch.id
                      ? `${ch.badgeBg} border`
                      : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {getChannelIcon(ch.id)}
                  <span>{ch.label}</span>
                </button>
              ))}
            </div>

            {/* Status & Unread Bar */}
            <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 text-[11px]">
              <div className="flex gap-1">
                {['ALL', 'OPEN', 'PENDING', 'RESOLVED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded px-2 py-0.5 font-medium transition ${
                      statusFilter === st
                        ? 'bg-white/10 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>Unread</span>
              </label>
            </div>
          </div>

          {/* Conversation Cards Stream */}
          <div className="mt-3 space-y-2 overflow-y-auto max-h-[580px] pr-1 flex-1">
            {filteredConversations.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No conversations match current filters.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                const matchedClient = clients.find((c) => c.id === conv.clientId);
                const matchedLead = leads.find((l) => l.id === conv.leadId);

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      isSelected
                        ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/5'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900">
                          {getChannelIcon(conv.channel)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-xs font-bold text-white truncate">
                              {conv.contactName || 'Unknown Contact'}
                            </span>
                            {conv.unread && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                            )}
                          </div>
                          <p className="font-mono text-[10px] text-slate-500 truncate">
                            {conv.contactHandle}
                          </p>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] text-slate-500 shrink-0">
                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    {/* Matched Client or Lead Badge */}
                    {(matchedClient || matchedLead) && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 border border-white/5">
                          {matchedClient ? `🏢 ${matchedClient.company}` : `🎯 Lead: ${matchedLead.company || matchedLead.name}`}
                        </span>
                      </div>
                    )}

                    {/* Last message preview */}
                    <p className="mt-1.5 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                      {conv.lastMessagePreview || 'No messages yet.'}
                    </p>

                    {/* Tags & Assignee */}
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t border-white/5 pt-2">
                      <div className="flex flex-wrap gap-1">
                        {(conv.tags || []).slice(0, 2).map((t) => (
                          <span key={t} className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] text-slate-400 border border-white/5">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {conv.assignedTo}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* PANE 2: MESSAGE THREAD VIEW & COMPOSER (MIDDLE PANE - 5 COLS) */}
        {/* ========================================================= */}
        <div className="border-b border-white/10 lg:col-span-5 lg:border-b-0 lg:border-r flex flex-col justify-between h-full bg-slate-950/40">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4 bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950">
                    {getChannelIcon(activeConv.channel)}
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-white">
                      {activeConv.contactName || 'Unknown Contact'}
                    </h3>
                    <p className="font-mono text-xs text-slate-400">{activeConv.contactHandle}</p>
                  </div>
                </div>

                {/* Status & Assignee Selectors */}
                <div className="flex items-center gap-2">
                  <select
                    value={activeConv.status}
                    onChange={(e) => setConversationStatus(activeConv.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="OPEN">Open</option>
                    <option value="PENDING">Pending</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>

                  <select
                    value={activeConv.assignedTo}
                    onChange={(e) => assignConversation(activeConv.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="satvik">Satvik (SP)</option>
                    <option value="zeeshan">Zeeshan (ZM)</option>
                    <option value="unassigned">Unassigned</option>
                  </select>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[460px]">
                {activeMessages.map((msg) => {
                  const isContact = msg.sender === 'contact';
                  const isInternal = msg.type === 'internal_note';

                  if (isInternal) {
                    return (
                      <div
                        key={msg.id}
                        className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200"
                      >
                        <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5 mb-2 font-mono text-[10px] text-amber-400 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Lock size={12} />
                            <span>INTERNAL TEAM NOTE &bull; {msg.senderName}</span>
                          </div>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isContact ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          isContact
                            ? 'border border-white/10 bg-slate-900 text-slate-200'
                            : 'border border-cyan-500/30 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-1 mb-1.5 font-mono text-[10px] text-slate-400">
                          <span>{msg.senderName}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Composer */}
              <div className="border-t border-white/10 p-3.5 bg-slate-900/80 space-y-2.5">
                {/* Composer Mode & Preset Bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex rounded-lg border border-white/10 bg-slate-950 p-0.5">
                    <button
                      type="button"
                      onClick={() => setComposerMode('message')}
                      className={`rounded px-2.5 py-1 font-semibold transition ${
                        composerMode === 'message'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Reply to Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposerMode('internal_note')}
                      className={`flex items-center gap-1 rounded px-2.5 py-1 font-semibold transition ${
                        composerMode === 'internal_note'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Lock size={11} /> Internal Note
                    </button>
                  </div>

                  {/* Preset Dropdown */}
                  {composerMode === 'message' && (
                    <select
                      value={selectedPreset}
                      onChange={(e) => handleInsertPreset(e.target.value)}
                      className="rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-xs text-cyan-400 focus:border-cyan-500/50 focus:outline-none"
                    >
                      <option value="">⚡ Quick Preset Templates...</option>
                      {PRESET_TEMPLATES.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Email Subject field (Only for Email channel & Client Reply) */}
                {composerMode === 'message' && activeConv.channel === 'EMAIL' && (
                  <input
                    type="text"
                    placeholder="Subject: Sprint update regarding project..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none font-mono"
                  />
                )}

                {/* Message Textarea */}
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    composerMode === 'internal_note'
                      ? 'Write a private note for the engineering team...'
                      : activeConv.channel === 'EMAIL'
                        ? 'Compose formal email reply with markdown formatting...'
                        : `Type ${activeConv.channel} message reply...`
                  }
                  className={`w-full rounded-xl border p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none ${
                    composerMode === 'internal_note'
                      ? 'border-amber-500/30 bg-amber-950/20 focus:border-amber-500/50'
                      : 'border-white/10 bg-slate-950 focus:border-cyan-500/50'
                  }`}
                />

                {/* Send Buttons */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Channel: <strong className="text-slate-300">{activeConv.channel}</strong>
                  </span>

                  <div className="flex gap-2">
                    {composerMode === 'message' && (
                      <button
                        type="button"
                        onClick={() => handleSend(true)}
                        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                      >
                        Send & Resolve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSend(false)}
                      className={`btn-primary flex items-center gap-1.5 px-4 py-1.5 text-xs ${
                        composerMode === 'internal_note' ? 'border-amber-500/30 bg-amber-500/20 text-amber-300' : ''
                      }`}
                    >
                      <Send size={13} /> {composerMode === 'internal_note' ? 'Save Note' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-xs text-slate-500">
              Select a conversation from the left to view thread.
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* PANE 3: CONTEXT & ENTITY LINKING (RIGHT PANE - 3 COLS) */}
        {/* ========================================================= */}
        <div className="p-4 lg:col-span-3 flex flex-col justify-between space-y-4 bg-slate-950/60">
          {activeConv ? (
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Context & Entity Match
                </h4>
              </div>

              {/* Linked Client Info */}
              {linkedClient ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-semibold text-emerald-400">
                      🏢 Active Client Account
                    </span>
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                      {linkedClient.accessCode}
                    </span>
                  </div>
                  <h5 className="font-heading text-sm font-bold text-white">
                    {linkedClient.company || linkedClient.name}
                  </h5>
                  <p className="text-[11px] text-slate-400">{linkedClient.email} &bull; {linkedClient.phone}</p>
                  
                  {linkedProject && (
                    <div className="mt-2 rounded border border-white/5 bg-slate-900/60 p-2 text-xs text-slate-300">
                      <p className="text-[10px] text-slate-500 uppercase">Linked Project</p>
                      <p className="font-semibold text-white truncate">{linkedProject.title}</p>
                      <p className="text-[10px] text-cyan-400">{linkedProject.progress}% Progress</p>
                    </div>
                  )}
                </div>
              ) : linkedLead ? (
                /* Linked Lead Info */
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-semibold text-blue-400">
                      🎯 CRM Prospect Lead
                    </span>
                    <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-blue-300">
                      {linkedLead.status}
                    </span>
                  </div>
                  <h5 className="font-heading text-sm font-bold text-white">
                    {linkedLead.company || linkedLead.name}
                  </h5>
                  <p className="text-[11px] text-slate-400">{linkedLead.email} &bull; {linkedLead.budgetBand}</p>
                  <p className="text-[11px] text-slate-300 italic">"{linkedLead.message?.slice(0, 80)}..."</p>
                </div>
              ) : (
                /* Unlinked Contact Prompt */
                <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.01] p-4 text-center space-y-2">
                  <User size={24} className="mx-auto text-slate-500" />
                  <p className="text-xs font-semibold text-white">Unlinked Contact</p>
                  <p className="text-[11px] text-slate-400">
                    Match this message thread to an existing client or lead profile to track project milestones.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLinkingOpen(true)}
                    className="mt-2 w-full rounded-lg border border-cyan-500/40 bg-cyan-500/10 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
                  >
                    <LinkIcon size={12} className="inline mr-1" /> Link to Client / Lead
                  </button>
                </div>
              )}

              {/* Entity Linker Dropdown Modal / Form */}
              {isLinkingOpen && (
                <div className="rounded-xl border border-cyan-500/40 bg-slate-900 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Link Conversation</span>
                    <button type="button" onClick={() => setIsLinkingOpen(false)} className="text-slate-400 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400">Select Client</label>
                    <select
                      onChange={(e) => {
                        linkConversationEntity(activeConv.id, { clientId: e.target.value });
                        setIsLinkingOpen(false);
                      }}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 p-1.5 text-xs text-white"
                    >
                      <option value="">Choose a Client...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.company || c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400">Or Select CRM Lead</label>
                    <select
                      onChange={(e) => {
                        linkConversationEntity(activeConv.id, { leadId: e.target.value });
                        setIsLinkingOpen(false);
                      }}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 p-1.5 text-xs text-white"
                    >
                      <option value="">Choose a Lead...</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>{l.company || l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Tags Manager */}
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Conversation Tags</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingTag(!isAddingTag)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    + Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(activeConv.tags || []).map((t) => (
                    <span
                      key={t}
                      className="group flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                {isAddingTag && (
                  <form onSubmit={handleAddTag} className="mt-2 flex gap-1">
                    <input
                      type="text"
                      placeholder="tag name..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="w-full rounded border border-white/10 bg-slate-950 px-2 py-1 text-xs text-white"
                    />
                    <button type="submit" className="rounded bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300">
                      Add
                    </button>
                  </form>
                )}
              </div>

              {/* Channel Account Details */}
              <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3 text-xs space-y-1.5 text-slate-400">
                <p className="text-[10px] uppercase font-mono text-slate-500">Channel Integration</p>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Channel</span>
                  <span className="font-semibold text-white">{activeConv.channel}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Messages</span>
                  <span className="font-mono text-white">{activeMessages.length} total</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No conversation context available.
            </div>
          )}

          {/* Delete Action */}
          {activeConv && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this conversation thread permanently?')) {
                  deleteConversation(activeConv.id);
                  setSelectedConvId(null);
                }
              }}
              className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-red-500/20 bg-red-500/5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={13} /> Delete Conversation
            </button>
          )}
        </div>
      </div>

      {/* Connected Accounts Settings Modal */}
      {isAccountsModalOpen && (
        <ConnectedAccountsModal onClose={() => setIsAccountsModalOpen(false)} />
      )}
    </div>
  );
}
