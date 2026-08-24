import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ServicesAnimationOptions {
  containerRef: HTMLElement;
  headerRef: HTMLElement;
  serviceRows: HTMLElement[];
  prefersReducedMotion?: boolean;
}

export function initServicesAnimations(options: ServicesAnimationOptions): () => void {
  const { containerRef, headerRef, serviceRows, prefersReducedMotion = false } = options;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set([headerRef, ...serviceRows], { opacity: 1, y: 0 });
      return;
    }

    // 1. Header Entrance Reveal
    if (headerRef) {
      const badge = headerRef.querySelector(".services-badge");
      const lines = headerRef.querySelectorAll(".services-heading-line");
      const copy = headerRef.querySelector(".services-copy");

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

    // 2. Sequential Service Row Entrance
    if (serviceRows.length) {
      gsap.set(serviceRows, { opacity: 0, y: 40 });

      gsap.to(serviceRows, {
        scrollTrigger: {
          trigger: serviceRows[0],
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0.85,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
    }
  }, containerRef);

  return () => ctx.revert();
}
