/**
 * SEED CONTENT
 *
 * This is placeholder data so the site renders before real content
 * exists. Everything flagged `isSample: true` should be deleted or
 * replaced in the admin panel (/admin) before you go live —
 * publishing invented case studies as real client work is a
 * credibility and legal risk.
 *
 * Workflow: edit in /admin → Export JSON → replace this file's
 * `projects` / `achievements` arrays → commit → redeploy.
 */

export const seedProjects = [
  {
    id: 'p-novatech',
    title: 'NovaTech Analytics Dashboard',
    client: 'NovaTech (sample)',
    category: 'Web Dev',
    status: 'completed',
    desc: 'A MERN analytics portal with responsive charting, multi-tenant data isolation, and server-side state synchronisation across concurrent editors.',
    image: '/images/dashboard.jpg',
    link: '',
    tech: ['React', 'Node.js', 'MongoDB', 'WebSockets'],
    progress: 100,
    startDate: '2025-09-01',
    targetDate: '2026-01-20',
    featured: true,
    isSample: true,
  },
  {
    id: 'p-aura',
    title: 'Aura Mobile Wallet',
    client: 'Aura Fintech (sample)',
    category: 'App Dev',
    status: 'completed',
    desc: 'A cross-platform wallet built in React Native with biometric authentication, offline-first transaction queueing, and hardware-backed key storage.',
    image: '/images/mobile.jpg',
    link: '',
    tech: ['React Native', 'Expo', 'Biometrics', 'SQLite'],
    progress: 100,
    startDate: '2025-06-10',
    targetDate: '2025-11-30',
    featured: true,
    isSample: true,
  },
  {
    id: 'p-neuralflow',
    title: 'NeuralFlow Support Engine',
    client: 'NeuralFlow (sample)',
    category: 'AI & Automations',
    status: 'in-progress',
    desc: 'A retrieval-augmented pipeline that ingests unstructured corporate documentation and resolves tier-one support tickets without human handoff.',
    image: '/images/ai.jpg',
    link: '',
    tech: ['Claude API', 'pgvector', 'Python', 'FastAPI'],
    progress: 68,
    startDate: '2026-02-02',
    targetDate: '2026-09-15',
    featured: true,
    isSample: true,
  },
  {
    id: 'p-centra',
    title: 'Centra Cloud ERP',
    client: 'Centra Group (sample)',
    category: 'Web Dev',
    status: 'in-progress',
    desc: 'Enterprise resource planning with database partitioning, real-time inventory reconciliation, and an auditable double-entry financial ledger.',
    image: '/images/dashboard.jpg',
    link: '',
    tech: ['Next.js', 'PostgreSQL', 'Redis', 'AWS'],
    progress: 41,
    startDate: '2026-04-01',
    targetDate: '2026-12-01',
    featured: false,
    isSample: true,
  },
  {
    id: 'p-velo',
    title: 'Velo Realtime Messaging',
    client: 'Velo (sample)',
    category: 'App Dev',
    status: 'upcoming',
    desc: 'Low-latency messaging with end-to-end encryption, presence tracking, and delivery guarantees over an intermittent mobile connection.',
    image: '/images/mobile.jpg',
    link: '',
    tech: ['React Native', 'WebRTC', 'Signal Protocol'],
    progress: 0,
    startDate: '2026-09-01',
    targetDate: '2027-03-01',
    featured: false,
    isSample: true,
  },
  {
    id: 'p-automata',
    title: 'Automata Sync',
    client: 'Automata (sample)',
    category: 'AI & Automations',
    status: 'upcoming',
    desc: 'A workflow bridge connecting disparate CRMs, scheduling recurring extraction jobs, and triggering notification chains on threshold events.',
    image: '/images/ai.jpg',
    link: '',
    tech: ['Node.js', 'Temporal', 'Webhooks', 'Zapier'],
    progress: 0,
    startDate: '2026-10-15',
    targetDate: '2027-02-28',
    featured: false,
    isSample: true,
  },
];

export const seedAchievements = [
  {
    id: 'a-uptime',
    title: 'Zero-downtime migration',
    detail:
      'Moved a production ERP handling 40k daily transactions from legacy hosting to AWS with no scheduled outage window.',
    metric: '0',
    metricLabel: 'minutes downtime',
    date: '2026-01-18',
    isSample: true,
  },
  {
    id: 'a-lighthouse',
    title: 'Perfect Lighthouse performance',
    detail:
      'Rebuilt a client storefront front-end, cutting Largest Contentful Paint from 4.8s to 0.9s on throttled 4G.',
    metric: '100',
    metricLabel: 'Lighthouse score',
    date: '2025-11-04',
    isSample: true,
  },
  {
    id: 'a-support',
    title: 'Support load reduced',
    detail:
      'An AI triage layer now resolves the majority of tier-one tickets end to end, freeing the human team for escalations.',
    metric: '73%',
    metricLabel: 'tickets auto-resolved',
    date: '2026-05-22',
    isSample: true,
  },
  {
    id: 'a-delivery',
    title: 'On-time delivery streak',
    detail:
      'Consecutive client engagements delivered on or ahead of the contracted milestone date.',
    metric: '24',
    metricLabel: 'projects on schedule',
    date: '2026-07-01',
    isSample: true,
  },
];

export const seedContent = {
  version: 1,
  projects: seedProjects,
  achievements: seedAchievements,
};
