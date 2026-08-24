import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ApproachAnimationOptions {
  containerRef: HTMLElement;
  headerRef: HTMLElement;
  stepRefs: HTMLElement[];
  progressBarRef?: HTMLElement;
  onActiveStepChange?: (index: number) => void;
  prefersReducedMotion?: boolean;
}

export function initApproachAnimations(options: ApproachAnimationOptions): () => void {
  const {
    containerRef,
    headerRef,
    stepRefs,
    progressBarRef,
    onActiveStepChange,
    prefersReducedMotion = false,
  } = options;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set([headerRef, ...stepRefs], { opacity: 1, y: 0 });
      return;
    }

    // 1. Approach Header Reveal
    if (headerRef) {
      const badge = headerRef.querySelector(".approach-badge");
      const lines = headerRef.querySelectorAll(".approach-heading-line");
      const copy = headerRef.querySelector(".approach-copy");

      gsap.set([badge, ...lines, copy], { opacity: 0, y: 35 });

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      headerTl
        .to(badge, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(
          lines,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(copy, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
    }

    // 2. Step Entrances & Active Step ScrollTriggers
    stepRefs.forEach((step, index) => {
      gsap.set(step, { opacity: 0.4, y: 20 });

      ScrollTrigger.create({
        trigger: step,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          onActiveStepChange?.(index);
          gsap.to(step, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        },
        onEnterBack: () => {
          onActiveStepChange?.(index);
          gsap.to(step, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        },
        onLeave: () => {
          gsap.to(step, { opacity: 0.4, duration: 0.4, ease: "power2.out" });
        },
        onLeaveBack: () => {
          if (index > 0) {
            gsap.to(step, { opacity: 0.4, duration: 0.4, ease: "power2.out" });
          }
        },
      });
    });

    // 3. Connecting Vertical Progress Line
    if (progressBarRef && containerRef) {
      ScrollTrigger.create({
        id: "tanvo-approach-progress",
        trigger: containerRef,
        start: "top 65%",
        end: "bottom 40%",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(progressBarRef, {
            scaleY: Math.max(0.05, self.progress),
            transformOrigin: "top center",
          });
        },
      });
    }
  }, containerRef);

  return () => ctx.revert();
}

export interface TrustAnimationOptions {
  containerRef: HTMLElement;
  headerRef: HTMLElement;
  capabilityCards: HTMLElement[];
  prefersReducedMotion?: boolean;
}

export function initTrustAnimations(options: TrustAnimationOptions): () => void {
  const { containerRef, headerRef, capabilityCards, prefersReducedMotion = false } = options;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set([headerRef, ...capabilityCards], { opacity: 1, y: 0 });
      return;
    }

    // 1. Trust Header Entrance
    if (headerRef) {
      const badge = headerRef.querySelector(".trust-badge");
      const lines = headerRef.querySelectorAll(".trust-heading-line");
      const copy = headerRef.querySelector(".trust-copy");

      gsap.set([badge, ...lines, copy], { opacity: 0, y: 35 });

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      headerTl
        .to(badge, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(
          lines,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(copy, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
    }

    // 2. Sequential Capability Cards Entrance
    if (capabilityCards.length) {
      gsap.set(capabilityCards, { opacity: 0, y: 35 });

      gsap.to(capabilityCards, {
        scrollTrigger: {
          trigger: capabilityCards[0],
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, containerRef);

  return () => ctx.revert();
}
