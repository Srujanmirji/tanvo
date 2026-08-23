import { forwardRef, useImperativeHandle, useRef } from "react";

export interface StoryIndicatorHandle {
  setActiveSection: (index: number) => void;
  setProgress: (progress: number) => void;
  setVisible: (isVisible: boolean) => void;
}

const STORY_STAGE_COUNT = 6;

export const StoryIndicator = forwardRef<StoryIndicatorHandle>((_, ref) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useImperativeHandle(ref, () => ({
    setActiveSection: (index: number) => {
      const activeIndex = Math.max(0, Math.min(STORY_STAGE_COUNT - 1, index));
      const activeSection = String(activeIndex + 1).padStart(2, "0");

      if (containerRef.current) {
        containerRef.current.dataset.activeSection = activeSection;
        containerRef.current.setAttribute(
          "aria-label",
          `Story progress: section ${activeIndex + 1} of ${STORY_STAGE_COUNT}`
        );
      }

      dotRefs.current.forEach((dot, dotIndex) => {
        if (!dot) return;
        const isActive = dotIndex === activeIndex;
        dot.style.opacity = isActive ? "1" : "0.25";
        dot.style.transform = isActive ? "scale(1.35)" : "scale(1)";
      });
    },
    setProgress: (progress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${Math.max(
          0.05,
          clampedProgress
        )})`;
      }

      if (containerRef.current) {
        containerRef.current.dataset.progress = clampedProgress.toFixed(3);
      }
    },
    setVisible: (isVisible: boolean) => {
      if (containerRef.current) {
        containerRef.current.style.opacity = isVisible ? "1" : "0";
      }
    },
  }), []);

  return (
    <aside
      ref={containerRef}
      data-active-section="01"
      data-progress="0.050"
      className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-4 pointer-events-none opacity-100 transition-opacity duration-500"
      aria-label="Story progress: section 1 of 6"
    >
      {/* Top Vertical Progress Bar */}
      <div className="w-[1.5px] h-16 bg-white/[0.15] relative overflow-hidden rounded-full">
        <div
          ref={progressRef}
          className="w-full h-full bg-[#168BFF] origin-top will-change-transform"
          style={{ transform: "scaleY(0.05)" }}
        />
      </div>

      {/* Stage Indicator Dots */}
      <div className="flex flex-col gap-2 my-1">
        {Array.from({ length: STORY_STAGE_COUNT }, (_, index) => (
          <span
            key={index}
            ref={(element) => {
              dotRefs.current[index] = element;
            }}
            className="w-1.5 h-1.5 rounded-full bg-[#168BFF] transition-[opacity,transform] duration-200"
            style={{ opacity: index === 0 ? 1 : 0.25 }}
          />
        ))}
      </div>

      {/* Vertical SCROLL Label */}
      <span className="text-[9px] font-mono text-[#8293AA] tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 uppercase font-medium">
        SCROLL
      </span>
    </aside>
  );
});

StoryIndicator.displayName = "StoryIndicator";
