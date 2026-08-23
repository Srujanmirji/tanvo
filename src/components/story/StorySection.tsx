import React from "react";
import { StorySectionData } from "../../data/story";

interface StorySectionProps {
  data: StorySectionData;
  index: number;
}

const visionLabels = ["STRATEGY", "ARCHITECTURE", "USER EXPERIENCE", "BRAND"];

export const StorySection: React.FC<StorySectionProps> = ({ data, index }) => {
  return (
    <div
      id={data.id}
      data-story-index={index}
      className="story-section min-h-[86svh] md:min-h-[90vh] flex flex-col justify-center py-24 md:py-28 relative pointer-events-none border-t border-white/[0.055]"
    >
      <div className="site-container w-full">
        <div className="grid-12 items-center">
          {/* Narrative Content (Left Aligned) */}
          <div className="story-copy col-span-12 md:col-span-8 lg:col-span-6 xl:col-span-5 pointer-events-auto relative z-10 isolate">
            {/* Step badge */}
            <div className="story-badge mb-4 md:mb-5 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168BFF]" />
              <span className="text-label text-[#168BFF] font-mono tracking-[0.2em]">
                {data.badge}
              </span>
            </div>

            {/* Editorial Headline */}
            <h2 className="text-[clamp(2rem,3.8vw,4rem)] leading-[0.96] tracking-[-0.03em] text-[#F5FAFF] uppercase font-semibold mb-5 md:mb-6 select-none">
              <span className="story-heading-line block overflow-hidden">
                {data.titleLine1}
              </span>
              <span className="story-heading-line block overflow-hidden text-[#168BFF]">
                {data.titleLine2}
              </span>
            </h2>

            {/* Narrative description */}
            <p className="story-desc text-sm md:text-base lg:text-lg max-w-md text-[#94A7BD] leading-relaxed mb-5 md:mb-6">
              {data.description}
            </p>

            {/* Vision-Specific Floating Conceptual Badges */}
            {data.id === "vision" && (
              <div className="story-tags flex flex-wrap gap-x-4 gap-y-2 pt-2">
                {visionLabels.map((lbl) => (
                  <span
                    key={lbl}
                    className="text-[9px] font-mono tracking-[0.16em] text-[#78DFFF] border-l border-[#168BFF]/40 pl-2 py-0.5"
                  >
                    {lbl}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
