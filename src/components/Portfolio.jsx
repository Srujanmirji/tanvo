import { useMemo, useState } from 'react';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useContent } from '../lib/store';
import { CATEGORIES } from '../lib/constants';

const FILTERS = ['All', ...CATEGORIES];

/** Prefer WebP, fall back to the original for older browsers. */
function toWebp(src) {
  return src.replace(/\.(png|jpe?g)$/i, '.webp');
}

function StatusPill({ status }) {
  if (status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </span>
        In build
      </span>
    );
  }
  return (
    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
      Shipped
    </span>
  );
}

function ProjectCard({ project }) {
  const { title, category, desc, image, link, tech, status } = project;

  return (
    <li className="reveal glass-card group flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/5 bg-slate-900">
        {image ? (
          <picture>
            <source srcSet={toWebp(image)} type="image/webp" />
            <img
              src={image}
              alt=""
              width={900}
              height={900}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </picture>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-700">
            <FolderOpen size={40} aria-hidden="true" />
          </div>
        )}

        <div className="absolute left-4 top-4">
          <StatusPill status={status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {category}
          </span>
          <h3 className="mb-3 font-heading text-xl font-bold text-white">{title}</h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-400">{desc}</p>

          {tech.length > 0 && (
            <ul className="mb-6 flex flex-wrap gap-2">
              {tech.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-white/5 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-500"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors group-hover:text-cyan-400"
          >
            {/* The visible label is generic, so name the project for screen readers. */}
            View case study
            <span className="sr-only"> — {title}</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ) : (
          <span className="mt-auto text-xs uppercase tracking-wider text-slate-600">
            Case study coming soon
          </span>
        )}
      </div>
    </li>
  );
}

export default function Portfolio() {
  const { projects } = useContent();
  const [filter, setFilter] = useState('All');

  // Upcoming work is internal pipeline — it stays in the admin board and
  // is deliberately not published here.
  const publicProjects = useMemo(
    () => projects.filter((p) => p.status !== 'upcoming'),
    [projects],
  );

  const visible = useMemo(
    () =>
      filter === 'All'
        ? publicProjects
        : publicProjects.filter((p) => p.category === filter),
    [publicProjects, filter],
  );

  // Only offer filters that would actually return something.
  const availableFilters = useMemo(
    () =>
      FILTERS.filter(
        (f) => f === 'All' || publicProjects.some((p) => p.category === f),
      ),
    [publicProjects],
  );

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="section-padding relative"
    >
      <div className="glow-blob bottom-0 right-10 h-[400px] w-[400px] bg-cyan-500/5" />

      <div className="container-page relative z-10">
        <div className="reveal mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="portfolio-heading"
            eyebrow="Our portfolio"
            title="Featured"
            accent="Case Studies"
            align="left"
          />

          {availableFilters.length > 1 && (
            <div
              role="group"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-2 rounded-xl border border-white/5 bg-slate-950/60 p-1.5 backdrop-blur-md"
            >
              {availableFilters.map((cat) => {
                const isActive = filter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                    aria-pressed={isActive}
                    className={`rounded-lg px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-all duration-300 md:text-sm ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-slate-950 shadow-md shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {visible.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
        ) : (
          <p className="glass-card p-12 text-center text-sm text-slate-400">
            No published work in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
