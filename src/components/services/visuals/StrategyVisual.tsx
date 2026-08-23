import React from "react";

export const StrategyVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[260px] bg-[#04101F] rounded-xl border border-white/[0.08] p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(22, 139, 255,0.12)_0%,transparent_60%] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-2.5">
        <span className="text-[#168BFF] font-semibold">01 // STRATEGIC ARCHITECTURE</span>
        <span>MILESTONE: Q2-Q4</span>
      </div>

      {/* Center Graph Diagram */}
      <div className="my-auto py-3">
        <svg viewBox="0 0 340 110" fill="none" className="w-full h-auto">
          {/* Connection Lines */}
          <line x1="45" y1="55" x2="135" y2="25" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="45" y1="55" x2="135" y2="85" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="135" y1="25" x2="225" y2="55" stroke="#4DE8FF" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="135" y1="85" x2="225" y2="55" stroke="#4DE8FF" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="225" y1="55" x2="305" y2="55" stroke="#F5FAFF" strokeWidth="1.5" strokeOpacity="0.8" strokeDasharray="3 3" />

          {/* Node 1: Vision */}
          <g transform="translate(45, 55)">
            <circle r="18" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
            <text textAnchor="middle" dy="3.5" fill="#F5FAFF" fontSize="7" fontFamily="Space Grotesk" fontWeight="bold">VISION</text>
          </g>

          {/* Node 2: Market */}
          <g transform="translate(135, 25)">
            <circle r="16" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
            <text textAnchor="middle" dy="3.5" fill="#168BFF" fontSize="7" fontFamily="Space Grotesk" fontWeight="bold">MARKET</text>
          </g>

          {/* Node 3: Systems */}
          <g transform="translate(135, 85)">
            <circle r="16" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
            <text textAnchor="middle" dy="3.5" fill="#168BFF" fontSize="7" fontFamily="Space Grotesk" fontWeight="bold">SYSTEM</text>
          </g>

          {/* Node 4: Product */}
          <g transform="translate(225, 55)">
            <circle r="20" fill="#071A30" stroke="#4DE8FF" strokeWidth="2" />
            <text textAnchor="middle" dy="3.5" fill="#4DE8FF" fontSize="7" fontFamily="Space Grotesk" fontWeight="bold">CORE OS</text>
          </g>

          {/* Node 5: Scale */}
          <g transform="translate(305, 55)">
            <circle r="14" fill="#071A30" stroke="#F5FAFF" strokeWidth="1.5" />
            <text textAnchor="middle" dy="3.5" fill="#F5FAFF" fontSize="7" fontFamily="Space Grotesk" fontWeight="bold">SCALE</text>
          </g>
        </svg>
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-2 border-t border-white/[0.04]">
        <span>METHOD: FIRST PRINCIPLES</span>
        <span className="text-emerald-400">FEASIBILITY: VALIDATED</span>
      </div>
    </div>
  );
};
