import React from "react";

export const NovaVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-[420px] bg-[#04101F] rounded-2xl overflow-hidden border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between group">
      {/* Background glow and subtle grid */}
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(22, 139, 255,0.18)_0%,transparent_60%] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#F5FAFF_1px,transparent_1px),linear-gradient(to_bottom,#F5FAFF_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top terminal bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
          </div>
          <span className="text-[11px] font-mono text-[#8293AA] tracking-widest pl-2">
            NOVA.GEN.v4 // ACTIVE
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#168BFF] px-2.5 py-0.5 rounded-full bg-[#168BFF]/10 border border-[#168BFF]/20">
          REAL-TIME SYNTHESIS
        </span>
      </div>

      {/* Center Generative AI Visualization */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
        <svg viewBox="0 0 400 200" fill="none" className="w-full max-w-md h-auto transition-transform duration-700 ease-out group-hover:scale-105">
          <defs>
            <linearGradient id="novaWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#168BFF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#168BFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4DE8FF" stopOpacity="0.7" />
            </linearGradient>
            <filter id="novaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Neural connection lines */}
          <path d="M 40 100 Q 120 20, 200 100 T 360 100" stroke="url(#novaWaveGrad)" strokeWidth="2.5" fill="none" filter="url(#novaGlow)" />
          <path d="M 40 100 Q 120 160, 200 100 T 360 100" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
          <path d="M 60 70 C 140 140, 260 40, 340 120" stroke="rgba(245, 250, 255, 0.25)" strokeWidth="1" strokeDasharray="3 3" fill="none" />

          {/* Neural nodes */}
          <circle cx="120" cy="60" r="5" fill="#168BFF" className="animate-pulse" />
          <circle cx="200" cy="100" r="7" fill="#F5FAFF" />
          <circle cx="280" cy="140" r="5" fill="#4DE8FF" />
          <circle cx="40" cy="100" r="4" fill="#168BFF" />
          <circle cx="360" cy="100" r="4" fill="#168BFF" />
        </svg>

        <div className="w-full flex items-center justify-between text-xs font-mono text-[#8293AA] pt-4 px-2">
          <span>LATENT SPACE: 4096-DIM</span>
          <span className="text-[#168BFF]">CONFIDENCE: 99.84%</span>
        </div>
      </div>

      {/* Bottom prompt input visual */}
      <div className="relative z-10 p-3.5 rounded-xl bg-[#071A30]/60 border border-white/[0.08] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#F5FAFF]">
          <span className="text-[#168BFF]">›</span>
          <span className="truncate">synthesize spatial interface paradigm --fidelity ultra</span>
        </div>
        <span className="w-2 h-4 bg-[#168BFF] animate-pulse" />
      </div>
    </div>
  );
};
