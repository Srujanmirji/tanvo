import React from "react";

export const ArcVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-[420px] bg-[#04101F] rounded-2xl overflow-hidden border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between group">
      {/* Gold & Navy Atmospheric Depth */}
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(77, 232, 255,0.14)_0%,transparent_60%] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#4DE8FF_1px,transparent_1px),linear-gradient(to_bottom,#4DE8FF_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Trading Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#4DE8FF] shadow-[0_0_8px_#4DE8FF]" />
          <span className="text-[11px] font-mono text-[#F5FAFF] tracking-widest">
            ARC // LIQUIDITY TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-[#8293AA]">
          <span>SPREAD: 0.0001</span>
          <span className="text-emerald-400">STATUS: OPTIMAL</span>
        </div>
      </div>

      {/* Center High-Precision Financial Metrics & Depth Chart */}
      <div className="relative z-10 my-auto py-6">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-[#8293AA] block mb-1">TOTAL AGGREGATED DEPTH</span>
            <div className="text-3xl md:text-4xl font-sans font-bold text-[#F5FAFF] tracking-tight">
              $4,289,140,290.<span className="text-xs font-mono text-[#4DE8FF]">84</span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#4DE8FF] px-2.5 py-1 rounded-md bg-[#4DE8FF]/10 border border-[#4DE8FF]/20">
            +18.42% VOL
          </span>
        </div>

        {/* Dynamic Vector Candlestick / Order Book Chart */}
        <svg viewBox="0 0 400 140" fill="none" className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-105">
          <defs>
            <linearGradient id="arcChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4DE8FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4DE8FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="35" x2="400" y2="35" stroke="rgba(245, 250, 255, 0.05)" strokeDasharray="4 4" />
          <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(245, 250, 255, 0.05)" strokeDasharray="4 4" />
          <line x1="0" y1="105" x2="400" y2="105" stroke="rgba(245, 250, 255, 0.05)" strokeDasharray="4 4" />

          {/* Area fill and price line */}
          <path d="M 0 110 Q 60 90, 110 95 T 220 50 T 320 60 T 400 20 L 400 140 L 0 140 Z" fill="url(#arcChartGrad)" />
          <path d="M 0 110 Q 60 90, 110 95 T 220 50 T 320 60 T 400 20" stroke="#4DE8FF" strokeWidth="2.5" fill="none" />

          {/* High focal point */}
          <circle cx="400" cy="20" r="4" fill="#4DE8FF" />
          <circle cx="220" cy="50" r="3.5" fill="#F5FAFF" />
        </svg>
      </div>

      {/* Bottom Order Book Execution Metrics */}
      <div className="relative z-10 grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono">
        <div>
          <span className="text-[10px] text-[#8293AA] block">BLOCK LATENCY</span>
          <span className="text-[#F5FAFF] font-semibold">1.2ms</span>
        </div>
        <div>
          <span className="text-[10px] text-[#8293AA] block">MATCH ENGINE</span>
          <span className="text-[#4DE8FF] font-semibold">0-SLIPPAGE</span>
        </div>
        <div>
          <span className="text-[10px] text-[#8293AA] block">NETWORK</span>
          <span className="text-[#F5FAFF] font-semibold">DISTRIBUTED</span>
        </div>
      </div>
    </div>
  );
};
