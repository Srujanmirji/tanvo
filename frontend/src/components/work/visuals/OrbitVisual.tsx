import React from "react";

export const OrbitVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-[420px] bg-[#04101F] rounded-2xl overflow-hidden border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between group">
      {/* Deep Navy & Violet Ambient Atmosphere */}
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(22, 139, 255,0.12)_0%,transparent_60%] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#168BFF_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Workspace Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-[#168BFF]/20 border border-[#168BFF]/40 flex items-center justify-center text-[10px] font-bold text-[#168BFF]">
            O
          </div>
          <span className="text-[11px] font-mono text-[#F5FAFF] tracking-widest">
            ORBIT // SPATIAL OS
          </span>
        </div>

        {/* Active Collaborators */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#168BFF] text-[#000000] text-[10px] font-bold flex items-center justify-center border-2 border-[#04101F]">
              AL
            </span>
            <span className="w-6 h-6 rounded-full bg-[#4DE8FF] text-[#000000] text-[10px] font-bold flex items-center justify-center border-2 border-[#04101F]">
              VR
            </span>
            <span className="w-6 h-6 rounded-full bg-[#071A30] text-[#F5FAFF] text-[10px] font-bold flex items-center justify-center border-2 border-white/[0.1]">
              +4
            </span>
          </div>
        </div>
      </div>

      {/* Center 3D Spatial Canvas Node Graph */}
      <div className="relative z-10 my-auto py-6">
        <svg viewBox="0 0 400 170" fill="none" className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-105">
          {/* Spatial connection lines */}
          <line x1="80" y1="85" x2="200" y2="40" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="80" y1="85" x2="200" y2="130" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="200" y1="40" x2="320" y2="85" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="200" y1="130" x2="320" y2="85" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Node Cards */}
          <g transform="translate(40, 60)">
            <rect width="80" height="50" rx="8" fill="#071A30" stroke="rgba(22, 139, 255, 0.4)" strokeWidth="1" />
            <text x="12" y="24" fill="#F5FAFF" fontSize="10" fontFamily="Space Grotesk" fontWeight="bold">Ingest</text>
            <text x="12" y="38" fill="#8293AA" fontSize="8" fontFamily="monospace">Pipeline</text>
          </g>

          <g transform="translate(160, 15)">
            <rect width="80" height="50" rx="8" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
            <text x="12" y="24" fill="#168BFF" fontSize="10" fontFamily="Space Grotesk" fontWeight="bold">Compute</text>
            <text x="12" y="38" fill="#8293AA" fontSize="8" fontFamily="monospace">CRDT Sync</text>
          </g>

          <g transform="translate(160, 105)">
            <rect width="80" height="50" rx="8" fill="#071A30" stroke="rgba(77, 232, 255, 0.4)" strokeWidth="1" />
            <text x="12" y="24" fill="#4DE8FF" fontSize="10" fontFamily="Space Grotesk" fontWeight="bold">Spatial</text>
            <text x="12" y="38" fill="#8293AA" fontSize="8" fontFamily="monospace">Vector 3D</text>
          </g>

          <g transform="translate(280, 60)">
            <rect width="80" height="50" rx="8" fill="#071A30" stroke="rgba(245, 250, 255, 0.4)" strokeWidth="1" />
            <text x="12" y="24" fill="#F5FAFF" fontSize="10" fontFamily="Space Grotesk" fontWeight="bold">Deploy</text>
            <text x="12" y="38" fill="#8293AA" fontSize="8" fontFamily="monospace">Edge Global</text>
          </g>

          {/* Live User Cursor Node */}
          <g transform="translate(250, 48)">
            <polygon points="0,0 12,4 8,8 14,14 11,16 5,10 2,14" fill="#168BFF" />
            <rect x="14" y="10" width="46" height="16" rx="4" fill="#168BFF" />
            <text x="18" y="22" fill="#000000" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Alex R.</text>
          </g>
        </svg>
      </div>

      {/* Bottom Sync State */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8293AA] pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>MULTI-CANVAS SYNC LIVE</span>
        </div>
        <span className="text-[#168BFF]">0.4ms PEER DRIFT</span>
      </div>
    </div>
  );
};
