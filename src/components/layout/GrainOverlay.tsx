import React from "react";

export const GrainOverlay: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      aria-hidden="true"
    >
      {/* Film grain layer */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Atmospheric vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(5,5,5,0.75)_100%]" />
    </div>
  );
};
