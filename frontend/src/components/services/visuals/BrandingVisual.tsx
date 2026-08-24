import React from "react";

export const BrandingVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[260px] bg-[#04101F] rounded-xl border border-white/[0.08] p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(77, 232, 255,0.12)_0%,transparent_60%] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-2.5">
        <span className="text-[#4DE8FF] font-semibold">02 // BRAND SYSTEM ARCHITECTURE</span>
        <span>RATIO: 1.618</span>
      </div>

      {/* Typographic & Geometric Visual Composition */}
      <div className="my-auto py-2 flex flex-col items-center justify-center">
        <div className="border border-white/[0.12] p-4 rounded-lg bg-black/40 w-full text-center relative">
          <div className="absolute -top-2 left-4 text-[8px] font-mono bg-[#04101F] px-1.5 text-[#4DE8FF]">
            TYPE HIERARCHY
          </div>
          <div className="font-sans font-bold text-2xl tracking-tighter text-[#F5FAFF]">
            TANVO <span className="font-editorial font-normal italic text-[#4DE8FF]">Identity</span>
          </div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#8293AA] mt-1 uppercase">
            CONTEMPORARY GROTESK • EDITORIAL SERIF
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="flex items-center justify-center gap-2 mt-3 w-full">
          <div className="flex-1 h-3 rounded-xs bg-[#000000] border border-white/[0.15]" />
          <div className="flex-1 h-3 rounded-xs bg-[#071A30] border border-white/[0.15]" />
          <div className="flex-1 h-3 rounded-xs bg-[#168BFF]" />
          <div className="flex-1 h-3 rounded-xs bg-[#4DE8FF]" />
          <div className="flex-1 h-3 rounded-xs bg-[#F5FAFF]" />
        </div>
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-2 border-t border-white/[0.04]">
        <span>SYSTEM: TOKENS + GUIDELINES</span>
        <span className="text-[#4DE8FF]">DISTINCT: 100%</span>
      </div>
    </div>
  );
};
