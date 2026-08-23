import React from "react";

export const UiUxVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[260px] bg-[#04101F] rounded-xl border border-white/[0.08] p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(22, 139, 255,0.12)_0%,transparent_60%] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-2.5">
        <span className="text-[#168BFF] font-semibold">03 // INTERACTION CHOREOGRAPHY</span>
        <span>ATOMS → TEMPLATES</span>
      </div>

      {/* Interface Wireframe Layout */}
      <div className="my-auto py-2">
        <div className="grid grid-cols-3 gap-2.5">
          {/* Component 1: Navigation Sidebar Wireframe */}
          <div className="p-2.5 rounded-lg bg-[#071A30]/60 border border-white/[0.08] flex flex-col gap-1.5">
            <span className="w-8 h-2 rounded-xs bg-[#168BFF]" />
            <span className="w-12 h-1.5 rounded-xs bg-white/[0.2]" />
            <span className="w-10 h-1.5 rounded-xs bg-white/[0.1]" />
            <span className="w-14 h-1.5 rounded-xs bg-white/[0.1]" />
          </div>

          {/* Component 2: Hero Metric Card */}
          <div className="p-2.5 rounded-lg bg-[#071A30]/60 border border-white/[0.08] flex flex-col justify-between">
            <span className="text-[8px] font-mono text-[#8293AA]">FLOW RATE</span>
            <span className="text-sm font-sans font-bold text-[#F5FAFF]">99.8%</span>
            <span className="w-full h-1 rounded-full bg-[#168BFF]" />
          </div>

          {/* Component 3: Action Panel */}
          <div className="p-2.5 rounded-lg bg-[#071A30]/60 border border-[#168BFF]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="w-2 h-2 rounded-full bg-[#168BFF]" />
              <span className="text-[7px] font-mono text-[#168BFF]">PRIMARY</span>
            </div>
            <span className="w-full py-1 rounded-xs bg-[#168BFF] text-[#000000] text-[7px] font-bold text-center uppercase block">
              Execute
            </span>
          </div>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-2 border-t border-white/[0.04]">
        <span>FIDELITY: PRODUCTION READY</span>
        <span className="text-emerald-400">ACCESSIBILITY: WCAG AAA</span>
      </div>
    </div>
  );
};
