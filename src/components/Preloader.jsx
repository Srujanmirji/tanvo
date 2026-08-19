import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SEEN_KEY = 'tanvo:intro-seen';

/** Long enough for the animation to land, short enough not to annoy. */
const MIN_VISIBLE_MS = 2000;
/** Hard ceiling — the intro never holds the page hostage to a slow asset. */
const MAX_VISIBLE_MS = 3600;
/** Duration of the exit wipe; must match --intro-exit in index.css. */
const EXIT_MS = 800;

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Deep links skip the intro entirely.
 *
 * Two reasons. Editorially, someone following tanvo.tech/#contact wants
 * that section, not a two-second animation. Mechanically, the overlay
 * locks body scroll while it runs, which prevents the browser from ever
 * scrolling to the anchor — the visitor lands at the top of the page and
 * the link silently does nothing.
 */
function isDeepLink() {
  return typeof window !== 'undefined' && window.location.hash.length > 1;
}

function shouldSkip() {
  return hasSeenIntro() || isDeepLink();
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* private mode — the intro simply replays next time */
  }
}

/**
 * Branded intro overlay.
 *
 * Deliberate constraints:
 *   - shows once per browser session, not on every route change
 *   - skipped on deep links (#hash), which the scroll lock would break
 *   - never blocks longer than MAX_VISIBLE_MS even if an asset stalls
 *   - skipped entirely for prefers-reduced-motion
 *   - dismissible with Escape or a click, for anyone who has seen it
 *   - the page content is always in the DOM underneath, so crawlers and
 *     screen readers are unaffected by it
 */
export default function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(() =>
    shouldSkip() ? 'done' : 'active',
  );
  const startedAt = useRef(Date.now());

  // Reduced motion: never run the intro at all.
  useEffect(() => {
    if (prefersReducedMotion && phase !== 'done') {
      setPhase('done');
      markSeen();
    }
  }, [prefersReducedMotion, phase]);

  /*
   * Phase 1 — decide when to START exiting.
   *
   * The exit COMPLETION lives in its own effect below. Both transitions
   * used to share this one, which meant setPhase('exiting') changed the
   * [phase] dependency, ran this cleanup, and cleared the very timeout
   * that would have finished the exit — leaving the overlay stuck on
   * screen permanently.
   */
  useEffect(() => {
    if (phase !== 'active') return undefined;

    let loadTimer;
    const controller = new AbortController();
    const { signal } = controller;

    const beginExit = () => setPhase('exiting');

    // Leave once the window has loaded AND the animation has had its
    // moment — whichever is later.
    const scheduleFromLoad = () => {
      const elapsed = Date.now() - startedAt.current;
      loadTimer = setTimeout(beginExit, Math.max(0, MIN_VISIBLE_MS - elapsed));
    };

    if (document.readyState === 'complete') {
      scheduleFromLoad();
    } else {
      window.addEventListener('load', scheduleFromLoad, { once: true, signal });
    }

    const ceiling = setTimeout(beginExit, MAX_VISIBLE_MS);

    window.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') beginExit();
      },
      { signal },
    );

    // Hold the page still while the overlay is up.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(ceiling);
      controller.abort();
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  /* Phase 2 — retire the overlay once the exit animation has played. */
  useEffect(() => {
    if (phase !== 'exiting') return undefined;
    const timer = setTimeout(() => {
      setPhase('done');
      markSeen();
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div
      className={`intro ${phase === 'exiting' ? 'intro--exiting' : ''}`}
      role="status"
      aria-label="Loading Tanvo Tech"
      onClick={() => setPhase('exiting')}
    >
      <div className="intro-backdrop" />
      <div className="intro-grid" />
      <div className="intro-glow" />

      <div className="intro-body">
        <div className="intro-mark">
          <Logo className="h-20 w-20 md:h-28 md:w-28" showText={false} animated />
        </div>

        <p className="intro-word font-heading tracking-tight text-white">
          Tanvo<span className="font-light text-cyan-400">Tech</span>
        </p>

        <p className="intro-tagline font-sans text-xs tracking-widest text-slate-400 uppercase md:text-sm">
          Digital Solutions Agency
        </p>

        <div className="intro-bar" aria-hidden="true">
          <div className="intro-progress" />
        </div>
      </div>
    </div>
  );
}
