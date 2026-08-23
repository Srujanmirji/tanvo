import React from "react";

export const TrustPrecisionGridVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[280px] md:min-h-[340px] bg-[#04101F] rounded-2xl border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
      {/* Subtle depth glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(77, 232, 255,0.08)_0%,transparent_70%] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-3">
        <span className="text-[#4DE8FF] font-semibold tracking-widest">
          ENGINEERING INTEGRITY // MATRIX
        </span>
        <span className="text-emerald-400">VERIFIED SYSTEM</span>
      </div>

      {/* Precision Node Grid */}
      <div className="my-auto py-4 flex items-center justify-center">
        <svg viewBox="0 0 320 140" fill="none" className="w-full max-w-sm h-auto">
          {/* Grid lines */}
          <line x1="40" y1="30" x2="280" y2="30" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />
          <line x1="40" y1="70" x2="280" y2="70" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />
          <line x1="40" y1="110" x2="280" y2="110" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />

          <line x1="80" y1="10" x2="80" y2="130" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />
          <line x1="160" y1="10" x2="160" y2="130" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />
          <line x1="240" y1="10" x2="240" y2="130" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />

          {/* Connection Diamond */}
          <polygon points="160,30 240,70 160,110 80,70" fill="rgba(22, 139, 255, 0.04)" stroke="#168BFF" strokeWidth="1.5" />
          <line x1="80" y1="70" x2="240" y2="70" stroke="#4DE8FF" strokeWidth="1.5" />
          <line x1="160" y1="30" x2="160" y2="110" stroke="#4DE8FF" strokeWidth="1.5" />

          {/* Grid Intersections / Precision Nodes */}
          <circle cx="80" cy="70" r="4" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
          <circle cx="160" cy="30" r="4" fill="#071A30" stroke="#4DE8FF" strokeWidth="1.5" />
          <circle cx="240" cy="70" r="4" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
          <circle cx="160" cy="110" r="4" fill="#071A30" stroke="#4DE8FF" strokeWidth="1.5" />
          <circle cx="160" cy="70" r="5" fill="#F5FAFF" />
        </svg>
      </div>

      {/* Footer telemetry */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-3 border-t border-white/[0.04]">
        <span>TOLERANCE: ZERO DRIFT</span>
        <span className="text-[#4DE8FF]">DETERMINISTIC BEHAVIOR</span>
      </div>
    </div>
  );
};
