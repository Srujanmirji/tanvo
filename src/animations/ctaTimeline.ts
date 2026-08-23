import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface CtaAnimationOptions {
  containerRef: HTMLElement;
  badgeRef?: HTMLElement;
  headlineLines?: HTMLElement[];
  copyRef?: HTMLElement;
  visualRef?: HTMLElement;
  formRef?: HTMLElement;
  prefersReducedMotion?: boolean;
}

export function initCtaAnimations(options: CtaAnimationOptions): () => void {
  const {
    containerRef,
    badgeRef,
    headlineLines = [],
    copyRef,
    visualRef,
    formRef,
    prefersReducedMotion = false,
  } = options;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set(
        [badgeRef, ...headlineLines, copyRef, visualRef, formRef].filter(Boolean),
        { opacity: 1, y: 0 }
      );
      return;
    }

    const elementsToHide = [badgeRef, ...headlineLines, copyRef, visualRef, formRef].filter(Boolean);
    gsap.set(elementsToHide, { opacity: 0, y: 35 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    if (badgeRef) {
      tl.to(badgeRef, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    }

    if (visualRef) {
      tl.to(visualRef, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");
    }

    if (headlineLines.length) {
      tl.to(
        headlineLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.4"
      );
    }

    if (copyRef) {
      tl.to(copyRef, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3");
    }

    if (formRef) {
      tl.to(formRef, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.4");
    }
  }, containerRef);

  return () => ctx.revert();
}
