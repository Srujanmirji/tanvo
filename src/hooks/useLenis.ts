import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

let globalLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return globalLenis;
}

export function scrollToTarget(target: string | HTMLElement, options?: { offset?: number; duration?: number }) {
  if (globalLenis) {
    globalLenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else if (typeof document !== "undefined") {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.1 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard exponential ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Synchronize Lenis scroll position with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Bind Lenis animation frame updates to the GSAP central ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Child components create their ScrollTriggers before this layout-level
    // effect runs. Refresh once all triggers and fonts have settled so pinned
    // spacing is measured before downstream section boundaries.
    const initialRefreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    let isDisposed = false;

    document.fonts?.ready.then(() => {
      if (!isDisposed) ScrollTrigger.refresh();
    });

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(initialRefreshFrame);
      gsap.ticker.remove(tickerCallback);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      if (globalLenis === lenis) globalLenis = null;
    };
  }, [prefersReducedMotion]);

  return { lenisRef, scrollTo: scrollToTarget };
}
