import React from "react";

export const ExperienceVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[260px] bg-[#04101F] rounded-xl border border-white/[0.08] p-5 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-[circle_at_top_right,rgba(22, 139, 255,0.15)_0%,transparent_60%] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#8293AA] border-b border-white/[0.06] pb-2.5">
        <span className="text-[#168BFF] font-semibold">06 // SPATIAL & GLSL EXPERIENCES</span>
        <span>FPS: 60 LOCKED</span>
      </div>

      {/* 3D Spatial Geometry Vector Wireframe */}
      <div className="my-auto py-2 flex items-center justify-center">
        <svg viewBox="0 0 200 90" fill="none" className="w-48 h-auto">
          {/* 3D Tesseract / Cube Wireframe projection */}
          <polygon points="100,10 160,35 160,75 100,85 40,75 40,35" fill="rgba(22, 139, 255, 0.08)" stroke="#168BFF" strokeWidth="1.5" />
          <polygon points="100,28 135,45 135,68 100,75 65,68 65,45" fill="none" stroke="#4DE8FF" strokeWidth="1" strokeOpacity="0.8" />

          <line x1="100" y1="10" x2="100" y2="28" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="160" y1="35" x2="135" y2="45" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="160" y1="75" x2="135" y2="68" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="100" y1="85" x2="100" y2="75" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="40" y1="75" x2="65" y2="68" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="40" y1="35" x2="65" y2="45" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.5" />

          {/* Glowing central singularity */}
          <circle cx="100" cy="50" r="3" fill="#168BFF" className="animate-pulse" />
        </svg>
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#8293AA] pt-2 border-t border-white/[0.04]">
        <span>ENGINE: THREE.JS + CUSTOM SHADERS</span>
        <span className="text-emerald-400">STATUS: AWWWARDS LEVEL</span>
      </div>
    </div>
  );
};
