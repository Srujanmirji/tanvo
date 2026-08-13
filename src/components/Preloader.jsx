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
 *   - never blocks longer than MAX_VISIBLE_MS even if an asset stalls
 *   - skipped entirely for prefers-reduced-motion
 *   - dismissible with Escape or a click, for anyone who has seen it
 *   - the page content is always in the DOM underneath, so crawlers and
 *     screen readers are unaffected by it
 */
export default function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(() =>
    hasSeenIntro() ? 'done' : 'active',
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
      aria-live="polite"
      onClick={() => setPhase('exiting')}
    >
      <span className="sr-only">Loading Tanvo Tech</span>

      <div className="intro__stage" aria-hidden="true">
        {/* Orbiting accent ring behind the mark */}
        <div className="intro__ring" />
        <div className="intro__glow" />

        <Logo className="intro__logo" showText={false} animated />
      </div>

      <div className="intro__word" aria-hidden="true">
        <span className="intro__word-text">
          Tanvo<span className="font-light text-cyan-400">Tech</span>
        </span>
      </div>

      <p className="intro__tagline" aria-hidden="true">
        Engineering next-gen digital futures
      </p>

      <div className="intro__track" aria-hidden="true">
        <div className="intro__bar" />
      </div>

      <button
        type="button"
        className="intro__skip"
        onClick={() => setPhase('exiting')}
      >
        Skip intro
      </button>
    </div>
  );
}
