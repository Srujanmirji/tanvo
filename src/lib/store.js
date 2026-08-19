import { useSyncExternalStore } from 'react';
import { seedContent } from '../data/seed';
import {
  STORAGE_KEYS,
  STATUS_IDS,
  LEAD_STATUS_IDS,
  DELIVERABLE_STATUSES,
  INVOICE_STATUSES,
  TICKET_STATUSES,
  CURRENCY_IDS,
} from './constants';

/**
 * Observable store backed by localStorage.
 * Synchronized across browser tabs via useSyncExternalStore.
 */

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

const DELIVERABLE_STATUS_IDS = (DELIVERABLE_STATUSES || []).map((s) => s.id);
const INVOICE_STATUS_IDS = (INVOICE_STATUSES || []).map((s) => s.id);
const TICKET_STATUS_IDS = (TICKET_STATUSES || []).map((s) => s.id);

/** Defensive normalisation */
function normalise(raw) {
  const clients = Array.isArray(raw?.clients) ? raw.clients : (seedContent.clients || []);
  const projects = Array.isArray(raw?.projects) ? raw.projects : (seedContent.projects || []);
  const deliverables = Array.isArray(raw?.deliverables) ? raw.deliverables : (seedContent.deliverables || []);
  const invoices = Array.isArray(raw?.invoices) ? raw.invoices : (seedContent.invoices || []);
  const tickets = Array.isArray(raw?.tickets) ? raw.tickets : (seedContent.tickets || []);
  const documents = Array.isArray(raw?.documents) ? raw.documents : (seedContent.documents || []);
  const achievements = Array.isArray(raw?.achievements) ? raw.achievements : (seedContent.achievements || []);
  const services = Array.isArray(raw?.services) ? raw.services : (seedContent.services || []);
  const leads = Array.isArray(raw?.leads) ? raw.leads : (seedContent.leads || []);
  const quotes = Array.isArray(raw?.quotes) ? raw.quotes : (seedContent.quotes || []);
  const caseStudies = Array.isArray(raw?.caseStudies) ? raw.caseStudies : (seedContent.caseStudies || []);
  const applications = Array.isArray(raw?.applications) ? raw.applications : (seedContent.applications || []);
  const testimonials = Array.isArray(raw?.testimonials) ? raw.testimonials : (seedContent.testimonials || []);
  const updates = Array.isArray(raw?.updates) ? raw.updates : (seedContent.updates || []);
  const dispatchLogs = Array.isArray(raw?.dispatchLogs) ? raw.dispatchLogs : (seedContent.dispatchLogs || []);

  return {
    version: 3,
    services: services
      .filter((s) => s && typeof s.id === 'string')
      .map((s) => ({
        id: s.id,
        name: String(s.name ?? 'Service Offering'),
        slug: String(s.slug ?? 'service-slug'),
        category: String(s.category ?? 'Development'),
        shortDesc: String(s.shortDesc ?? ''),
        longDesc: String(s.longDesc ?? ''),
        deliverables: Array.isArray(s.deliverables) ? s.deliverables.map(String) : [],
        pricingModel: String(s.pricingModel ?? 'FIXED'),
        basePrice: Math.max(0, Number(s.basePrice) || 0),
        currency: CURRENCY_IDS.includes(s.currency) ? s.currency : 'INR',
        basePriceUSD: Math.max(0, Number(s.basePriceUSD) || 0),
        sacCode: String(s.sacCode ?? '998311'),
        taxRatePct: Number(s.taxRatePct) || 18,
        isPublished: Boolean(s.isPublished),
        displayOrder: Number(s.displayOrder) || 1,
        tags: Array.isArray(s.tags) ? s.tags.map(String) : [],
        isSample: Boolean(s.isSample),
      })),
    leads: leads
      .filter((l) => l && typeof l.id === 'string')
      .map((l) => ({
        id: l.id,
        name: String(l.name ?? 'New Prospect'),
        company: String(l.company ?? ''),
        email: String(l.email ?? ''),
        phone: String(l.phone ?? ''),
        serviceInterest: Array.isArray(l.serviceInterest) ? l.serviceInterest.map(String) : [],
        budgetBand: String(l.budgetBand ?? '3L_TO_10L'),
        timeline: String(l.timeline ?? '4-8 weeks'),
        message: String(l.message ?? ''),
        source: String(l.source ?? 'Website Contact Form'),
        status: LEAD_STATUS_IDS.includes(l.status) ? l.status : 'NEW',
        lostReason: l.lostReason ? String(l.lostReason) : null,
        createdAt: String(l.createdAt ?? new Date().toISOString()),
        notes: String(l.notes ?? ''),
        isSample: Boolean(l.isSample),
      })),
    quotes: quotes
      .filter((q) => q && typeof q.id === 'string')
      .map((q) => ({
        id: q.id,
        quoteNumber: String(q.quoteNumber ?? 'TNV-Q-001'),
        leadId: String(q.leadId ?? ''),
        clientName: String(q.clientName ?? ''),
        contactEmail: String(q.contactEmail ?? ''),
        currency: CURRENCY_IDS.includes(q.currency) ? q.currency : 'USD',
        subtotal: Math.max(0, Number(q.subtotal) || 0),
        discountPct: Number(q.discountPct) || 0,
        discountAmount: Number(q.discountAmount) || 0,
        taxRatePct: Number(q.taxRatePct) || 0,
        taxAmount: Number(q.taxAmount) || 0,
        total: Math.max(0, Number(q.total) || 0),
        validUntil: String(q.validUntil ?? ''),
        status: String(q.status ?? 'SENT'),
        notes: String(q.notes ?? ''),
        items: Array.isArray(q.items)
          ? q.items.map((it) => ({
              id: String(it.id ?? uid('qi')),
              description: String(it.description ?? 'Service item'),
              qty: Number(it.qty) || 1,
              rate: Number(it.rate) || 0,
              sacCode: String(it.sacCode ?? '998311'),
              amount: Number(it.amount) || 0,
            }))
          : [],
        isSample: Boolean(q.isSample),
      })),
    caseStudies: caseStudies
      .filter((cs) => cs && typeof cs.id === 'string')
      .map((cs) => ({
        id: cs.id,
        title: String(cs.title ?? 'Case Study'),
        slug: String(cs.slug ?? 'case-study'),
        clientName: String(cs.clientName ?? ''),
        industry: String(cs.industry ?? 'Technology'),
        problem: String(cs.problem ?? ''),
        solution: String(cs.solution ?? ''),
        outcome: String(cs.outcome ?? ''),
        metrics: Array.isArray(cs.metrics)
          ? cs.metrics.map((m) => ({
              label: String(m.label ?? 'Metric'),
              value: String(m.value ?? '100%'),
            }))
          : [],
        testimonial: cs.testimonial
          ? {
              author: String(cs.testimonial.author ?? ''),
              role: String(cs.testimonial.role ?? ''),
              company: String(cs.testimonial.company ?? ''),
              quote: String(cs.testimonial.quote ?? ''),
            }
          : null,
        stack: Array.isArray(cs.stack) ? cs.stack.map(String) : [],
        featured: Boolean(cs.featured),
        isPublished: Boolean(cs.isPublished),
        isSample: Boolean(cs.isSample),
      })),
    applications: applications
      .filter((app) => app && typeof app.id === 'string')
      .map((app) => ({
        id: app.id,
        candidateName: String(app.candidateName ?? 'Candidate'),
        email: String(app.email ?? ''),
        role: String(app.role ?? 'Engineer'),
        experience: String(app.experience ?? ''),
        githubUrl: String(app.githubUrl ?? ''),
        status: String(app.status ?? 'NEW'),
        appliedAt: String(app.appliedAt ?? new Date().toISOString()),
        notes: String(app.notes ?? ''),
        isSample: Boolean(app.isSample),
      })),
    testimonials: testimonials
      .filter((t) => t && typeof t.id === 'string')
      .map((t) => ({
        id: t.id,
        author: String(t.author ?? 'Client Leader'),
        company: String(t.company ?? ''),
        quote: String(t.quote ?? ''),
        status: String(t.status ?? 'APPROVED'),
        isSample: Boolean(t.isSample),
      })),
    updates: updates
      .filter((u) => u && typeof u.id === 'string')
      .map((u) => ({
        id: u.id,
        projectId: String(u.projectId ?? ''),
        clientId: String(u.clientId ?? ''),
        title: String(u.title ?? 'Sprint Update'),
        category: String(u.category ?? 'Update'),
        author: String(u.author ?? 'Tanvo Engineering'),
        date: String(u.date ?? new Date().toISOString().slice(0, 10)),
        content: String(u.content ?? ''),
        isSample: Boolean(u.isSample),
      })),
    clients: clients
      .filter((c) => c && typeof c.id === 'string')
      .map((c) => ({
        id: c.id,
        name: String(c.name ?? 'New Client'),
        company: String(c.company ?? ''),
        email: String(c.email ?? ''),
        phone: String(c.phone ?? ''),
        accessCode: String(c.accessCode ?? '').toUpperCase(),
        avatar: String(c.avatar ?? ''),
        joinedDate: String(c.joinedDate ?? new Date().toISOString().slice(0, 10)),
        portalNotes: String(c.portalNotes ?? ''),
        isSample: Boolean(c.isSample),
      })),
    projects: projects
      .filter((p) => p && typeof p.id === 'string')
      .map((p) => ({
        id: p.id,
        clientId: String(p.clientId ?? ''),
        title: String(p.title ?? 'Untitled project'),
        client: String(p.client ?? ''),
        category: String(p.category ?? 'Web Dev'),
        status: STATUS_IDS.includes(p.status) ? p.status : 'upcoming',
        desc: String(p.desc ?? ''),
        image: String(p.image ?? ''),
        link: String(p.link ?? ''),
        tech: Array.isArray(p.tech) ? p.tech.map(String) : [],
        progress: clamp(Number(p.progress) || 0, 0, 100),
        startDate: String(p.startDate ?? ''),
        targetDate: String(p.targetDate ?? ''),
        featured: Boolean(p.featured),
        isSample: Boolean(p.isSample),
        milestones: Array.isArray(p.milestones)
          ? p.milestones.map((m) => ({
              id: String(m.id ?? uid('m')),
              title: String(m.title ?? 'Milestone'),
              dueDate: String(m.dueDate ?? ''),
              status: STATUS_IDS.includes(m.status) ? m.status : 'upcoming',
            }))
          : [],
      })),
    deliverables: deliverables
      .filter((d) => d && typeof d.id === 'string')
      .map((d) => ({
        id: d.id,
        clientId: String(d.clientId ?? ''),
        projectId: String(d.projectId ?? ''),
        title: String(d.title ?? 'Untitled Deliverable'),
        type: String(d.type ?? 'Document'),
        url: String(d.url ?? ''),
        version: String(d.version ?? 'v1.0'),
        uploadedDate: String(d.uploadedDate ?? new Date().toISOString().slice(0, 10)),
        status: DELIVERABLE_STATUS_IDS.includes(d.status) ? d.status : 'pending',
        feedback: String(d.feedback ?? ''),
        description: String(d.description ?? ''),
        isSample: Boolean(d.isSample),
      })),
    invoices: invoices
      .filter((inv) => inv && typeof inv.id === 'string')
      .map((inv) => ({
        id: inv.id,
        invoiceNumber: String(inv.invoiceNumber ?? 'TNV/2026/001'),
        clientId: String(inv.clientId ?? ''),
        projectId: String(inv.projectId ?? ''),
        title: String(inv.title ?? 'Milestone Payment'),
        amount: Math.max(0, Number(inv.amount) || 0),
        currency: CURRENCY_IDS.includes(inv.currency) ? inv.currency : 'USD',
        subtotal: Math.max(0, Number(inv.subtotal) || Number(inv.amount) || 0),
        taxRatePct: Number(inv.taxRatePct) || 0,
        taxAmount: Number(inv.taxAmount) || 0,
        status: INVOICE_STATUS_IDS.includes(inv.status) ? inv.status : 'pending',
        issuedDate: String(inv.issuedDate ?? new Date().toISOString().slice(0, 10)),
        dueDate: String(inv.dueDate ?? ''),
        paidDate: String(inv.paidDate ?? ''),
        sacCode: String(inv.sacCode ?? '998311'),
        notes: String(inv.notes ?? ''),
        items: Array.isArray(inv.items)
          ? inv.items.map((item) => ({
              id: String(item.id ?? uid('item')),
              description: String(item.description ?? 'Service item'),
              qty: Number(item.qty) || 1,
              rate: Number(item.rate) || 0,
              sacCode: String(item.sacCode ?? '998311'),
              amount: Number(item.amount) || 0,
            }))
          : [],
        isSample: Boolean(inv.isSample),
      })),
    tickets: tickets
      .filter((t) => t && typeof t.id === 'string')
      .map((t) => ({
        id: t.id,
        clientId: String(t.clientId ?? ''),
        projectId: String(t.projectId ?? ''),
        title: String(t.title ?? 'Support Request'),
        category: String(t.category ?? 'Scope Addition'),
        priority: String(t.priority ?? 'medium'),
        status: TICKET_STATUS_IDS.includes(t.status) ? t.status : 'open',
        createdAt: String(t.createdAt ?? new Date().toISOString()),
        description: String(t.description ?? ''),
        replies: Array.isArray(t.replies)
          ? t.replies.map((r) => ({
              id: String(r.id ?? uid('r')),
              sender: String(r.sender ?? 'client'),
              senderName: String(r.senderName ?? 'User'),
              message: String(r.message ?? ''),
              timestamp: String(r.timestamp ?? new Date().toISOString()),
            }))
          : [],
        isSample: Boolean(t.isSample),
      })),
    documents: documents
      .filter((doc) => doc && typeof doc.id === 'string')
      .map((doc) => ({
        id: doc.id,
        clientId: String(doc.clientId ?? ''),
        projectId: String(doc.projectId ?? ''),
        title: String(doc.title ?? 'Document'),
        category: String(doc.category ?? 'General'),
        url: String(doc.url ?? ''),
        size: String(doc.size ?? 'Link'),
        date: String(doc.date ?? new Date().toISOString().slice(0, 10)),
        isSample: Boolean(doc.isSample),
      })),
    achievements: achievements
      .filter((a) => a && typeof a.id === 'string')
      .map((a) => ({
        id: a.id,
        title: String(a.title ?? 'Untitled achievement'),
        detail: String(a.detail ?? ''),
        metric: String(a.metric ?? ''),
        metricLabel: String(a.metricLabel ?? ''),
        date: String(a.date ?? ''),
        isSample: Boolean(a.isSample),
      })),
    dispatchLogs: dispatchLogs
      .filter((dl) => dl && typeof dl.id === 'string')
      .map((dl) => ({
        id: dl.id,
        clientId: String(dl.clientId ?? ''),
        clientName: String(dl.clientName ?? ''),
        recipientEmail: String(dl.recipientEmail ?? ''),
        recipientPhone: String(dl.recipientPhone ?? ''),
        channel: String(dl.channel ?? 'WHATSAPP'),
        templateType: String(dl.templateType ?? 'CUSTOM'),
        subject: String(dl.subject ?? 'Update from Tanvo Tech'),
        body: String(dl.body ?? ''),
        sentAt: String(dl.sentAt ?? new Date().toISOString()),
        status: String(dl.status ?? 'DELIVERED'),
        isSample: Boolean(dl.isSample),
      })),
  };
}

function load() {
  if (!isBrowser()) return normalise(seedContent);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.content);
    if (!raw) return normalise(seedContent);
    return normalise(JSON.parse(raw));
  } catch {
    return normalise(seedContent);
  }
}

const listeners = new Set();
let state = load();

function persist(next) {
  state = next;
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(next));
    } catch {
      // Storage error
    }
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return state;
}

if (isBrowser()) {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.content) {
      state = load();
      listeners.forEach((fn) => fn());
    }
  });
}

/** Subscribe hook */
export function useContent() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getContent() {
  return state;
}

export function uid(prefix = 'id') {
  const rand =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

/* ---------------------------------------------------------------
   CRM Leads Mutations
   --------------------------------------------------------------- */
export const emptyLead = () => ({
  id: uid('lead'),
  name: '',
  company: '',
  email: '',
  phone: '',
  serviceInterest: ['web-development'],
  budgetBand: '3L_TO_10L',
  timeline: '4-8 weeks',
  message: '',
  source: 'Admin Manual Entry',
  status: 'NEW',
  lostReason: null,
  createdAt: new Date().toISOString(),
  notes: '',
  isSample: false,
});

export function saveLead(lead) {
  const exists = state.leads.some((l) => l.id === lead.id);
  const leads = exists
    ? state.leads.map((l) => (l.id === lead.id ? lead : l))
    : [lead, ...state.leads];
  persist(normalise({ ...state, leads }));
}

export function setLeadStatus(id, status, lostReason = null) {
  const leads = state.leads.map((l) =>
    l.id === id ? { ...l, status, lostReason: status === 'LOST' ? lostReason : l.lostReason } : l,
  );
  persist(normalise({ ...state, leads }));
}

export function deleteLead(id) {
  persist(normalise({ ...state, leads: state.leads.filter((l) => l.id !== id) }));
}

export function convertLeadToClient(leadId) {
  const lead = state.leads.find((l) => l.id === leadId);
  if (!lead) return null;

  const newClient = {
    id: uid('c'),
    name: lead.name,
    company: lead.company || lead.name,
    email: lead.email,
    phone: lead.phone || '',
    accessCode: `${(lead.company || lead.name).slice(0, 4).toUpperCase()}-${new Date().getFullYear()}`,
    avatar: '',
    joinedDate: new Date().toISOString().slice(0, 10),
    portalNotes: `Converted from lead (${lead.source}). Timeline: ${lead.timeline}. Budget: ${lead.budgetBand}.`,
    isSample: false,
  };

  const newProject = {
    id: uid('p'),
    clientId: newClient.id,
    title: `${newClient.company} Digital Platform`,
    client: newClient.company,
    category: 'Web Dev',
    status: 'in-progress',
    desc: lead.message || 'Engaged digital engineering project.',
    image: '/images/dashboard.jpg',
    link: '',
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    progress: 15,
    startDate: new Date().toISOString().slice(0, 10),
    targetDate: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
    featured: false,
    isSample: false,
    milestones: [
      { id: uid('m'), title: 'Sprint 1: Architecture & Wireframes', dueDate: 'In 2 weeks', status: 'in-progress' },
      { id: uid('m'), title: 'Sprint 2: Core Engineering & Staging', dueDate: 'In 5 weeks', status: 'upcoming' },
      { id: uid('m'), title: 'Sprint 3: Production Deployment', dueDate: 'In 8 weeks', status: 'upcoming' },
    ],
  };

  const leads = state.leads.map((l) => (l.id === leadId ? { ...l, status: 'WON' } : l));
  const clients = [newClient, ...state.clients];
  const projects = [newProject, ...state.projects];

  persist(normalise({ ...state, leads, clients, projects }));
  return { client: newClient, project: newProject };
}

/* ---------------------------------------------------------------
   Quotes Mutations
   --------------------------------------------------------------- */
export const emptyQuote = () => ({
  id: uid('q'),
  quoteNumber: `TNV-Q-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
  leadId: '',
  clientName: '',
  contactEmail: '',
  currency: 'USD',
  subtotal: 5000,
  discountPct: 0,
  discountAmount: 0,
  taxRatePct: 18,
  taxAmount: 900,
  total: 5900,
  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  status: 'SENT',
  notes: 'Fixed-deliverable scope. Includes 100% intellectual property ownership.',
  items: [],
  isSample: false,
});

export function saveQuote(quote) {
  const exists = state.quotes.some((q) => q.id === quote.id);
  const quotes = exists
    ? state.quotes.map((q) => (q.id === quote.id ? quote : q))
    : [quote, ...state.quotes];
  persist(normalise({ ...state, quotes }));
}

export function deleteQuote(id) {
  persist(normalise({ ...state, quotes: state.quotes.filter((q) => q.id !== id) }));
}

/* ---------------------------------------------------------------
   Services Catalog Mutations
   --------------------------------------------------------------- */
export const emptyService = () => ({
  id: uid('srv'),
  name: '',
  slug: '',
  category: 'Development',
  shortDesc: '',
  longDesc: '',
  deliverables: ['Production Frontend', 'Backend API', 'Database Setup'],
  pricingModel: 'FIXED',
  basePrice: 500000,
  currency: 'INR',
  basePriceUSD: 6000,
  sacCode: '998311',
  taxRatePct: 18,
  isPublished: true,
  displayOrder: state.services.length + 1,
  tags: ['Next.js', 'React', 'Node.js'],
  isSample: false,
});

export function saveService(service) {
  const exists = state.services.some((s) => s.id === service.id);
  const services = exists
    ? state.services.map((s) => (s.id === service.id ? service : s))
    : [service, ...state.services];
  persist(normalise({ ...state, services }));
}

export function toggleServicePublish(id) {
  const services = state.services.map((s) =>
    s.id === id ? { ...s, isPublished: !s.isPublished } : s,
  );
  persist(normalise({ ...state, services }));
}

export function deleteService(id) {
  persist(normalise({ ...state, services: state.services.filter((s) => s.id !== id) }));
}

/* ---------------------------------------------------------------
   Case Studies CMS Mutations
   --------------------------------------------------------------- */
export const emptyCaseStudy = () => ({
  id: uid('cs'),
  title: '',
  slug: '',
  clientName: '',
  industry: 'Technology',
  problem: '',
  solution: '',
  outcome: '',
  metrics: [
    { label: 'Latency Reduction', value: '85%' },
    { label: 'Error Rate', value: '0.01%' },
  ],
  testimonial: {
    author: '',
    role: '',
    company: '',
    quote: '',
  },
  stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
  featured: false,
  isPublished: true,
  isSample: false,
});

export function saveCaseStudy(cs) {
  const exists = state.caseStudies.some((c) => c.id === cs.id);
  const caseStudies = exists
    ? state.caseStudies.map((c) => (c.id === cs.id ? cs : c))
    : [cs, ...state.caseStudies];
  persist(normalise({ ...state, caseStudies }));
}

export function deleteCaseStudy(id) {
  persist(normalise({ ...state, caseStudies: state.caseStudies.filter((c) => c.id !== id) }));
}

/* ---------------------------------------------------------------
   Applications & Testimonials Mutations
   --------------------------------------------------------------- */
export function setApplicationStatus(id, status) {
  const applications = state.applications.map((a) => (a.id === id ? { ...a, status } : a));
  persist(normalise({ ...state, applications }));
}

export function deleteApplication(id) {
  persist(normalise({ ...state, applications: state.applications.filter((a) => a.id !== id) }));
}

export function saveTestimonial(t) {
  const exists = state.testimonials.some((item) => item.id === t.id);
  const testimonials = exists
    ? state.testimonials.map((item) => (item.id === t.id ? t : item))
    : [t, ...state.testimonials];
  persist(normalise({ ...state, testimonials }));
}

export function deleteTestimonial(id) {
  persist(normalise({ ...state, testimonials: state.testimonials.filter((t) => t.id !== id) }));
}

/* ---------------------------------------------------------------
   Sprint Updates Mutations
   --------------------------------------------------------------- */
export const emptyUpdate = () => ({
  id: uid('up'),
  projectId: '',
  clientId: '',
  title: '',
  category: 'Update',
  author: 'Tanvo Engineering',
  date: new Date().toISOString().slice(0, 10),
  content: '',
  isSample: false,
});

export function saveUpdate(u) {
  const exists = state.updates.some((item) => item.id === u.id);
  const updates = exists
    ? state.updates.map((item) => (item.id === u.id ? u : item))
    : [u, ...state.updates];
  persist(normalise({ ...state, updates }));
}

export function deleteUpdate(id) {
  persist(normalise({ ...state, updates: state.updates.filter((u) => u.id !== id) }));
}

/* ---------------------------------------------------------------
   Client Mutations
   --------------------------------------------------------------- */
export const emptyClient = () => ({
  id: uid('c'),
  name: '',
  company: '',
  email: '',
  phone: '',
  accessCode: `CLIENT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
  avatar: '',
  joinedDate: new Date().toISOString().slice(0, 10),
  portalNotes: '',
  isSample: false,
});

export function saveClient(client) {
  const exists = state.clients.some((c) => c.id === client.id);
  const clients = exists
    ? state.clients.map((c) => (c.id === client.id ? client : c))
    : [client, ...state.clients];
  persist(normalise({ ...state, clients }));
}

export function deleteClient(id) {
  persist(
    normalise({
      ...state,
      clients: state.clients.filter((c) => c.id !== id),
    }),
  );
}

/* ---------------------------------------------------------------
   Project Mutations
   --------------------------------------------------------------- */
export const emptyProject = () => ({
  id: uid('p'),
  clientId: '',
  title: '',
  client: '',
  category: 'Web Dev',
  status: 'upcoming',
  desc: '',
  image: '',
  link: '',
  tech: [],
  progress: 0,
  startDate: '',
  targetDate: '',
  featured: false,
  isSample: false,
  milestones: [],
});

export function saveProject(project) {
  const exists = state.projects.some((p) => p.id === project.id);
  const projects = exists
    ? state.projects.map((p) => (p.id === project.id ? project : p))
    : [project, ...state.projects];
  persist(normalise({ ...state, projects }));
}

export function deleteProject(id) {
  persist(normalise({ ...state, projects: state.projects.filter((p) => p.id !== id) }));
}

export function setProjectStatus(id, status) {
  const projects = state.projects.map((p) =>
    p.id === id
      ? { ...p, status, progress: status === 'completed' ? 100 : p.progress }
      : p,
  );
  persist(normalise({ ...state, projects }));
}

/* ---------------------------------------------------------------
   Deliverable Mutations
   --------------------------------------------------------------- */
export const emptyDeliverable = () => ({
  id: uid('del'),
  clientId: '',
  projectId: '',
  title: '',
  type: 'Figma / Design',
  url: '',
  version: 'v1.0',
  uploadedDate: new Date().toISOString().slice(0, 10),
  status: 'pending',
  feedback: '',
  description: '',
  isSample: false,
});

export function saveDeliverable(deliverable) {
  const exists = state.deliverables.some((d) => d.id === deliverable.id);
  const deliverables = exists
    ? state.deliverables.map((d) => (d.id === deliverable.id ? deliverable : d))
    : [deliverable, ...state.deliverables];
  persist(normalise({ ...state, deliverables }));
}

export function updateDeliverableStatus(id, status, feedback = '') {
  const deliverables = state.deliverables.map((d) =>
    d.id === id ? { ...d, status, feedback: feedback || d.feedback } : d,
  );
  persist(normalise({ ...state, deliverables }));
}

export function deleteDeliverable(id) {
  persist(
    normalise({
      ...state,
      deliverables: state.deliverables.filter((d) => d.id !== id),
    }),
  );
}

/* ---------------------------------------------------------------
   Invoice Mutations
   --------------------------------------------------------------- */
export const emptyInvoice = () => ({
  id: uid('inv'),
  invoiceNumber: `TNV/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
  clientId: '',
  projectId: '',
  title: '',
  amount: 5000,
  currency: 'USD',
  subtotal: 5000,
  taxRatePct: 0,
  taxAmount: 0,
  status: 'pending',
  issuedDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  paidDate: '',
  sacCode: '998311',
  notes: '',
  items: [
    { id: uid('item'), description: 'Milestone delivery scope', qty: 1, rate: 5000, sacCode: '998311', amount: 5000 },
  ],
  isSample: false,
});

export function saveInvoice(invoice) {
  const exists = state.invoices.some((i) => i.id === invoice.id);
  const invoices = exists
    ? state.invoices.map((i) => (i.id === invoice.id ? invoice : i))
    : [invoice, ...state.invoices];
  persist(normalise({ ...state, invoices }));
}

export function markInvoicePaid(id) {
  const invoices = state.invoices.map((inv) =>
    inv.id === id
      ? {
          ...inv,
          status: 'paid',
          paidDate: new Date().toISOString().slice(0, 10),
        }
      : inv,
  );
  persist(normalise({ ...state, invoices }));
}

export function deleteInvoice(id) {
  persist(normalise({ ...state, invoices: state.invoices.filter((i) => i.id !== id) }));
}

/* ---------------------------------------------------------------
   Support Ticket & Request Mutations
   --------------------------------------------------------------- */
export const emptyTicket = () => ({
  id: uid('t'),
  clientId: '',
  projectId: '',
  title: '',
  category: 'Scope Addition',
  priority: 'medium',
  status: 'open',
  createdAt: new Date().toISOString(),
  description: '',
  replies: [],
  isSample: false,
});

export function saveTicket(ticket) {
  const exists = state.tickets.some((t) => t.id === ticket.id);
  const tickets = exists
    ? state.tickets.map((t) => (t.id === ticket.id ? ticket : t))
    : [ticket, ...state.tickets];
  persist(normalise({ ...state, tickets }));
}

export function updateTicketStatus(id, status) {
  const tickets = state.tickets.map((t) => (t.id === id ? { ...t, status } : t));
  persist(normalise({ ...state, tickets }));
}

export function addTicketReply(ticketId, reply) {
  const newReply = {
    id: uid('r'),
    sender: reply.sender || 'client',
    senderName: reply.senderName || 'User',
    message: reply.message || '',
    timestamp: new Date().toISOString(),
  };
  const tickets = state.tickets.map((t) =>
    t.id === ticketId
      ? { ...t, replies: [...(t.replies || []), newReply] }
      : t,
  );
  persist(normalise({ ...state, tickets }));
}

export function deleteTicket(id) {
  persist(normalise({ ...state, tickets: state.tickets.filter((t) => t.id !== id) }));
}

/* ---------------------------------------------------------------
   Document Mutations
   --------------------------------------------------------------- */
export const emptyDocument = () => ({
  id: uid('doc'),
  clientId: '',
  projectId: '',
  title: '',
  category: 'General',
  url: '',
  size: 'Link',
  date: new Date().toISOString().slice(0, 10),
  isSample: false,
});

export function saveDocument(doc) {
  const exists = state.documents.some((d) => d.id === doc.id);
  const documents = exists
    ? state.documents.map((d) => (d.id === doc.id ? doc : d))
    : [doc, ...state.documents];
  persist(normalise({ ...state, documents }));
}

export function deleteDocument(id) {
  persist(normalise({ ...state, documents: state.documents.filter((d) => d.id !== id) }));
}

/* ---------------------------------------------------------------
   Achievement Mutations
   --------------------------------------------------------------- */
export const emptyAchievement = () => ({
  id: uid('a'),
  title: '',
  detail: '',
  metric: '',
  metricLabel: '',
  date: new Date().toISOString().slice(0, 10),
  isSample: false,
});

export function saveAchievement(achievement) {
  const exists = state.achievements.some((a) => a.id === achievement.id);
  const achievements = exists
    ? state.achievements.map((a) => (a.id === achievement.id ? achievement : a))
    : [achievement, ...state.achievements];
  persist(normalise({ ...state, achievements }));
}

export function deleteAchievement(id) {
  persist(
    normalise({ ...state, achievements: state.achievements.filter((a) => a.id !== id) }),
  );
}

/* ---------------------------------------------------------------
   Client Dispatch / Communications Mutations
   --------------------------------------------------------------- */
export const emptyDispatchLog = () => ({
  id: uid('dl'),
  clientId: '',
  clientName: '',
  recipientEmail: '',
  recipientPhone: '',
  channel: 'WHATSAPP',
  templateType: 'CUSTOM',
  subject: '',
  body: '',
  sentAt: new Date().toISOString(),
  status: 'DELIVERED',
  isSample: false,
});

export function saveDispatchLog(log) {
  const exists = state.dispatchLogs.some((dl) => dl.id === log.id);
  const dispatchLogs = exists
    ? state.dispatchLogs.map((dl) => (dl.id === log.id ? log : dl))
    : [log, ...state.dispatchLogs];
  persist(normalise({ ...state, dispatchLogs }));
}

export function deleteDispatchLog(id) {
  persist(
    normalise({ ...state, dispatchLogs: state.dispatchLogs.filter((dl) => dl.id !== id) }),
  );
}

/* ---------------------------------------------------------------
   Bulk Data & Seed Reset
   --------------------------------------------------------------- */
export function purgeSamples() {
  persist(
    normalise({
      version: 3,
      services: state.services.filter((s) => !s.isSample),
      leads: state.leads.filter((l) => !l.isSample),
      quotes: state.quotes.filter((q) => !q.isSample),
      caseStudies: state.caseStudies.filter((cs) => !cs.isSample),
      applications: state.applications.filter((a) => !a.isSample),
      testimonials: state.testimonials.filter((t) => !t.isSample),
      updates: state.updates.filter((u) => !u.isSample),
      clients: state.clients.filter((c) => !c.isSample),
      projects: state.projects.filter((p) => !p.isSample),
      deliverables: state.deliverables.filter((d) => !d.isSample),
      invoices: state.invoices.filter((i) => !i.isSample),
      tickets: state.tickets.filter((t) => !t.isSample),
      documents: state.documents.filter((doc) => !doc.isSample),
      achievements: state.achievements.filter((a) => !a.isSample),
      dispatchLogs: state.dispatchLogs.filter((dl) => !dl.isSample),
    }),
  );
}

export function resetToSeed() {
  persist(normalise(seedContent));
}

export function exportJson() {
  return JSON.stringify(state, null, 2);
}

export function importJson(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, error: 'File is not a JSON object.' };
    }
    persist(normalise(parsed));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON.' };
  }
}
