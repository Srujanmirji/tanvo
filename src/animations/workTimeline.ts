import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface WorkAnimationOptions {
  containerRef: HTMLElement;
  headerRef: HTMLElement;
  projectCards: HTMLElement[];
  prefersReducedMotion?: boolean;
}

export function initWorkAnimations(options: WorkAnimationOptions): () => void {
  const { containerRef, headerRef, projectCards, prefersReducedMotion = false } = options;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set([headerRef, ...projectCards], { opacity: 1, y: 0 });
      return;
    }

    // 1. Header Entrance Reveal
    if (headerRef) {
      const badge = headerRef.querySelector(".work-badge");
      const line1 = headerRef.querySelector(".work-heading-line1");
      const line2 = headerRef.querySelector(".work-heading-line2");

      gsap.set([badge, line1, line2], { opacity: 0, y: 35 });

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      headerTl
        .to(badge, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(line1, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
        .to(line2, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");
    }

    // 2. Individual Project Card Reveals
    projectCards.forEach((card) => {
      const visualWrapper = card.querySelector(".project-visual-wrapper");
      const narrative = card.querySelector(".col-span-12.lg\\:col-span-5");

      if (visualWrapper && narrative) {
        gsap.set(visualWrapper, {
          clipPath: "inset(12% 0% 12% 0%)",
          opacity: 0,
          y: 40,
          scale: 0.96,
        });
        gsap.set(narrative, { opacity: 0, y: 30 });

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        cardTl
          .to(visualWrapper, {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            scale: 1.0,
            duration: 1.1,
            ease: "power3.out",
          })
          .to(
            narrative,
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
            },
            "-=0.7"
          );
      }
    });
  }, containerRef);

  return () => ctx.revert();
}
