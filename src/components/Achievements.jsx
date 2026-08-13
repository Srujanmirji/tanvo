import { Trophy } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useContent } from '../lib/store';

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export default function Achievements() {
  const { achievements } = useContent();

  // A track-record section with nothing in it undercuts the pitch —
  // render nothing rather than an empty shell.
  if (achievements.length === 0) return null;

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="section-padding relative bg-slate-950/20"
    >
      <div className="glow-blob right-0 top-1/3 h-[420px] w-[420px] bg-emerald-500/5" />

      <div className="container-page relative z-10">
        <SectionHeading
          id="achievements-heading"
          eyebrow="Track record"
          title="Results We've"
          accent="Actually Delivered"
          lead="Numbers from real engagements — the outcomes clients measured after we shipped."
          className="reveal mb-16"
        />

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item, index) => {
            const when = formatDate(item.date);
            return (
              <li
                key={item.id}
                className="reveal glass-card flex flex-col gap-4 p-7"
                style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-heading text-4xl font-extrabold leading-none gradient-text">
                    {item.metric}
                  </span>
                  <Trophy
                    size={18}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-emerald-400/70"
                  />
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {item.metricLabel}
                  </p>
                  <h3 className="mb-2 font-heading text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">{item.detail}</p>
                </div>

                {when && (
                  <time
                    dateTime={item.date}
                    className="mt-auto pt-2 text-xs text-slate-600"
                  >
                    {when}
                  </time>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
