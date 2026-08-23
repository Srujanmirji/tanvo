import React, { useEffect, useRef } from "react";
import { storySectionsData } from "../../data/story";
import { StorySection } from "./StorySection";
import { initStoryAnimations } from "../../animations/storyTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface StoryContainerProps {
  onStoryProgress?: (progress: number) => void;
  onActiveSectionChange?: (index: number) => void;
  onNarrativeVisibilityChange?: (isVisible: boolean) => void;
}

export const StoryContainer: React.FC<StoryContainerProps> = ({
  onStoryProgress,
  onActiveSectionChange,
  onNarrativeVisibilityChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Reduced motion keeps the chapters in normal document flow; everyone else
  // gets the pinned deck, where each chapter holds before stepping to the next.
  const isDeck = !prefersReducedMotion;

  useEffect(() => {
    if (!containerRef.current || !trackRef.current || !sectionRefs.current.length)
      return;

    const cleanup = initStoryAnimations({
      containerRef: containerRef.current,
      trackRef: trackRef.current,
      sectionRefs: sectionRefs.current,
      onProgressUpdate: (p) => {
        onStoryProgress?.(p);
      },
      onActiveSectionChange: (idx) => {
        onActiveSectionChange?.(idx);
      },
      onNarrativeVisibilityChange: (visible) => {
        onNarrativeVisibilityChange?.(visible);
      },
      prefersReducedMotion,
    });

    return cleanup;
  }, [
    onStoryProgress,
    onActiveSectionChange,
    onNarrativeVisibilityChange,
    prefersReducedMotion,
  ]);

  return (
    <section
      ref={containerRef}
      id="story"
      className={`relative z-10 ${isDeck ? "h-[100svh] overflow-hidden" : ""}`}
    >
      <div ref={trackRef}>
        {storySectionsData.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => {
              if (el) sectionRefs.current[index] = el;
            }}
          >
            <StorySection data={section} index={index} isDeck={isDeck} />
          </div>
        ))}
      </div>
    </section>
  );
};
