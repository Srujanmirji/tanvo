import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useIsMobile } from "../../hooks/useIsMobile";

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [cursorText, setCursorText] = useState<string>("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "pointer" | "project" | "cta">("default");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isMobile || prefersReducedMotion || typeof window === "undefined") return;

    // Check if pointer is coarse (touch screen)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const mousePos = { x: -100, y: -100 };
    const currentPos = { x: -100, y: -100 };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        setCursorVariant("default");
        setCursorText("");
        return;
      }

      const cursorElement = target.closest<HTMLElement>("[data-cursor]");
      const isInteractive = target.closest("a, button, input, textarea, [role='button'], select");

      if (cursorElement) {
        const type = cursorElement.dataset.cursor;
        if (type === "project") {
          setCursorVariant("project");
          setCursorText("VIEW PROJECT");
        } else if (type === "cta") {
          setCursorVariant("cta");
          setCursorText("LET'S BUILD");
        } else if (type === "pointer") {
          setCursorVariant("pointer");
          setCursorText("");
        } else {
          setCursorVariant("default");
          setCursorText("");
        }
      } else if (isInteractive) {
        setCursorVariant("pointer");
        setCursorText("");
      } else {
        setCursorVariant("default");
        setCursorText("");
      }
    };

    const resetCursor = () => {
      setIsVisible(false);
      setCursorVariant("default");
      setCursorText("");
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", resetCursor);
    document.addEventListener("mouseenter", () => setIsVisible(true));
    window.addEventListener("blur", resetCursor);
    window.addEventListener("scroll", () => {
      // Keep position updated on scroll without desync
    }, { passive: true });

    // Smooth lerp ticker using GSAP
    const ticker = gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio());
      currentPos.x += (mousePos.x - currentPos.x) * dt;
      currentPos.y += (mousePos.y - currentPos.y) * dt;

      gsap.set(cursor, {
        x: currentPos.x,
        y: currentPos.y,
      });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", resetCursor);
      window.removeEventListener("blur", resetCursor);
      gsap.ticker.remove(ticker);
    };
  }, [isMobile, prefersReducedMotion, isVisible]);

  if (isMobile || prefersReducedMotion) {
    return null;
  }

  const isLarge = cursorVariant === "project" || cursorVariant === "cta";
  const isPointer = cursorVariant === "pointer";

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 transition-opacity duration-300 flex items-center justify-center ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-300 ease-out border ${
          isLarge
            ? "w-24 h-24 bg-[#168BFF] text-[#000000] border-transparent shadow-[0_0_30px_rgba(22, 139, 255,0.4)]"
            : isPointer
            ? "w-10 h-10 bg-[#168BFF]/20 border-[#168BFF]/60 backdrop-blur-xs scale-110"
            : "w-3 h-3 bg-[#F5FAFF] border-transparent"
        }`}
      >
        {isLarge && (
          <span
            ref={textRef}
            className="text-[9px] font-bold tracking-widest text-center px-2 uppercase text-[#000000] font-sans select-none"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
