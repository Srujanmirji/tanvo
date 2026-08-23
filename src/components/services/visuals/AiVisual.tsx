import React from "react";

export const AiVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[260px] bg-[#04101F] rounded-xl border border-white/[0.08] p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(22, 139, 255,0.18)_0%,transparent_60%] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-2.5">
        <span className="text-[#168BFF] font-semibold">05 // NEURAL SYSTEM INTEGRATION</span>
        <span>LATENT DIM: 8192</span>
      </div>

      {/* Neural Pipeline Diagram */}
      <div className="my-auto py-2">
        <svg viewBox="0 0 340 100" fill="none" className="w-full h-auto">
          {/* Synapse Lines */}
          <line x1="40" y1="30" x2="120" y2="20" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="40" y1="30" x2="120" y2="50" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="40" y1="70" x2="120" y2="50" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="40" y1="70" x2="120" y2="80" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />

          <line x1="120" y1="20" x2="220" y2="50" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="120" y1="50" x2="220" y2="50" stroke="#4DE8FF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="120" y1="80" x2="220" y2="50" stroke="#168BFF" strokeWidth="1.5" strokeOpacity="0.6" />

          <line x1="220" y1="50" x2="300" y2="50" stroke="#F5FAFF" strokeWidth="2" strokeDasharray="3 3" />

          {/* Layer 1 Nodes (Input) */}
          <circle cx="40" cy="30" r="8" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
          <circle cx="40" cy="70" r="8" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />

          {/* Layer 2 Nodes (Weights) */}
          <circle cx="120" cy="20" r="9" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />
          <circle cx="120" cy="50" r="10" fill="#071A30" stroke="#4DE8FF" strokeWidth="2" />
          <circle cx="120" cy="80" r="9" fill="#071A30" stroke="#168BFF" strokeWidth="1.5" />

          {/* Layer 3 Node (Agent Orchestration) */}
          <circle cx="220" cy="50" r="16" fill="#071A30" stroke="#168BFF" strokeWidth="2" />
          <text x="220" y="53" textAnchor="middle" fill="#168BFF" fontSize="7" fontFamily="Space Grotesk" fontWeight="bold">AGENT</text>

          {/* Layer 4 Node (Inference Output) */}
          <circle cx="300" cy="50" r="12" fill="#071A30" stroke="#F5FAFF" strokeWidth="1.5" />
          <text x="300" y="53" textAnchor="middle" fill="#F5FAFF" fontSize="7" fontFamily="Space Grotesk" fontWeight="bold">OUT</text>
        </svg>
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-2 border-t border-white/[0.04]">
        <span>ORCHESTRATION: AGENTIC MESH</span>
        <span className="text-[#168BFF]">INFERENCE: STREAMING</span>
      </div>
    </div>
  );
};
