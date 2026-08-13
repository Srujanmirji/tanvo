import { useId } from 'react';

/**
 * The Tanvo mark.
 *
 * Gradient ids are generated per instance with useId. They used to be
 * hardcoded, so header + footer + loader put three elements with
 * id="topCurveGrad" in the document — invalid HTML, and the gradients
 * break outright if the first instance unmounts.
 *
 * Paths carry `.logo-path` classes so the loader can stagger them in
 * without needing its own copy of the artwork.
 */
export default function Logo({
  className = 'h-10 w-10',
  showText = true,
  textClass = 'text-xl font-bold',
  animated = false,
}) {
  const uid = useId().replace(/:/g, '');
  const topId = `top-${uid}`;
  const foldId = `fold-${uid}`;
  const stemId = `stem-${uid}`;

  return (
    <div className="group flex select-none items-center gap-3">
      <svg
        className={`${className} logo-mark ${
          animated ? 'logo-mark--animated' : ''
        } transition-transform duration-500 ease-out group-hover:rotate-6 group-hover:scale-110`}
        viewBox="0 0 200 200"
        fill="none"
        role="img"
        aria-label="Tanvo Tech"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={topId} x1="50" y1="30" x2="160" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3bf2ff" />
            <stop offset="50%" stopColor="#00c0ff" />
            <stop offset="100%" stopColor="#0072ff" />
          </linearGradient>

          <linearGradient id={foldId} x1="120" y1="40" x2="80" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0080ff" />
            <stop offset="100%" stopColor="#003cd2" />
          </linearGradient>

          <linearGradient id={stemId} x1="80" y1="80" x2="110" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#005df8" />
            <stop offset="100%" stopColor="#002bb0" />
          </linearGradient>
        </defs>

        <g className="logo-group">
          {/* 1. Left loop sweeping to top-right */}
          <path
            className="logo-path logo-path--1"
            d="M 52 70
               C 35 60, 35 45, 52 35
               C 70 25, 120 25, 148 25
               C 162 25, 170 32, 170 42
               C 170 52, 160 58, 146 58
               L 80 58
               C 75 58, 70 65, 75 75
               Z"
            fill={`url(#${topId})`}
          />

          {/* 2. Middle folding transition */}
          <path
            className="logo-path logo-path--2"
            d="M 80 58
               C 85 58, 125 58, 128 58
               C 128 58, 128 88, 110 115
               C 100 128, 92 110, 80 85
               Z"
            fill={`url(#${foldId})`}
          />

          {/* 3. Vertical stem, tapering */}
          <path
            className="logo-path logo-path--3"
            d="M 90 75
               L 128 58
               L 128 120
               C 128 135, 112 155, 96 175
               C 92 180, 88 175, 88 165
               L 88 95
               Z"
            fill={`url(#${stemId})`}
          />
        </g>
      </svg>

      {showText && (
        <span
          className={`${textClass} logo-word font-heading tracking-wide text-white transition-colors duration-300 group-hover:text-cyan-400`}
        >
          Tanvo<span className="font-light text-cyan-400">Tech</span>
        </span>
      )}
    </div>
  );
}
