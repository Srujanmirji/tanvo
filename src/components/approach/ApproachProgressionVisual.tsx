import React from "react";

interface ApproachProgressionVisualProps {
  activeStep: number; // 0, 1, 2, or 3
}

export const ApproachProgressionVisual: React.FC<ApproachProgressionVisualProps> = ({ activeStep }) => {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[380px] bg-[#04101F] rounded-2xl border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(22, 139, 255,0.1)_0%,transparent_65%] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#F5FAFF_1px,transparent_1px),linear-gradient(to_bottom,#F5FAFF_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-3">
        <span className="text-[#168BFF] font-semibold tracking-widest">
          METHODOLOGY // PHASE 0{activeStep + 1}
        </span>
        <span className="text-[#4DE8FF]">
          {activeStep === 0 ? "IDEATION" : activeStep === 1 ? "SYNTHESIS" : activeStep === 2 ? "CONSTRUCTION" : "DEPLOYMENT"}
        </span>
      </div>

      {/* Evolving Geometric SVG Diagram */}
      <div className="my-auto py-6 flex items-center justify-center">
        <svg viewBox="0 0 280 200" fill="none" className="w-full max-w-xs h-auto transition-all duration-700 ease-out">
          <defs>
            <radialGradient id="approachCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#168BFF" stopOpacity="1" />
              <stop offset="60%" stopColor="#168BFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Coordinate Axes */}
          <line x1="20" y1="100" x2="260" y2="100" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />
          <line x1="140" y1="20" x2="140" y2="180" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />

          {/* Stage 0 (THINK): Concentrated point + radiating field */}
          <circle
            cx="140"
            cy="100"
            r={activeStep === 0 ? "24" : "12"}
            fill="url(#approachCoreGrad)"
            className="transition-all duration-700"
          />
          <circle
            cx="140"
            cy="100"
            r="4"
            fill="#F5FAFF"
            className="transition-all duration-500"
          />

          {/* Stage 1 (DESIGN): Structure wireframe bounds */}
          <polygon
            points="140,40 200,80 200,140 140,170 80,140 80,80"
            fill={activeStep >= 1 ? "rgba(22, 139, 255, 0.06)" : "transparent"}
            stroke={activeStep >= 1 ? "#168BFF" : "rgba(245, 250, 255, 0.1)"}
            strokeWidth="1.5"
            strokeDasharray={activeStep >= 1 ? "none" : "4 4"}
            className="transition-all duration-700"
          />

          {/* Stage 2 (BUILD): Isometric inner lattice & node systems */}
          {activeStep >= 2 && (
            <g className="transition-opacity duration-700">
              <line x1="140" y1="40" x2="140" y2="100" stroke="#4DE8FF" strokeWidth="1.5" />
              <line x1="200" y1="80" x2="140" y2="100" stroke="#4DE8FF" strokeWidth="1.5" />
              <line x1="80" y1="80" x2="140" y2="100" stroke="#4DE8FF" strokeWidth="1.5" />
              <line x1="140" y1="170" x2="140" y2="100" stroke="#168BFF" strokeWidth="1.5" />
              <line x1="200" y1="140" x2="140" y2="100" stroke="#168BFF" strokeWidth="1.5" />
              <line x1="80" y1="140" x2="140" y2="100" stroke="#168BFF" strokeWidth="1.5" />

              {/* Node highlights */}
              <circle cx="140" cy="40" r="3" fill="#4DE8FF" />
              <circle cx="200" cy="80" r="3" fill="#168BFF" />
              <circle cx="80" cy="80" r="3" fill="#168BFF" />
              <circle cx="140" cy="170" r="3" fill="#4DE8FF" />
            </g>
          )}

          {/* Stage 3 (LAUNCH): Convergence diamond & glowing burst */}
          {activeStep >= 3 && (
            <g className="transition-opacity duration-700">
              <polygon
                points="140,25 220,100 140,175 60,100"
                fill="none"
                stroke="#F5FAFF"
                strokeWidth="1.5"
                strokeOpacity="0.85"
              />
              <circle cx="140" cy="100" r="32" stroke="#4DE8FF" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="140" cy="100" r="6" fill="#F5FAFF" />
            </g>
          )}
        </svg>
      </div>

      {/* Footer telemetry */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-3 border-t border-white/[0.04]">
        <span>CONTINUITY: UNBROKEN</span>
        <span className="text-[#168BFF]">
          {activeStep === 0
            ? "CLARIFYING PREMISE"
            : activeStep === 1
            ? "SHAPING INTERACTION"
            : activeStep === 2
            ? "ENGINEERING SYSTEMS"
            : "PRODUCTION LAUNCH"}
        </span>
      </div>
    </div>
  );
};
