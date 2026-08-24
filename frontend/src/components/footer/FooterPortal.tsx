import React from "react";

const STREAKS = [
  { left: "12%", top: "18%", height: 64, delay: "0s" },
  { left: "26%", top: "8%", height: 44, delay: "1.4s" },
  { left: "38%", top: "30%", height: 30, delay: "2.6s" },
  { left: "63%", top: "10%", height: 52, delay: "0.7s" },
  { left: "78%", top: "24%", height: 38, delay: "2.1s" },
  { left: "89%", top: "14%", height: 58, delay: "3.2s" },
];

const MOTES = [
  { left: "18%", top: "44%" },
  { left: "31%", top: "22%" },
  { left: "47%", top: "13%" },
  { left: "58%", top: "37%" },
  { left: "72%", top: "19%" },
  { left: "84%", top: "42%" },
  { left: "93%", top: "31%" },
];

/**
 * The mark resting on a light portal. Pure CSS and SVG — the site already runs
 * one WebGL context and does not need a second one for a footer decoration.
 */
export const FooterPortal: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="footer-portal pointer-events-none relative h-[300px] w-full select-none md:h-[380px]"
    >
      {/* Vertical light streaks and drifting motes */}
      {STREAKS.map((streak) => (
        <span
          key={`${streak.left}-${streak.top}`}
          className="footer-streak"
          style={{
            left: streak.left,
            top: streak.top,
            height: `${streak.height}px`,
            animationDelay: streak.delay,
          }}
        />
      ))}

      {MOTES.map((mote) => (
        <span
          key={`${mote.left}-${mote.top}`}
          className="footer-mote"
          style={{ left: mote.left, top: mote.top }}
        />
      ))}

      {/* The mark, floating above the portal. Cropped the same way BrandLogo
          crops it, so only the glyph shows — not the full lockup. */}
      <span className="footer-portal-mark absolute left-1/2 top-[4%] block aspect-square h-[46%] -translate-x-1/2 overflow-hidden">
        <img
          src="/brand/tanvo-logo.png"
          alt=""
          draggable={false}
          className="pointer-events-none absolute max-w-none select-none"
          style={{ width: "190%", left: "-49%", top: "-31%" }}
        />
      </span>

      {/* Emission point where the mark meets the plane */}
      <span className="footer-portal-core absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2" />

      {/* Perspective rings */}
      <svg
        viewBox="0 0 600 260"
        fill="none"
        className="absolute inset-x-0 bottom-0 w-full"
      >
        <defs>
          <radialGradient id="footerRingFade" cx="50%" cy="12%" r="70%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="55%" stopColor="#3B82F6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="url(#footerRingFade)" strokeWidth="1">
          {[36, 68, 104, 146, 194].map((ry, index) => (
            <ellipse
              key={ry}
              cx="300"
              cy="34"
              rx={ry * 2.35}
              ry={ry * 0.52}
              opacity={0.95 - index * 0.12}
            />
          ))}

          {/* Radial spokes running out along the plane */}
          {[-72, -48, -26, 0, 26, 48, 72].map((offset) => (
            <line
              key={offset}
              x1="300"
              y1="34"
              x2={300 + offset * 6.2}
              y2="235"
              opacity="0.3"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
