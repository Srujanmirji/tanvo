import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface HeroAnimationRefs {
  sectionRef: HTMLElement;
  eyebrowRef: HTMLElement;
  headlineLines: HTMLElement[];
  supportingTextRef: HTMLElement;
  ctaContainerRef: HTMLElement;
  scrollIndicatorRef?: HTMLElement;
  progressBarRef?: HTMLElement;
  onScrollProgress?: (progress: number) => void;
}

/**
 * Creates initial entrance animations and scroll-driven hero transformation timeline.
 */
export function initHeroAnimations(
  refs: HeroAnimationRefs,
  prefersReducedMotion: boolean = false
): () => void {
  const ctx = gsap.context(() => {
    // 1. Initial Load Entrance Timeline
    if (prefersReducedMotion) {
      // Instant graceful fade for reduced motion
      gsap.set(
        [
          refs.eyebrowRef,
          ...refs.headlineLines,
          refs.supportingTextRef,
          refs.ctaContainerRef,
          refs.scrollIndicatorRef,
        ],
        { opacity: 1, y: 0 }
      );
    } else {
      const entranceTl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1.2 },
      });

      // Set initial states
      gsap.set(refs.eyebrowRef, { opacity: 0, y: 20 });
      gsap.set(refs.headlineLines, { opacity: 0, y: 50 });
      gsap.set(refs.supportingTextRef, { opacity: 0, y: 30 });
      gsap.set(refs.ctaContainerRef, { opacity: 0, y: 20 });
      if (refs.scrollIndicatorRef) {
        gsap.set(refs.scrollIndicatorRef, { opacity: 0 });
      }

      entranceTl
        .to(refs.eyebrowRef, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
        .to(
          refs.headlineLines,
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
          },
          0.35
        )
        .to(refs.supportingTextRef, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
        .to(refs.ctaContainerRef, { opacity: 1, y: 0, duration: 0.8 }, 0.9);

      if (refs.scrollIndicatorRef) {
        entranceTl.to(
          refs.scrollIndicatorRef,
          { opacity: 1, duration: 1.0 },
          1.1
        );
      }
    }

    // 2. Scroll-Driven Hero Transformation & Progress Indicator
    if (!prefersReducedMotion && refs.sectionRef) {
      ScrollTrigger.create({
        id: "tanvo-hero-pin",
        trigger: refs.sectionRef,
        start: "top top",
        end: "+=120%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 10,
        onUpdate: (self) => {
          const progress = self.progress;

          // Update WebGL scene progress
          if (refs.onScrollProgress) {
            refs.onScrollProgress(progress);
          }

          // Update thin vertical progress indicator line
          if (refs.progressBarRef) {
            gsap.set(refs.progressBarRef, {
              scaleY: Math.max(0.05, progress),
              transformOrigin: "top center",
            });
          }

          // Subtle text fade & lift as user scrolls deep into transformation
          if (progress > 0.4) {
            const textFade = Math.max(0, 1.0 - (progress - 0.4) * 2.0);
            gsap.set(
              [
                refs.eyebrowRef,
                ...refs.headlineLines,
                refs.supportingTextRef,
                refs.ctaContainerRef,
              ],
              {
                opacity: textFade,
                y: -(progress - 0.4) * 60,
              }
            );
          } else {
            gsap.set(
              [
                refs.eyebrowRef,
                ...refs.headlineLines,
                refs.supportingTextRef,
                refs.ctaContainerRef,
              ],
              {
                opacity: 1,
                y: 0,
              }
            );
          }
        },
      });
    }
  }, refs.sectionRef);

  return () => ctx.revert();
}
