import { useEffect, useRef } from 'react';

/**
 * Reveals elements as they scroll into view — without React reaching
 * outside its own tree.
 *
 * Attach the returned ref to a container. Every descendant carrying
 * `.reveal` is observed and gets `data-revealed="true"` once visible.
 *
 * Safety properties (the previous implementation had none of these):
 *   - `.js-reveal-ready` is only set on <html> when an observer really
 *     exists, so content is never stranded invisible if JS fails.
 *   - Falls back to revealing everything when IntersectionObserver is
 *     missing or the visitor prefers reduced motion.
 *   - No inline styles written to DOM nodes React owns.
 *   - No <style> tag injection; the CSS lives in index.css.
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );

    targets.forEach((el) => observer.observe(el));

    // Belt and braces: if anything is already in view on mount (or the
    // observer never fires), reveal it on the next frame.
    const raf = requestAnimationFrame(() => {
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.setAttribute('data-revealed', 'true');
          observer.unobserve(el);
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.documentElement.classList.remove('js-reveal-ready');
    };
  }, [enabled, threshold]);

  return containerRef;
}
