import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface FooterAnimationOptions {
  containerRef: HTMLElement;
  ctaRef?: HTMLElement | null;
  portalRef?: HTMLElement | null;
  brandRef?: HTMLElement | null;
  columnRefs?: (HTMLElement | null)[];
  bottomRef?: HTMLElement | null;
  wordmarkRef?: HTMLElement | null;
  prefersReducedMotion?: boolean;
}

/**
 * Closing reveal for the footer: brand first, invitation just behind it, the
 * link columns in a short stagger, then the bottom bar. The wordmark fades up
 * underneath the whole thing.
 */
export function initFooterAnimations(
  options: FooterAnimationOptions
): () => void {
  const {
    containerRef,
    ctaRef,
    portalRef,
    brandRef,
    columnRefs = [],
    bottomRef,
    wordmarkRef,
    prefersReducedMotion = false,
  } = options;

  const ctx = gsap.context(() => {
    const columns = columnRefs.filter((el): el is HTMLElement => Boolean(el));
    const blocks = [ctaRef, portalRef, brandRef, ...columns, bottomRef].filter(
      (el): el is HTMLElement => Boolean(el)
    );

    // Reduced motion gets the finished state, with no movement and no stagger.
    if (prefersReducedMotion) {
      gsap.set(blocks, { opacity: 1, y: 0 });
      if (wordmarkRef) gsap.set(wordmarkRef, { opacity: 1 });
      return;
    }

    gsap.set(blocks, { opacity: 0, y: 28 });
    if (wordmarkRef) gsap.set(wordmarkRef, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        id: "tanvo-footer",
        trigger: containerRef,
        start: "top 85%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    if (wordmarkRef) {
      tl.to(wordmarkRef, { opacity: 1, duration: 1.8, ease: "power2.out" }, 0.25);
    }

    if (ctaRef) {
      tl.to(ctaRef, { opacity: 1, y: 0, duration: 0.9 }, 0.05);
    }

    if (portalRef) {
      tl.to(portalRef, { opacity: 1, y: 0, duration: 1.1 }, 0.16);
    }

    if (brandRef) {
      tl.to(brandRef, { opacity: 1, y: 0, duration: 0.85 }, 0.3);
    }

    if (columns.length) {
      tl.to(columns, { opacity: 1, y: 0, duration: 0.75, stagger: 0.07 }, 0.4);
    }

    if (bottomRef) {
      tl.to(bottomRef, { opacity: 1, y: 0, duration: 0.7 }, 0.7);
    }
  }, containerRef);

  return () => ctx.revert();
}
