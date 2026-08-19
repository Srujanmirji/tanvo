/** Canonical site metadata. Update SITE_URL before deploying. */
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://tanvo.tech';

export const SITE = {
  name: 'Tanvo Tech',
  legalName: 'Tanvo Tech Private Limited',
  tagline: 'Web, App, AI & Digital Solutions Agency',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'hello@tanvo.tech',
  phone: import.meta.env.VITE_CONTACT_PHONE ?? '+91 80 4719 2000',
  location: import.meta.env.VITE_CONTACT_LOCATION ?? 'Bengaluru, Karnataka, India',
  gstin: '29ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  bankDetails: {
    bankName: 'HDFC Bank',
    accountName: 'Tanvo Tech Private Limited',
    accountNumber: '50200088992211',
    ifsc: 'HDFC0001234',
    branch: 'Indiranagar, Bengaluru',
    swift: 'HDFCINBBXXX',
    upiId: 'tanvotech@hdfcbank',
  },
  socials: {
    github: import.meta.env.VITE_SOCIAL_GITHUB ?? 'https://github.com/tanvo',
    twitter: import.meta.env.VITE_SOCIAL_TWITTER ?? 'https://twitter.com/tanvotech',
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN ?? 'https://linkedin.com/company/tanvotech',
  },
};

export const BANK_DETAILS = SITE.bankDetails;

/** Single source of truth for primary navigation. */
export const NAV_ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

export const CATEGORIES = [
  'Web Dev',
  'App Dev',
  'AI & Automations',
  'Digital Marketing',
];

/** Workflow states a project moves through, in board order. */
export const STATUSES = [
  {
    id: 'upcoming',
    label: 'Upcoming',
    hint: 'Signed or scoped, not yet started',
    accent: 'amber',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    hint: 'Actively being built',
    accent: 'cyan',
  },
  {
    id: 'completed',
    label: 'Completed',
    hint: 'Shipped and live',
    accent: 'emerald',
  },
];

export const STATUS_IDS = STATUSES.map((s) => s.id);

/** CRM Lead Stages (7-Stage Pipeline from tanvo-web) */
export const LEAD_STATUSES = [
  { id: 'NEW', label: 'New Inquiries', accent: 'blue' },
  { id: 'CONTACTED', label: 'Contacted', accent: 'cyan' },
  { id: 'QUALIFIED', label: 'Qualified', accent: 'slate' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent', accent: 'amber' },
  { id: 'NEGOTIATION', label: 'Negotiation', accent: 'amber' },
  { id: 'WON', label: 'Won / Signed', accent: 'emerald' },
  { id: 'LOST', label: 'Lost / Closed', accent: 'rose' },
];

export const LEAD_STATUS_IDS = LEAD_STATUSES.map((s) => s.id);

/** Lead Budget Bands */
export const BUDGET_BANDS = [
  { id: 'UNDER_3L', label: '< ₹3,00,000 (< $3.6k)', value: 250000 },
  { id: '3L_TO_10L', label: '₹3,00,000 – ₹10,00,000 ($3.6k–$12k)', value: 650000 },
  { id: '10L_TO_25L', label: '₹10,00,000 – ₹25,00,000 ($12k–$30k)', value: 1750000 },
  { id: 'ABOVE_25L', label: '> ₹25,00,000 (> $30k)', value: 3500000 },
  { id: 'NOT_SURE', label: 'Flexible / Not Sure', value: 500000 },
];

/** Currencies Supported */
export const CURRENCIES = [
  { id: 'INR', symbol: '₹', label: 'INR (₹)', fxRateToUSD: 0.012 },
  { id: 'USD', symbol: '$', label: 'USD ($)', fxRateToUSD: 1.0 },
  { id: 'EUR', symbol: '€', label: 'EUR (€)', fxRateToUSD: 1.08 },
  { id: 'AED', symbol: 'د.إ', label: 'AED (د.إ)', fxRateToUSD: 0.27 },
];

export const CURRENCY_IDS = CURRENCIES.map((c) => c.id);

/** Deliverable Approval Statuses */
export const DELIVERABLE_STATUSES = [
  { id: 'pending', label: 'Pending Review', accent: 'amber' },
  { id: 'approved', label: 'Approved & Signed Off', accent: 'emerald' },
  { id: 'needs-revision', label: 'Revisions Requested', accent: 'rose' },
];

export const DELIVERABLE_STATUS_IDS = DELIVERABLE_STATUSES.map((s) => s.id);

/** Invoice Statuses */
export const INVOICE_STATUSES = [
  { id: 'draft', label: 'Draft', accent: 'slate' },
  { id: 'sent', label: 'Issued / Pending', accent: 'amber' },
  { id: 'paid', label: 'Paid in Full', accent: 'emerald' },
  { id: 'overdue', label: 'Overdue', accent: 'rose' },
  { id: 'cancelled', label: 'Cancelled', accent: 'slate' },
];

export const INVOICE_STATUS_IDS = INVOICE_STATUSES.map((s) => s.id);

/** Ticket Categories */
export const TICKET_CATEGORIES = [
  'Scope Addition',
  'Feature Request',
  'Urgent Hotfix',
  'Design Tweak',
  'General Query',
];

/** Ticket Priorities */
export const TICKET_PRIORITIES = [
  { id: 'low', label: 'Low', accent: 'slate' },
  { id: 'medium', label: 'Medium', accent: 'cyan' },
  { id: 'high', label: 'High', accent: 'amber' },
  { id: 'critical', label: 'Critical / Blocker', accent: 'rose' },
];

export const TICKET_PRIORITY_IDS = TICKET_PRIORITIES.map((p) => p.id);

/** Ticket Statuses */
export const TICKET_STATUSES = [
  { id: 'open', label: 'Open / Triage', accent: 'amber' },
  { id: 'in-progress', label: 'In Progress', accent: 'cyan' },
  { id: 'resolved', label: 'Resolved & Shipped', accent: 'emerald' },
  { id: 'closed', label: 'Closed', accent: 'slate' },
];

export const TICKET_STATUS_IDS = TICKET_STATUSES.map((s) => s.id);

/** Visual accent palette tokens */
export const ACCENT_CLASSES = {
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    ring: 'focus-visible:ring-amber-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
    ring: 'focus-visible:ring-cyan-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    ring: 'focus-visible:ring-emerald-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
    ring: 'focus-visible:ring-rose-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
    ring: 'focus-visible:ring-blue-400',
  },
  slate: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    ring: 'focus-visible:ring-slate-400',
  },
};

export const AUTH = {
  salt: import.meta.env.VITE_ADMIN_SALT ?? '',
  hash: import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '',
  sessionDurationMs: 12 * 60 * 60 * 1000, // 12 hours
  maxFailedAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
};

export const STORAGE_KEYS = {
  content: 'tanvo:content:v3',
  adminSession: 'tanvo:admin:session:v2',
  adminLockout: 'tanvo:admin:lockout:v2',
  clientSession: 'tanvo:client:session:v2',
  theme: 'tanvo:theme',
};
