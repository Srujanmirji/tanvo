import React, { useEffect, useRef } from "react";
import { storySectionsData } from "../../data/story";
import { StorySection } from "./StorySection";
import { initStoryAnimations } from "../../animations/storyTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface StoryContainerProps {
  onStoryProgress?: (progress: number) => void;
  onActiveSectionChange?: (index: number) => void;
}

export const StoryContainer: React.FC<StoryContainerProps> = ({
  onStoryProgress,
  onActiveSectionChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || !sectionRefs.current.length) return;

    const cleanup = initStoryAnimations({
      containerRef: containerRef.current,
      sectionRefs: sectionRefs.current,
      onProgressUpdate: (p) => {
        onStoryProgress?.(p);
      },
      onActiveSectionChange: (idx) => {
        onActiveSectionChange?.(idx);
      },
      prefersReducedMotion,
    });

    return cleanup;
  }, [onStoryProgress, onActiveSectionChange, prefersReducedMotion]);

  return (
    <section ref={containerRef} id="story" className="relative z-10">
      {storySectionsData.map((section, index) => (
        <div
          key={section.id}
          ref={(el) => {
            if (el) sectionRefs.current[index] = el;
          }}
        >
          <StorySection data={section} index={index} />
        </div>
      ))}
    </section>
  );
};
