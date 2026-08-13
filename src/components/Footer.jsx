import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Github, Linkedin, Twitter } from './BrandIcons';
import Logo from './Logo';
import { NAV_ITEMS, SITE } from '../lib/constants';

const SOCIALS = [
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'twitter', label: 'X (Twitter)', icon: Twitter },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
];

export default function Footer() {
  // Only render socials that have a real URL configured — linking to a
  // bare github.com reads as unfinished.
  const socials = SOCIALS.filter(({ key }) => SITE.socials[key]);

  const scrollToTop = (event) => {
    event.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.getElementById('home')?.focus?.();
  };

  return (
    <footer className="relative border-t border-white/5 bg-slate-950 py-16">
      <div className="absolute right-6 top-0 -translate-y-1/2 md:right-12">
        <a
          href="#home"
          onClick={scrollToTop}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-400 shadow-md shadow-black/50 transition-all duration-300 hover:border-cyan-400/50 hover:text-cyan-400"
          aria-label="Back to top"
        >
          <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>

      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 border-b border-white/5 pb-12 md:grid-cols-12 md:gap-16">
          <div className="flex flex-col gap-6 md:col-span-6">
            <Logo className="h-9 w-9" showText />
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              We design and build robust digital platforms, automated workflows, and
              custom AI tooling — architecture that scales with you rather than against
              you.
            </p>

            {socials.length > 0 && (
              <ul className="flex gap-4">
                {socials.map(({ key, label, icon: Icon }) => (
                  <li key={key}>
                    <a
                      href={SITE.socials[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${SITE.name} on ${label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-slate-900 text-slate-400 transition-all hover:border-cyan-400/30 hover:text-cyan-400"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="mb-6 font-heading text-xs font-bold uppercase tracking-widest text-white">
              Sitemap
            </h2>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li>
                <a href="#home" className="hover:text-cyan-400">
                  Home
                </a>
              </li>
              {NAV_ITEMS.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className="hover:text-cyan-400">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="mb-6 font-heading text-xs font-bold uppercase tracking-widest text-white">
              Tech stack focus
            </h2>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              MERN, Next.js, React Native, Python automation pipelines, and cloud
              migrations.
            </p>
            <span className="rounded-md border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1 font-heading text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              MERN stack recommended
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms of service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
