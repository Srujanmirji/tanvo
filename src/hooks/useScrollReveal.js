import { useEffect, useRef } from 'react';

/** Reveal anything whose top has reached this far up the viewport. */
const TRIGGER_OFFSET = 60;

/**
 * Reveals elements as they scroll into view — without React reaching
 * outside its own tree.
 *
 * Attach the returned ref to a container. Every descendant carrying
 * `.reveal` is observed and gets `data-revealed="true"` once visible.
 *
 * Safety properties:
 *   - `.js-reveal-ready` is only set on <html> when an observer really
 *     exists, so content is never stranded invisible if JS fails.
 *   - Falls back to revealing everything when IntersectionObserver is
 *     missing or the visitor prefers reduced motion.
 *   - A scroll sweep backs up the observer. IntersectionObserver only
 *     fires when the intersection ratio CROSSES a threshold, so an
 *     element that jumps from below the fold to above it in one step
 *     — anchor link, End key, restored scroll position, fast flick —
 *     never reports as intersecting and would stay invisible forever.
 *     The sweep catches those, and unhooks itself once nothing is left.
 *   - No inline styles written to DOM nodes React owns, and no <style>
 *     injection; the CSS lives in index.css.
 */
export function useScrollReveal({ enabled = true, threshold = 0.15 } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const targets = root.querySelectorAll('.reveal');
    if (!targets.length) return undefined;

    const revealAll = () => {
      targets.forEach((el) => el.setAttribute('data-revealed', 'true'));
    };

    if (!enabled || typeof IntersectionObserver === 'undefined') {
      revealAll();
      return undefined;
    }

    document.documentElement.classList.add('js-reveal-ready');

    const pending = new Set(targets);
    let ticking = false;
    let observer;

    const reveal = (el) => {
      el.setAttribute('data-revealed', 'true');
      pending.delete(el);
      observer?.unobserve(el);
      if (pending.size === 0) detachSweep();
    };

    /** Reveal everything at or above the trigger line, including
     *  anything already scrolled past. */
    const sweep = () => {
      ticking = false;
      const limit = window.innerHeight - TRIGGER_OFFSET;
      // Copy first: reveal() mutates `pending` while we iterate.
      [...pending].forEach((el) => {
        if (el.getBoundingClientRect().top < limit) reveal(el);
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };

    function detachSweep() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold, rootMargin: `0px 0px -${TRIGGER_OFFSET}px 0px` },
    );

    targets.forEach((el) => observer.observe(el));

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Catch whatever is already on screen at mount.
    const raf = requestAnimationFrame(sweep);

    return () => {
      cancelAnimationFrame(raf);
      detachSweep();
      observer.disconnect();
      document.documentElement.classList.remove('js-reveal-ready');
    };
  }, [enabled, threshold]);

  return containerRef;
}
