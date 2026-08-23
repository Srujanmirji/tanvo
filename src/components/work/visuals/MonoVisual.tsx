import React from "react";

export const MonoVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-[420px] bg-[#04101F] rounded-2xl overflow-hidden border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between group">
      {/* Warm White & Slate Depth */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(245, 250, 255,0.08)_0%,transparent_60%] pointer-events-none" />

      {/* Top Editorial Commerce Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <span className="font-editorial text-lg text-[#F5FAFF] italic tracking-wide">
          Mono. Flagship
        </span>
        <span className="text-[10px] font-mono text-[#8293AA] tracking-widest uppercase">
          EDITION 04 / 2024
        </span>
      </div>

      {/* Center 3D Minimalist Product Silhouette */}
      <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
        <svg viewBox="0 0 320 160" fill="none" className="w-full max-w-xs h-auto transition-transform duration-700 ease-out group-hover:scale-105">
          <defs>
            <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5FAFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#071A30" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Minimal architectural silhouette */}
          <polygon points="160,20 250,70 250,130 160,150 70,130 70,70" fill="url(#monoGrad)" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.3" />
          <polygon points="160,20 250,70 160,95 70,70" fill="rgba(245, 250, 255, 0.15)" />
          <line x1="160" y1="95" x2="160" y2="150" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.4" />

          {/* Subtle cyan brand highlight */}
          <circle cx="160" cy="95" r="3" fill="#4DE8FF" />
        </svg>

        <div className="text-center mt-2">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#F5FAFF] block mb-1">
            BESPOKE TIMEPIECE N°01
          </span>
          <span className="font-editorial text-sm text-[#8293AA] italic">
            Configurable 3D Materiality & Real-Time Checkout
          </span>
        </div>
      </div>

      {/* Bottom Commerce Metric */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8293AA] pt-3 border-t border-white/[0.06]">
        <span>HEADLESS ENGINE</span>
        <span className="text-[#F5FAFF] font-semibold">SUB-SECOND LATENCY</span>
      </div>
    </div>
  );
};
