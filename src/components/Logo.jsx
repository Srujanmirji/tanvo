/**
 * The Tanvo Tech Master Logo Component.
 *
 * Renders the new Tanvo logo vector mark consistently across:
 * - Public Marketing Header & Footer
 * - Hero 3D section & Centerpiece
 * - Client Portal Login & Workspace
 * - Operations Admin Hub & Password Gate
 * - Route Suspense Loading Fallback
 * - Legal & 404 Pages
 */
export default function Logo({
  className = 'h-10 w-10',
  showText = true,
  textClass = 'text-xl font-bold',
  animated = false,
}) {
  return (
    <div className="group flex select-none items-center gap-3">
      <img
        src="/tanvo-logo.svg"
        alt="Tanvo Tech"
        className={`${className} logo-mark ${
          animated ? 'logo-mark--animated' : ''
        } object-contain transition-transform duration-500 ease-out group-hover:rotate-6 group-hover:scale-110`}
      />

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
