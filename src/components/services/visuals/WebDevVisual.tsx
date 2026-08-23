import React from "react";

export const WebDevVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[260px] bg-[#04101F] rounded-xl border border-white/[0.08] p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(22, 139, 255,0.12)_0%,transparent_60%] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-2.5">
        <span className="text-[#168BFF] font-semibold">04 // SYSTEMS ARCHITECTURE</span>
        <span>EDGE DISTRIBUTED</span>
      </div>

      {/* Engineering Pipeline Diagram */}
      <div className="my-auto py-2">
        <div className="flex items-center justify-between gap-1 text-[8px] font-mono">
          <div className="p-2 rounded-md bg-[#071A30] border border-white/[0.1] text-center flex-1">
            <span className="text-[#168BFF] font-bold block">CLIENT</span>
            <span className="text-[#8293AA]">React 19</span>
          </div>
          <span className="text-[#8293AA]">→</span>
          <div className="p-2 rounded-md bg-[#071A30] border border-white/[0.1] text-center flex-1">
            <span className="text-[#F5FAFF] font-bold block">EDGE API</span>
            <span className="text-[#8293AA]">GraphQL</span>
          </div>
          <span className="text-[#8293AA]">→</span>
          <div className="p-2 rounded-md bg-[#071A30] border border-white/[0.1] text-center flex-1">
            <span className="text-[#4DE8FF] font-bold block">CORE</span>
            <span className="text-[#8293AA]">Rust / DB</span>
          </div>
        </div>

        {/* Latency & Build Stats */}
        <div className="mt-3 p-2.5 rounded-md bg-black/40 border border-white/[0.06] flex items-center justify-between text-[9px] font-mono">
          <span className="text-[#8293AA]">TTFB: &lt; 28ms</span>
          <span className="text-emerald-400">BUILD: 100/100 CWV</span>
          <span className="text-[#168BFF]">DPR: CAPPED</span>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-2 border-t border-white/[0.04]">
        <span>STACK: MODERN WEB & TS</span>
        <span className="text-emerald-400">UPTIME: 99.99%</span>
      </div>
    </div>
  );
};
