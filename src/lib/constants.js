/** Canonical site metadata. Update SITE_URL before deploying. */
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://tanvo.tech';

export const SITE = {
  name: 'Tanvo Tech',
  tagline: 'Web, App, AI & Digital Solutions Agency',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? 'hello@tanvo.tech',
  phone: import.meta.env.VITE_CONTACT_PHONE ?? '',
  location: import.meta.env.VITE_CONTACT_LOCATION ?? '',
  socials: {
    github: import.meta.env.VITE_SOCIAL_GITHUB ?? '',
    twitter: import.meta.env.VITE_SOCIAL_TWITTER ?? '',
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN ?? '',
  },
};

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

/** Tailwind class sets per accent, resolved statically so the
 *  JIT compiler can see every class it needs to generate. */
export const ACCENT_CLASSES = {
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    bar: 'bg-amber-400',
  },
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    dot: 'bg-cyan-400',
    bar: 'bg-cyan-400',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    bar: 'bg-emerald-400',
  },
};

export const STORAGE_KEYS = {
  content: 'tanvo:content:v1',
  session: 'tanvo:admin-session:v1',
  attempts: 'tanvo:admin-attempts:v1',
};

/** Admin session lifetime and brute-force throttling. */
export const AUTH = {
  sessionTtlMs: 8 * 60 * 60 * 1000, // 8 hours
  maxAttempts: 5,
  lockoutMs: 15 * 60 * 1000, // 15 minutes
};
