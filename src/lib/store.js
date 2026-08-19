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

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const DELIVERABLE_STATUS_IDS = (DELIVERABLE_STATUSES || []).map((s) => s.id);
const INVOICE_STATUS_IDS = (INVOICE_STATUSES || []).map((s) => s.id);
const TICKET_STATUS_IDS = (TICKET_STATUSES || []).map((s) => s.id);

/** Financial Year Series Generator (e.g. TNV/25-26/0001) */
export function generateNextInvoiceNumber(existingInvoices = []) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();
  
  // Indian Fiscal Year starts in April (Month 4)
  let startYear = currentYear;
  let endYear = currentYear + 1;
  if (currentMonth < 4) {
    startYear = currentYear - 1;
    endYear = currentYear;
  }
  
  const fyPrefix = `TNV/${String(startYear).slice(-2)}-${String(endYear).slice(-2)}/`;
  
  // Find highest existing sequence in current FY
  let highestSeq = 0;
  existingInvoices.forEach((inv) => {
    const num = inv.invoiceNumber || '';
    if (num.startsWith(fyPrefix)) {
      const seqPart = parseInt(num.slice(fyPrefix.length), 10);
      if (!isNaN(seqPart) && seqPart > highestSeq) {
        highestSeq = seqPart;
      }
    }
  });
  
  const nextSeq = String(highestSeq + 1).padStart(4, '0');
  return `${fyPrefix}${nextSeq}`;
}

/** Defensive normalisation */
function normalise(raw) {
  const clients = Array.isArray(raw?.clients) ? raw.clients : (seedContent.clients || []);
  const projects = Array.isArray(raw?.projects) ? raw.projects : (seedContent.projects || []);
  const deliverables = Array.isArray(raw?.deliverables) ? raw.deliverables : (seedContent.deliverables || []);
  const invoices = Array.isArray(raw?.invoices) ? raw.invoices : (seedContent.invoices || []);
  const creditNotes = Array.isArray(raw?.creditNotes) ? raw.creditNotes : (seedContent.creditNotes || []);
  const recurringProfiles = Array.isArray(raw?.recurringProfiles) ? raw.recurringProfiles : (seedContent.recurringProfiles || []);
  const conversations = Array.isArray(raw?.conversations) ? raw.conversations : (seedContent.conversations || []);
  const messages = Array.isArray(raw?.messages) ? raw.messages : (seedContent.messages || []);
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
      .map((inv) => {
        const totalAmount = Math.max(0, Number(inv.amount) || 0);
        const paidAmount = Math.max(0, Number(inv.paidAmount) || (inv.status === 'paid' ? totalAmount : 0));
        const balanceDue = Math.max(0, totalAmount - paidAmount);
        const isLocked = Boolean(inv.locked || inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'partially_paid' || inv.status === 'paid');

        return {
          id: inv.id,
          invoiceNumber: String(inv.invoiceNumber ?? 'TNV/25-26/0001'),
          clientId: String(inv.clientId ?? ''),
          projectId: String(inv.projectId ?? ''),
          title: String(inv.title ?? 'Milestone Payment'),
          amount: totalAmount,
          currency: CURRENCY_IDS.includes(inv.currency) ? inv.currency : 'INR',
          subtotal: Math.max(0, Number(inv.subtotal) || totalAmount),
          taxRatePct: Number(inv.taxRatePct) || 0,
          taxAmount: Number(inv.taxAmount) || 0,
          paidAmount,
          balanceDue,
          status: INVOICE_STATUS_IDS.includes(inv.status) ? inv.status : 'draft',
          locked: isLocked,
          issuedDate: String(inv.issuedDate ?? new Date().toISOString().slice(0, 10)),
          dueDate: String(inv.dueDate ?? ''),
          paidDate: String(inv.paidDate ?? ''),
          viewedAt: String(inv.viewedAt ?? ''),
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
          payments: Array.isArray(inv.payments)
            ? inv.payments.map((p) => ({
                id: String(p.id ?? uid('pay')),
                amount: Number(p.amount) || 0,
                currency: String(p.currency ?? inv.currency ?? 'INR'),
                paymentMode: String(p.paymentMode ?? 'UPI'),
                referenceId: String(p.referenceId ?? ''),
                paymentDate: String(p.paymentDate ?? new Date().toISOString().slice(0, 10)),
                notes: String(p.notes ?? ''),
              }))
            : [],
          creditNoteIds: Array.isArray(inv.creditNoteIds) ? inv.creditNoteIds.map(String) : [],
          isSample: Boolean(inv.isSample),
        };
      }),
    creditNotes: creditNotes
      .filter((cn) => cn && typeof cn.id === 'string')
      .map((cn) => ({
        id: cn.id,
        creditNoteNumber: String(cn.creditNoteNumber ?? 'CN-TNV/25-26/0001'),
        invoiceId: String(cn.invoiceId ?? ''),
        invoiceNumber: String(cn.invoiceNumber ?? ''),
        clientId: String(cn.clientId ?? ''),
        clientName: String(cn.clientName ?? ''),
        amount: Math.max(0, Number(cn.amount) || 0),
        currency: CURRENCY_IDS.includes(cn.currency) ? cn.currency : 'INR',
        reason: String(cn.reason ?? 'Scope adjustment or discount credit'),
        issuedDate: String(cn.issuedDate ?? new Date().toISOString().slice(0, 10)),
        status: String(cn.status ?? 'ISSUED'),
        isSample: Boolean(cn.isSample),
      })),
    recurringProfiles: recurringProfiles
      .filter((rec) => rec && typeof rec.id === 'string')
      .map((rec) => ({
        id: rec.id,
        title: String(rec.title ?? 'Monthly Retainer'),
        clientId: String(rec.clientId ?? ''),
        clientName: String(rec.clientName ?? ''),
        projectId: String(rec.projectId ?? ''),
        frequency: String(rec.frequency ?? 'MONTHLY'),
        amount: Math.max(0, Number(rec.amount) || 0),
        currency: CURRENCY_IDS.includes(rec.currency) ? rec.currency : 'INR',
        taxRatePct: Number(rec.taxRatePct) || 18,
        sacCode: String(rec.sacCode ?? '998314'),
        nextRunDate: String(rec.nextRunDate ?? new Date().toISOString().slice(0, 10)),
        autoGenerate: Boolean(rec.autoGenerate ?? true),
        status: String(rec.status ?? 'ACTIVE'),
        items: Array.isArray(rec.items) ? rec.items : [],
        isSample: Boolean(rec.isSample),
      })),
    conversations: conversations
      .filter((conv) => conv && typeof conv.id === 'string')
      .map((conv) => ({
        id: conv.id,
        channel: ['EMAIL', 'WHATSAPP', 'INSTAGRAM'].includes(conv.channel) ? conv.channel : 'WHATSAPP',
        contactName: String(conv.contactName ?? 'Unknown Contact'),
        contactHandle: String(conv.contactHandle ?? ''),
        status: ['OPEN', 'PENDING', 'RESOLVED'].includes(conv.status) ? conv.status : 'OPEN',
        assignedTo: String(conv.assignedTo ?? 'unassigned'),
        tags: Array.isArray(conv.tags) ? conv.tags.map(String) : [],
        clientId: String(conv.clientId ?? ''),
        leadId: String(conv.leadId ?? ''),
        projectId: String(conv.projectId ?? ''),
        unread: Boolean(conv.unread),
        lastMessagePreview: String(conv.lastMessagePreview ?? ''),
        lastMessageAt: String(conv.lastMessageAt ?? new Date().toISOString()),
        isSample: Boolean(conv.isSample),
      })),
    messages: messages
      .filter((msg) => msg && typeof msg.id === 'string')
      .map((msg) => ({
        id: msg.id,
        conversationId: String(msg.conversationId ?? ''),
        sender: ['contact', 'team', 'system'].includes(msg.sender) ? msg.sender : 'contact',
        senderName: String(msg.senderName ?? 'User'),
        type: msg.type === 'internal_note' ? 'internal_note' : 'message',
        channel: ['EMAIL', 'WHATSAPP', 'INSTAGRAM'].includes(msg.channel) ? msg.channel : 'WHATSAPP',
        content: String(msg.content ?? ''),
        attachments: Array.isArray(msg.attachments) ? msg.attachments : [],
        timestamp: String(msg.timestamp ?? new Date().toISOString()),
        isSample: Boolean(msg.isSample),
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
      // quota or private mode
    }
  }
  listeners.forEach((l) => l());
}

if (isBrowser()) {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.content) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useContent() {
  return useSyncExternalStore(subscribe, getSnapshot, () => normalise(seedContent));
}

// -------------------------------------------------------------
// INVOICE & TAX ENGINE ACTIONS
// -------------------------------------------------------------

export function emptyInvoice() {
  return {
    id: uid('inv'),
    invoiceNumber: generateNextInvoiceNumber(state.invoices),
    clientId: state.clients[0]?.id || '',
    projectId: state.projects[0]?.id || '',
    title: 'Milestone Scope Deliverable Payment',
    amount: 590000,
    currency: 'INR',
    subtotal: 500000,
    taxRatePct: 18,
    taxAmount: 90000,
    paidAmount: 0,
    balanceDue: 590000,
    status: 'draft',
    locked: false,
    issuedDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    paidDate: '',
    viewedAt: '',
    sacCode: '998311',
    notes: 'Standard 15-day milestone settlement terms. 18% GST applicable for domestic supply.',
    items: [
      { id: uid('item'), description: 'Full-Stack Architecture & Feature Sprint Delivery', qty: 1, rate: 500000, sacCode: '998311', amount: 500000 },
    ],
    payments: [],
    creditNoteIds: [],
    isSample: false,
  };
}

export function saveInvoice(invoice) {
  const current = state.invoices || [];
  const exists = current.some((i) => i.id === invoice.id);
  const totalAmount = Math.max(0, Number(invoice.amount) || 0);
  const paidAmount = Math.max(0, Number(invoice.paidAmount) || 0);
  const balanceDue = Math.max(0, totalAmount - paidAmount);

  let calculatedStatus = invoice.status;
  if (paidAmount >= totalAmount && totalAmount > 0) {
    calculatedStatus = 'paid';
  } else if (paidAmount > 0) {
    calculatedStatus = 'partially_paid';
  }

  const isLocked = Boolean(invoice.locked || calculatedStatus !== 'draft');

  const payload = {
    ...invoice,
    amount: totalAmount,
    paidAmount,
    balanceDue,
    status: calculatedStatus,
    locked: isLocked,
    isSample: false,
  };

  const next = exists
    ? current.map((i) => (i.id === invoice.id ? payload : i))
    : [payload, ...current];

  persist({ ...state, invoices: next });
}

export function deleteInvoice(id) {
  const next = (state.invoices || []).filter((i) => i.id !== id);
  persist({ ...state, invoices: next });
}

export function markInvoicePaid(id) {
  const inv = (state.invoices || []).find((i) => i.id === id);
  if (!inv) return;
  const nowStr = new Date().toISOString().slice(0, 10);
  saveInvoice({
    ...inv,
    status: 'paid',
    paidAmount: inv.amount,
    balanceDue: 0,
    paidDate: nowStr,
    locked: true,
  });
}

export function recordInvoicePayment(invoiceId, paymentData) {
  const inv = (state.invoices || []).find((i) => i.id === invoiceId);
  if (!inv) return;

  const paymentAmount = Math.max(0, Number(paymentData.amount) || 0);
  const newPaidAmount = (Number(inv.paidAmount) || 0) + paymentAmount;
  const totalAmount = Number(inv.amount) || 0;
  const newBalanceDue = Math.max(0, totalAmount - newPaidAmount);

  const paymentEntry = {
    id: uid('pay'),
    amount: paymentAmount,
    currency: paymentData.currency || inv.currency,
    paymentMode: paymentData.paymentMode || 'UPI',
    referenceId: paymentData.referenceId || '',
    paymentDate: paymentData.paymentDate || new Date().toISOString().slice(0, 10),
    notes: paymentData.notes || '',
  };

  const updatedPayments = [...(inv.payments || []), paymentEntry];
  const newStatus = newPaidAmount >= totalAmount ? 'paid' : 'partially_paid';

  saveInvoice({
    ...inv,
    paidAmount: newPaidAmount,
    balanceDue: newBalanceDue,
    payments: updatedPayments,
    status: newStatus,
    paidDate: newStatus === 'paid' ? paymentEntry.paymentDate : inv.paidDate,
    locked: true,
  });
}

export function issueCreditNote(creditNoteData) {
  const inv = (state.invoices || []).find((i) => i.id === creditNoteData.invoiceId);
  if (!inv) return;

  const cnId = uid('cn');
  const cnNumber = `CN-${inv.invoiceNumber}`;
  const creditAmount = Math.max(0, Number(creditNoteData.amount) || 0);

  const newCreditNote = {
    id: cnId,
    creditNoteNumber: cnNumber,
    invoiceId: inv.id,
    invoiceNumber: inv.invoiceNumber,
    clientId: inv.clientId,
    clientName: creditNoteData.clientName || 'Client',
    amount: creditAmount,
    currency: inv.currency,
    reason: creditNoteData.reason || 'Scope adjustment / revision credit',
    issuedDate: new Date().toISOString().slice(0, 10),
    status: 'ISSUED',
    isSample: false,
  };

  const nextCreditNotes = [newCreditNote, ...(state.creditNotes || [])];
  const updatedCreditNoteIds = [...(inv.creditNoteIds || []), cnId];

  let nextInvoiceStatus = inv.status;
  if (creditAmount >= inv.amount) {
    nextInvoiceStatus = 'cancelled';
  }

  const updatedInvoices = (state.invoices || []).map((i) =>
    i.id === inv.id
      ? {
          ...i,
          creditNoteIds: updatedCreditNoteIds,
          status: nextInvoiceStatus,
          balanceDue: Math.max(0, (Number(i.balanceDue) || 0) - creditAmount),
        }
      : i
  );

  persist({
    ...state,
    invoices: updatedInvoices,
    creditNotes: nextCreditNotes,
  });
}

export function saveRecurringProfile(profile) {
  const current = state.recurringProfiles || [];
  const exists = current.some((p) => p.id === profile.id);
  const payload = { ...profile, id: profile.id || uid('rec'), isSample: false };
  const next = exists
    ? current.map((p) => (p.id === profile.id ? payload : p))
    : [payload, ...current];
  persist({ ...state, recurringProfiles: next });
}

export function deleteRecurringProfile(id) {
  const next = (state.recurringProfiles || []).filter((p) => p.id !== id);
  persist({ ...state, recurringProfiles: next });
}

export function generateRetainerInvoices() {
  const profiles = (state.recurringProfiles || []).filter((p) => p.status === 'ACTIVE');
  let generatedCount = 0;
  const newInvoices = [...(state.invoices || [])];

  profiles.forEach((p) => {
    const nextInvNumber = generateNextInvoiceNumber(newInvoices);
    const subtotal = Number(p.amount) || 0;
    const taxRate = Number(p.taxRatePct) || 0;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const totalAmount = subtotal + taxAmount;

    const inv = {
      id: uid('inv'),
      invoiceNumber: nextInvNumber,
      clientId: p.clientId,
      projectId: p.projectId || '',
      title: `${p.title} (${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})`,
      amount: totalAmount,
      currency: p.currency,
      subtotal,
      taxRatePct: taxRate,
      taxAmount,
      paidAmount: 0,
      balanceDue: totalAmount,
      status: 'sent',
      locked: true,
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      paidDate: '',
      viewedAt: '',
      sacCode: p.sacCode || '998314',
      notes: `Recurring ${p.frequency} retainer invoice generated automatically.`,
      items: p.items && p.items.length > 0 ? p.items : [
        { id: uid('it'), description: p.title, qty: 1, rate: subtotal, sacCode: p.sacCode || '998314', amount: subtotal }
      ],
      payments: [],
      creditNoteIds: [],
      isSample: false,
    };

    newInvoices.unshift(inv);
    generatedCount++;
  });

  if (generatedCount > 0) {
    persist({ ...state, invoices: newInvoices });
  }
  return generatedCount;
}

export function getReceivablesAgeing(invoices = []) {
  const today = new Date();
  const buckets = {
    current: { label: 'Current / Not Due', amount: 0, count: 0, invoices: [] },
    overdue30: { label: '1–30 Days Overdue', amount: 0, count: 0, invoices: [] },
    overdue60: { label: '31–60 Days Overdue', amount: 0, count: 0, invoices: [] },
    overdue90: { label: '61–90 Days Overdue', amount: 0, count: 0, invoices: [] },
    overdue90Plus: { label: '90+ Days Overdue', amount: 0, count: 0, invoices: [] },
  };

  invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'cancelled' && (Number(i.balanceDue) || Number(i.amount)) > 0)
    .forEach((inv) => {
      const balance = Number(inv.balanceDue) > 0 ? Number(inv.balanceDue) : Number(inv.amount);
      const dueDate = inv.dueDate ? new Date(inv.dueDate) : new Date(inv.issuedDate);
      const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        buckets.current.amount += balance;
        buckets.current.count++;
        buckets.current.invoices.push(inv);
      } else if (diffDays <= 30) {
        buckets.overdue30.amount += balance;
        buckets.overdue30.count++;
        buckets.overdue30.invoices.push(inv);
      } else if (diffDays <= 60) {
        buckets.overdue60.amount += balance;
        buckets.overdue60.count++;
        buckets.overdue60.invoices.push(inv);
      } else if (diffDays <= 90) {
        buckets.overdue90.amount += balance;
        buckets.overdue90.count++;
        buckets.overdue90.invoices.push(inv);
      } else {
        buckets.overdue90Plus.amount += balance;
        buckets.overdue90Plus.count++;
        buckets.overdue90Plus.invoices.push(inv);
      }
    });

  return buckets;
}

// -------------------------------------------------------------
// MULTI-CHANNEL INBOX ACTIONS (Email, WhatsApp, Instagram)
// -------------------------------------------------------------

export function saveConversation(conversation) {
  const current = state.conversations || [];
  const exists = current.some((c) => c.id === conversation.id);
  const payload = { ...conversation, isSample: false };
  const next = exists
    ? current.map((c) => (c.id === conversation.id ? payload : c))
    : [payload, ...current];
  persist({ ...state, conversations: next });
}

export function deleteConversation(id) {
  const nextConv = (state.conversations || []).filter((c) => c.id !== id);
  const nextMsgs = (state.messages || []).filter((m) => m.conversationId !== id);
  persist({ ...state, conversations: nextConv, messages: nextMsgs });
}

export function sendMessage(conversationId, messageData) {
  const conv = (state.conversations || []).find((c) => c.id === conversationId);
  if (!conv) return;

  const newMsg = {
    id: uid('msg'),
    conversationId,
    sender: messageData.sender || 'team',
    senderName: messageData.senderName || 'Satvik Pandurangi',
    type: messageData.type === 'internal_note' ? 'internal_note' : 'message',
    channel: messageData.channel || conv.channel,
    content: messageData.content || '',
    attachments: messageData.attachments || [],
    timestamp: new Date().toISOString(),
    isSample: false,
  };

  const nextMessages = [...(state.messages || []), newMsg];

  const isInternal = newMsg.type === 'internal_note';
  const updatedConversations = (state.conversations || []).map((c) =>
    c.id === conversationId
      ? {
          ...c,
          lastMessagePreview: isInternal ? `[Internal Note] ${newMsg.content.slice(0, 70)}` : newMsg.content.slice(0, 90),
          lastMessageAt: newMsg.timestamp,
          unread: newMsg.sender === 'contact',
          status: isInternal ? c.status : (messageData.resolve ? 'RESOLVED' : 'PENDING'),
        }
      : c
  );

  persist({
    ...state,
    conversations: updatedConversations,
    messages: nextMessages,
  });
}

export function setConversationStatus(id, status) {
  const next = (state.conversations || []).map((c) =>
    c.id === id ? { ...c, status } : c
  );
  persist({ ...state, conversations: next });
}

export function assignConversation(id, assignedTo) {
  const next = (state.conversations || []).map((c) =>
    c.id === id ? { ...c, assignedTo } : c
  );
  persist({ ...state, conversations: next });
}

export function linkConversationEntity(id, { clientId, leadId, projectId }) {
  const next = (state.conversations || []).map((c) =>
    c.id === id
      ? {
          ...c,
          clientId: clientId !== undefined ? clientId : c.clientId,
          leadId: leadId !== undefined ? leadId : c.leadId,
          projectId: projectId !== undefined ? projectId : c.projectId,
        }
      : c
  );
  persist({ ...state, conversations: next });
}

export function markConversationRead(id) {
  const next = (state.conversations || []).map((c) =>
    c.id === id ? { ...c, unread: false } : c
  );
  persist({ ...state, conversations: next });
}

// -------------------------------------------------------------
// CLIENTS, LEADS, CMS, TICKETS & DISPATCH LOGS
// -------------------------------------------------------------

export function emptyClient() {
  return {
    id: uid('c'),
    name: '',
    company: '',
    email: '',
    phone: '',
    accessCode: `${Math.random().toString(36).slice(2, 6).toUpperCase()}-2026`,
    avatar: '',
    joinedDate: new Date().toISOString().slice(0, 10),
    portalNotes: '',
    isSample: false,
  };
}

export function saveClient(client) {
  const current = state.clients || [];
  const exists = current.some((c) => c.id === client.id);
  const payload = { ...client, isSample: false };
  const next = exists
    ? current.map((c) => (c.id === client.id ? payload : c))
    : [payload, ...current];
  persist({ ...state, clients: next });
}

export function deleteClient(id) {
  const next = (state.clients || []).filter((c) => c.id !== id);
  persist({ ...state, clients: next });
}

export function emptyLead() {
  return {
    id: uid('lead'),
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceInterest: ['Web Application Development'],
    budgetBand: '3L_TO_10L',
    timeline: '4-8 weeks',
    message: '',
    source: 'Direct Inbound',
    status: 'NEW',
    lostReason: null,
    createdAt: new Date().toISOString(),
    notes: '',
    isSample: false,
  };
}

export function saveLead(lead) {
  const current = state.leads || [];
  const exists = current.some((l) => l.id === lead.id);
  const payload = { ...lead, isSample: false };
  const next = exists
    ? current.map((l) => (l.id === lead.id ? payload : l))
    : [payload, ...current];
  persist({ ...state, leads: next });
}

export function deleteLead(id) {
  const next = (state.leads || []).filter((l) => l.id !== id);
  persist({ ...state, leads: next });
}

export function setLeadStatus(id, status) {
  const next = (state.leads || []).map((l) =>
    l.id === id ? { ...l, status } : l
  );
  persist({ ...state, leads: next });
}

export function convertLeadToClient(leadId) {
  const lead = (state.leads || []).find((l) => l.id === leadId);
  if (!lead) return null;

  const clientId = uid('c');
  const codeName = (lead.company || lead.name || 'CLIENT').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
  const accessCode = `${codeName}-2026`;

  const newClient = {
    id: clientId,
    name: lead.name,
    company: lead.company || lead.name,
    email: lead.email,
    phone: lead.phone,
    accessCode,
    avatar: '',
    joinedDate: new Date().toISOString().slice(0, 10),
    portalNotes: `Converted from CRM Lead. Initial interest: ${lead.serviceInterest.join(', ')}`,
    isSample: false,
  };

  const newProject = {
    id: uid('p'),
    clientId,
    title: `${lead.company || lead.name} Architecture MVP`,
    client: lead.company || lead.name,
    category: 'Web Dev',
    status: 'in-progress',
    desc: lead.message || 'Custom MVP engineered by Tanvo Tech.',
    image: '/images/dashboard.jpg',
    link: '',
    tech: ['React 19', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    progress: 10,
    startDate: new Date().toISOString().slice(0, 10),
    targetDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
    featured: false,
    isSample: false,
    milestones: [
      { id: uid('m'), title: 'Sprint 1: Architecture Blueprint & Core APIs', dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), status: 'in-progress' },
      { id: uid('m'), title: 'Sprint 2: Staging Integration & Review', dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), status: 'upcoming' },
    ],
  };

  const updatedLeads = (state.leads || []).map((l) =>
    l.id === leadId ? { ...l, status: 'WON' } : l
  );

  persist({
    ...state,
    leads: updatedLeads,
    clients: [newClient, ...(state.clients || [])],
    projects: [newProject, ...(state.projects || [])],
  });

  return { client: newClient, project: newProject };
}

export function emptyProject() {
  return {
    id: uid('p'),
    clientId: state.clients[0]?.id || '',
    title: '',
    client: '',
    category: 'Web Dev',
    status: 'upcoming',
    desc: '',
    image: '/images/dashboard.jpg',
    link: '',
    tech: [],
    progress: 0,
    startDate: new Date().toISOString().slice(0, 10),
    targetDate: '',
    featured: false,
    milestones: [],
    isSample: false,
  };
}

export function saveProject(project) {
  const current = state.projects || [];
  const exists = current.some((p) => p.id === project.id);
  const payload = { ...project, isSample: false };
  const next = exists
    ? current.map((p) => (p.id === project.id ? payload : p))
    : [payload, ...current];
  persist({ ...state, projects: next });
}

export function deleteProject(id) {
  const next = (state.projects || []).filter((p) => p.id !== id);
  persist({ ...state, projects: next });
}

export function setProjectStatus(id, status) {
  const next = (state.projects || []).map((p) =>
    p.id === id ? { ...p, status } : p
  );
  persist({ ...state, projects: next });
}

export function emptyDeliverable() {
  return {
    id: uid('d'),
    clientId: state.clients[0]?.id || '',
    projectId: state.projects[0]?.id || '',
    title: '',
    type: 'Code & Architecture',
    url: '',
    version: 'v1.0',
    uploadedDate: new Date().toISOString().slice(0, 10),
    status: 'pending',
    feedback: '',
    description: '',
    isSample: false,
  };
}

export function saveDeliverable(del) {
  const current = state.deliverables || [];
  const exists = current.some((d) => d.id === del.id);
  const payload = { ...del, isSample: false };
  const next = exists
    ? current.map((d) => (d.id === del.id ? payload : d))
    : [payload, ...current];
  persist({ ...state, deliverables: next });
}

export function deleteDeliverable(id) {
  const next = (state.deliverables || []).filter((d) => d.id !== id);
  persist({ ...state, deliverables: next });
}

export function updateDeliverableStatus(id, status, feedback = '') {
  const next = (state.deliverables || []).map((d) =>
    d.id === id ? { ...d, status, feedback } : d
  );
  persist({ ...state, deliverables: next });
}

export function emptyService() {
  return {
    id: uid('srv'),
    name: '',
    slug: '',
    category: 'Development',
    shortDesc: '',
    longDesc: '',
    deliverables: [],
    pricingModel: 'FIXED',
    basePrice: 500000,
    currency: 'INR',
    basePriceUSD: 6000,
    sacCode: '998311',
    taxRatePct: 18,
    isPublished: true,
    displayOrder: 1,
    tags: [],
    isSample: false,
  };
}

export function saveService(service) {
  const current = state.services || [];
  const exists = current.some((s) => s.id === service.id);
  const payload = { ...service, isSample: false };
  const next = exists
    ? current.map((s) => (s.id === service.id ? payload : s))
    : [payload, ...current];
  persist({ ...state, services: next });
}

export function deleteService(id) {
  const next = (state.services || []).filter((s) => s.id !== id);
  persist({ ...state, services: next });
}

export function toggleServicePublish(id) {
  const next = (state.services || []).map((s) =>
    s.id === id ? { ...s, isPublished: !s.isPublished } : s
  );
  persist({ ...state, services: next });
}

export function emptyCaseStudy() {
  return {
    id: uid('cs'),
    title: '',
    slug: '',
    clientName: '',
    industry: 'Technology',
    problem: '',
    solution: '',
    outcome: '',
    metrics: [],
    testimonial: null,
    stack: [],
    featured: false,
    isPublished: true,
    isSample: false,
  };
}

export function saveCaseStudy(cs) {
  const current = state.caseStudies || [];
  const exists = current.some((c) => c.id === cs.id);
  const payload = { ...cs, isSample: false };
  const next = exists
    ? current.map((c) => (c.id === cs.id ? payload : c))
    : [payload, ...current];
  persist({ ...state, caseStudies: next });
}

export function deleteCaseStudy(id) {
  const next = (state.caseStudies || []).filter((c) => c.id !== id);
  persist({ ...state, caseStudies: next });
}

export function toggleCaseStudyPublish(id) {
  const next = (state.caseStudies || []).map((cs) =>
    cs.id === id ? { ...cs, isPublished: !cs.isPublished } : cs
  );
  persist({ ...state, caseStudies: next });
}

export function emptyTicket(clientId = '', projectId = '') {
  return {
    id: uid('t'),
    clientId,
    projectId,
    title: '',
    category: 'Scope Addition',
    priority: 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
    description: '',
    replies: [],
    isSample: false,
  };
}

export function saveTicket(ticket) {
  const current = state.tickets || [];
  const exists = current.some((t) => t.id === ticket.id);
  const payload = { ...ticket, isSample: false };
  const next = exists
    ? current.map((t) => (t.id === ticket.id ? payload : t))
    : [payload, ...current];
  persist({ ...state, tickets: next });
}

export function deleteTicket(id) {
  const next = (state.tickets || []).filter((t) => t.id !== id);
  persist({ ...state, tickets: next });
}

export function updateTicketStatus(id, status) {
  const next = (state.tickets || []).map((t) =>
    t.id === id ? { ...t, status } : t
  );
  persist({ ...state, tickets: next });
}

export function addTicketReply(ticketId, reply) {
  const next = (state.tickets || []).map((t) => {
    if (t.id !== ticketId) return t;
    const newReply = {
      id: uid('r'),
      sender: reply.sender || 'client',
      senderName: reply.senderName || 'User',
      message: reply.message || '',
      timestamp: new Date().toISOString(),
    };
    return {
      ...t,
      replies: [...(t.replies || []), newReply],
    };
  });
  persist({ ...state, tickets: next });
}

export function saveQuote(quote) {
  const current = state.quotes || [];
  const exists = current.some((q) => q.id === quote.id);
  const payload = { ...quote, isSample: false };
  const next = exists
    ? current.map((q) => (q.id === quote.id ? payload : q))
    : [payload, ...current];
  persist({ ...state, quotes: next });
}

export function deleteQuote(id) {
  const next = (state.quotes || []).filter((q) => q.id !== id);
  persist({ ...state, quotes: next });
}

export function emptyAchievement() {
  return {
    id: uid('a'),
    title: '',
    detail: '',
    metric: '',
    metricLabel: '',
    date: new Date().toISOString().slice(0, 10),
    isSample: false,
  };
}

export function saveAchievement(achievement) {
  const current = state.achievements || [];
  const exists = current.some((a) => a.id === achievement.id);
  const payload = { ...achievement, isSample: false };
  const next = exists
    ? current.map((a) => (a.id === achievement.id ? payload : a))
    : [payload, ...current];
  persist({ ...state, achievements: next });
}

export function deleteAchievement(id) {
  const next = (state.achievements || []).filter((a) => a.id !== id);
  persist({ ...state, achievements: next });
}

export function saveDispatchLog(log) {
  const current = state.dispatchLogs || [];
  const payload = { ...log, id: log.id || uid('dl'), sentAt: new Date().toISOString(), isSample: false };
  const next = [payload, ...current];
  persist({ ...state, dispatchLogs: next });
}

export function deleteDispatchLog(id) {
  const next = (state.dispatchLogs || []).filter((d) => d.id !== id);
  persist({ ...state, dispatchLogs: next });
}

export function emptyDispatchLog() {
  return {
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
  };
}

export function setApplicationStatus(id, status) {
  const next = (state.applications || []).map((a) =>
    a.id === id ? { ...a, status } : a
  );
  persist({ ...state, applications: next });
}

export function deleteApplication(id) {
  const next = (state.applications || []).filter((a) => a.id !== id);
  persist({ ...state, applications: next });
}

export function deleteTestimonial(id) {
  const next = (state.testimonials || []).filter((t) => t.id !== id);
  persist({ ...state, testimonials: next });
}

export function exportJson() {
  return JSON.stringify(state, null, 2);
}

export function importJson(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    const normalised = normalise(parsed);
    persist(normalised);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function resetToSeed() {
  persist(normalise(seedContent));
}

/** Purge all sample records across 15+ collections */
export function purgeSamples() {
  const filterOut = (list) => (list || []).filter((item) => !item.isSample);

  persist({
    ...state,
    services: filterOut(state.services),
    leads: filterOut(state.leads),
    quotes: filterOut(state.quotes),
    caseStudies: filterOut(state.caseStudies),
    applications: filterOut(state.applications),
    testimonials: filterOut(state.testimonials),
    updates: filterOut(state.updates),
    clients: filterOut(state.clients),
    projects: filterOut(state.projects),
    deliverables: filterOut(state.deliverables),
    invoices: filterOut(state.invoices),
    creditNotes: filterOut(state.creditNotes),
    recurringProfiles: filterOut(state.recurringProfiles),
    conversations: filterOut(state.conversations),
    messages: filterOut(state.messages),
    tickets: filterOut(state.tickets),
    documents: filterOut(state.documents),
    achievements: filterOut(state.achievements),
    dispatchLogs: filterOut(state.dispatchLogs),
  });
}
