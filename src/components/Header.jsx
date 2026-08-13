import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { NAV_ITEMS } from '../lib/constants';
import { useModalBehavior } from '../hooks/useModalBehavior';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const panelRef = useModalBehavior(isMenuOpen, closeMenu);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight the nav item for whichever section is currently in view.
  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      Boolean,
    );
    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color] duration-300 ${
        isScrolled
          ? 'py-4 bg-void/80 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_-15px_rgb(3_3_7/0.7)]'
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-page flex items-center justify-between">
        <a href="#home" className="flex items-center" aria-label="Tanvo Tech — home">
          <Logo className="h-10 w-10 xl:h-12 xl:w-12" showText textClass="hidden text-lg font-bold sm:block xl:text-xl" />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex xl:gap-10">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'true' : undefined}
              className={`text-sm font-medium uppercase tracking-wide transition-colors xl:text-base ${
                activeSection === id
                  ? 'text-cyan-400'
                  : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex">
          <a href="#contact" className="btn-primary px-6 py-2.5 text-sm xl:px-8 xl:py-3 xl:text-base">
            Start a Project <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 text-white transition-colors hover:text-cyan-400 md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Backdrop — clicking outside closes, as users expect. */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/*
        `inert` when closed removes the panel from the tab order and the
        accessibility tree entirely — previously these links stayed
        focusable while translated off-screen.
      */}
      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
        inert={!isMenuOpen}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-sm flex-col justify-between border-l border-white/10 bg-slate-950/95 p-8 shadow-2xl backdrop-blur-2xl transition-transform duration-500 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <Logo className="h-8 w-8" showText />
            <button
              type="button"
              onClick={closeMenu}
              className="p-1 text-white hover:text-cyan-400"
              aria-label="Close navigation menu"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-col gap-6">
            {NAV_ITEMS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={closeMenu}
                className="text-lg font-semibold uppercase tracking-wide text-slate-200 transition-colors hover:text-cyan-400"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pb-2">
          <a href="#contact" onClick={closeMenu} className="btn-primary w-full py-3">
            Start a Project <ArrowRight size={16} aria-hidden="true" />
          </a>
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Tanvo Tech
          </p>
        </div>
      </div>
    </header>
  );
}
