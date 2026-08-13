import { useSyncExternalStore } from 'react';
import { seedContent } from '../data/seed';
import { STORAGE_KEYS, STATUS_IDS } from './constants';

/**
 * A tiny observable store backed by localStorage.
 *
 * Read through `useContent()` — it subscribes via useSyncExternalStore,
 * so every mounted component (public site and admin alike) re-renders
 * the moment content changes, including from another browser tab.
 *
 * NOTE: localStorage is per-browser. Admin edits are visible to the
 * person who made them, not to site visitors. Use Export JSON to
 * promote changes into `src/data/seed.js` and redeploy.
 */

const listeners = new Set();
let state = load();

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/** Defensive normalisation — never trust what's in storage. */
function normalise(raw) {
  const projects = Array.isArray(raw?.projects) ? raw.projects : [];
  const achievements = Array.isArray(raw?.achievements) ? raw.achievements : [];

  return {
    version: 1,
    projects: projects
      .filter((p) => p && typeof p.id === 'string')
      .map((p) => ({
        id: p.id,
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
  };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function load() {
  if (!isBrowser()) return normalise(seedContent);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.content);
    if (!raw) return normalise(seedContent);
    return normalise(JSON.parse(raw));
  } catch {
    // Corrupted or unparseable — fall back to seed rather than crash.
    return normalise(seedContent);
  }
}

function persist(next) {
  state = next;
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(next));
    } catch {
      // Quota exceeded or private mode — keep the in-memory state so the
      // session still works, and let the caller surface a warning.
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

// Keep multiple tabs in sync.
if (isBrowser()) {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.content) {
      state = load();
      listeners.forEach((fn) => fn());
    }
  });
}

/** Subscribe a component to the whole content tree. */
export function useContent() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getContent() {
  return state;
}

/* ---------------------------------------------------------------
   Mutations
   --------------------------------------------------------------- */

function uid(prefix) {
  const rand =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

export const emptyProject = () => ({
  id: uid('p'),
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
});

export const emptyAchievement = () => ({
  id: uid('a'),
  title: '',
  detail: '',
  metric: '',
  metricLabel: '',
  date: new Date().toISOString().slice(0, 10),
  isSample: false,
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

/** Remove every record still flagged as seed placeholder. */
export function purgeSamples() {
  persist(
    normalise({
      ...state,
      projects: state.projects.filter((p) => !p.isSample),
      achievements: state.achievements.filter((a) => !a.isSample),
    }),
  );
}

export function resetToSeed() {
  persist(normalise(seedContent));
}

export function exportJson() {
  return JSON.stringify(state, null, 2);
}

/** Returns { ok: true } or { ok: false, error }. Never throws. */
export function importJson(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, error: 'File is not a JSON object.' };
    }
    if (!Array.isArray(parsed.projects) && !Array.isArray(parsed.achievements)) {
      return {
        ok: false,
        error: 'Expected at least a "projects" or "achievements" array.',
      };
    }
    persist(normalise(parsed));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON.' };
  }
}
