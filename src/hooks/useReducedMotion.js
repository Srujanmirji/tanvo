import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * True when the visitor has asked the OS to reduce motion.
 * CSS handles most of it, but JS-driven animation (canvas, rAF loops)
 * has to opt out explicitly — that's what this is for.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
