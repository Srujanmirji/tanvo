import { useEffect, useState } from "react";

/**
 * Reports which of the given anchors currently owns the viewport, so navigation
 * can show where the reader actually is on a long single-page scroll.
 *
 * Positions are read live rather than cached because several sections sit
 * behind ScrollTrigger pins, which move their neighbours on refresh.
 */
export function useActiveSection(hrefs: string[]): string | null {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame: number | null = null;

    const measure = () => {
      frame = null;

      // The section whose top has most recently crossed the reading line wins.
      const readingLine = window.innerHeight * 0.4;
      let current: string | null = null;

      for (const href of hrefs) {
        const element = document.querySelector(href);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= readingLine) current = href;
      }

      setActiveHref(current);
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hrefs]);

  return activeHref;
}
