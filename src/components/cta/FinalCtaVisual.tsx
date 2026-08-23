import React from "react";

export const FinalCtaVisual: React.FC = () => {
  return (
    <div className="w-full max-w-sm mx-auto mb-10 flex items-center justify-center relative pointer-events-none">
      {/* Radiant ambient bloom */}
      <div className="absolute w-48 h-48 bg-radial-[circle,rgba(22, 139, 255,0.25)_0%,transparent_70%] blur-2xl pointer-events-none" />

      <svg viewBox="0 0 200 200" fill="none" className="w-40 h-40 relative z-10 transition-transform duration-700 ease-out">
        <defs>
          <linearGradient id="ctaHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#168BFF" />
            <stop offset="50%" stopColor="#F5FAFF" />
            <stop offset="100%" stopColor="#4DE8FF" />
          </linearGradient>
        </defs>

        {/* Concentric expanding geometric orbital rings */}
        <circle cx="100" cy="100" r="75" stroke="rgba(245, 250, 255, 0.08)" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="55" stroke="rgba(22, 139, 255, 0.2)" />

        {/* Crystalline Hexagon Portal */}
        <polygon
          points="100,25 165,62 165,138 100,175 35,138 35,62"
          stroke="url(#ctaHexGrad)"
          strokeWidth="1.5"
          fill="rgba(7, 26, 48, 0.4)"
        />

        {/* Internal convergence lines */}
        <line x1="100" y1="25" x2="100" y2="175" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="35" y1="62" x2="165" y2="138" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="35" y1="138" x2="165" y2="62" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />

        {/* Central Luminous Singularity */}
        <circle cx="100" cy="100" r="8" fill="#168BFF" className="animate-pulse" />
        <circle cx="100" cy="100" r="3" fill="#F5FAFF" />
      </svg>
    </div>
  );
};
