/**
 * The eyebrow + heading + lead pattern used by every marketing section.
 * `accent` is rendered inside the heading with the brand gradient.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  lead,
  align = 'center',
  id,
  className = '',
}) {
  const isCentered = align === 'center';

  return (
    <div
      className={`${isCentered ? 'mx-auto max-w-2xl text-center xl:max-w-3xl' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 md:text-sm">
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className="mb-6 mt-3 font-heading text-3xl font-extrabold text-white md:text-5xl xl:text-6xl"
      >
        {title} {accent && <span className="gradient-text">{accent}</span>}
      </h2>
      {lead && (
        <p className="text-sm leading-relaxed text-slate-400 md:text-base xl:text-lg">
          {lead}
        </p>
      )}
    </div>
  );
}
