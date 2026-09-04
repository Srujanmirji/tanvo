import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Served from public/ rather than imported, so the no-JS fallback markup in
// index.html can point at the exact same file instead of a second copy.
const heroTeamImg = '/assets/images/tanvo-hero-team.webp';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const diagonalBgRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const serifLineRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsWrapRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;

    if (isReducedMotion) {
      // Ensure all elements are visible immediately without transform
      if (imageWrapRef.current) imageWrapRef.current.style.clipPath = 'none';
      if (panelRef.current) panelRef.current.style.opacity = '1';
      return;
    }

    // Every element below starts at opacity 0 / translated, and only this
    // timeline makes them visible. If it is ever created but not run to the
    // end, the hero stays blank — so keep a handle on it for the watchdog.
    let entranceTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      // Total entrance timeline carefully orchestrated for ~1.5–1.6 seconds
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });
      entranceTl = tl;

      // 1. Hero image reveals from right to left using a clipped mask (0s -> 0.8s)
      tl.fromTo(
        imageWrapRef.current,
        { clipPath: isDesktop ? 'inset(0 0 0 100%)' : 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.8, ease: 'power3.inOut' }
      );

      // 2. The diagonal black panel slides into position (0.15s -> 0.85s)
      tl.fromTo(
        panelRef.current,
        { x: isDesktop ? '-100%' : 0, y: isDesktop ? 0 : -25, opacity: 0 },
        { x: '0%', y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0.15
      );

      // 3. 01 / INTRO fades upward (0.35s -> 0.75s)
      tl.fromTo(
        labelRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.35
      );

      // 4. Each white headline line reveals individually from hidden overflow wrapper (0.45s -> 1.05s)
      tl.fromTo(
        headingLinesRef.current,
        { y: '115%' },
        { y: '0%', duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        0.45
      );

      // 5. "people remember." reveals with a soft upward motion (0.7s -> 1.25s)
      tl.fromTo(
        serifLineRef.current,
        { y: '120%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.55, ease: 'power3.out' },
        0.7
      );

      // 6. Supporting copy fades in (0.85s -> 1.3s)
      tl.fromTo(
        descRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        0.85
      );

      // 7. Buttons appear with small stagger (1.0s -> 1.48s)
      if (buttonsWrapRef.current) {
        const buttons = buttonsWrapRef.current.children;
        tl.fromTo(
          buttons,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          1.0
        );
      }

      // 8. Location enters last (1.15s -> 1.55s)
      tl.fromTo(
        locationRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        1.15
      );

      // Scroll animation with ScrollTrigger (desktop only)
      if (isDesktop && heroRef.current) {
        // Subtle image zoom from scale(1) to scale(1.05) & 4% vertical parallax
        gsap.to(imageRef.current, {
          scale: 1.05,
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top+=80',
            end: 'bottom top',
            scrub: 0.5,
          },
        });

        // Gradually shift the diagonal divide toward the left
        if (diagonalBgRef.current) {
          gsap.to(diagonalBgRef.current, {
            xPercent: -4,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top+=80',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }

        // Reduce content opacity slightly before entering the next section
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            opacity: 0.4,
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top+=80',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
      }
    }, heroRef);

    // Safety net for a wedged ticker: if the entrance has not finished a
    // couple of seconds after mount while the tab is actually being looked at,
    // snap it to its end state. A backgrounded tab is skipped on purpose —
    // rAF is simply paused there and the animation plays properly on focus,
    // so forcing it would rob those visitors of the entrance for no reason.
    const entranceWatchdog = window.setTimeout(() => {
      if (document.visibilityState === 'visible' && entranceTl && entranceTl.progress() < 1) {
        entranceTl.progress(1);
      }
    }, 2500);

    return () => {
      window.clearTimeout(entranceWatchdog);
      ctx.revert();
    };
  }, []);

  // Subtle magnetic cursor response on primary button (desktop)
  const handlePrimaryMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    gsap.to(e.currentTarget, { x, y, duration: 0.18, ease: 'power1.out' });
  };

  const handlePrimaryMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
  };

  const handleOpenProjectModal = () => {
    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const handleExploreWork = () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="intro"
      ref={heroRef}
      className="relative w-full overflow-hidden bg-[#0B0B0D] min-h-[calc(100svh-88px)] flex flex-col md:flex-row items-stretch border-b border-white/[0.08]"
      aria-label="Tanvo agency hero intro"
    >
      {/* --------------------------------------------------------------------
          Left: Deep Charcoal Content Panel (43% on desktop)
          -------------------------------------------------------------------- */}
      <div
        ref={panelRef}
        className="relative z-10 w-full md:w-[46%] lg:w-[43%] flex flex-col justify-between py-8 px-6 sm:py-10 sm:px-10 md:py-10 md:px-12 lg:py-12 lg:px-14 xl:px-16 shrink-0 bg-[#0B0B0D]"
      >
        {/* Sharp Diagonal / Slanted Edge on Desktop Overlapping Photo */}
        <div
          ref={diagonalBgRef}
          aria-hidden="true"
          className="hidden md:block absolute inset-y-0 left-0 w-[124%] lg:w-[126%] bg-[#0B0B0D] pointer-events-none z-[-1]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 84% 100%, 0 100%)',
          }}
        />

        {/* Subtle Black-to-Transparent Seam Gradient */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-y-0 right-[-32px] w-28 pointer-events-none z-[-1] bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent"
        />

        <div ref={contentRef} className="flex flex-col gap-4 sm:gap-5 md:gap-5 my-auto">
          {/* Label: 01 / INTRO */}
          <div
            ref={labelRef}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#38BDF8]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2080FC] shadow-[0_0_8px_rgba(32,128,252,0.8)]" aria-hidden="true" />
            <span>01 / INTRO</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sans text-[clamp(2.4rem,4.2vw,3.9rem)] font-extrabold text-[#F4F1EA] tracking-[-0.035em] leading-[0.96] flex flex-col">
            <div className="overflow-hidden py-0.5">
              <span
                ref={(el) => (headingLinesRef.current[0] = el)}
                className="block"
              >
                We build
              </span>
            </div>
            <div className="overflow-hidden py-0.5">
              <span
                ref={(el) => (headingLinesRef.current[1] = el)}
                className="block"
              >
                digital
              </span>
            </div>
            <div className="overflow-hidden py-0.5">
              <span
                ref={(el) => (headingLinesRef.current[2] = el)}
                className="block"
              >
                experiences
              </span>
            </div>
            <div className="overflow-hidden pt-0.5 pb-1">
              <span
                ref={serifLineRef}
                className="block font-serif italic font-normal text-[#2080FC] tracking-tight"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  color: '#2080FC',
                }}
              >
                people remember.
              </span>
            </div>
          </h1>

          {/* Supporting Copy */}
          <p
            ref={descRef}
            className="text-[clamp(0.95rem,1.15vw,1.1rem)] text-[#A7A39C] font-normal leading-[1.6] max-w-[440px]"
          >
            Strategy, design and development for ambitious brands.
          </p>

          {/* Buttons */}
          <div
            ref={buttonsWrapRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
          >
            {/* Secondary Button: Explore our work */}
            <button
              type="button"
              onClick={handleExploreWork}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-transparent border border-white/[0.12] text-[#F4F1EA] font-semibold text-sm tracking-wide transition-all duration-200 hover:border-[#2080FC]/60 hover:bg-white/[0.03] active:scale-[0.98]"
            >
              <span>Explore our work</span>
              <svg
                className="w-3.5 h-3.5 text-[#F4F1EA] transition-all duration-200 group-hover:text-[#38BDF8] group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            {/* Primary Button: Start a project */}
            <button
              type="button"
              data-open-modal="project"
              onClick={handleOpenProjectModal}
              onMouseMove={handlePrimaryMouseMove}
              onMouseLeave={handlePrimaryMouseLeave}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#2080FC] text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-[#1258F7] hover:shadow-[0_4px_22px_rgba(32,128,252,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#2080FC',
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(32, 128, 252, 0.35)',
              }}
            >
              <span>Start a project</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Location Stamp */}
        <div
          ref={locationRef}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#A7A39C] font-semibold pt-6 sm:pt-8"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#2080FC] shadow-[0_0_8px_rgba(32,128,252,0.8)]"
            aria-hidden="true"
          />
          <span>Hubli–Dharwad, Karnataka, India</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          Right: Full-Height Team Photograph (57% on desktop)
          -------------------------------------------------------------------- */}
      <div
        ref={imageWrapRef}
        className="relative w-full md:absolute md:top-0 md:right-0 md:bottom-0 md:w-[58%] lg:w-[60%] md:h-full overflow-hidden shrink-0 z-0 h-[340px] sm:h-[420px]"
      >
        <img
          ref={imageRef}
          src={heroTeamImg}
          alt="Tanvo creative team collaborating on a digital product"
          loading="eager"
          {...({ fetchpriority: 'high' } as any)}
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center md:object-[65%_center] will-change-transform"
        />

        {/* Subtle Dark Gradient Overlay for Readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-t md:bg-gradient-to-r from-[#0B0B0D]/85 via-[#0B0B0D]/20 to-transparent"
        />

        {/* Ambient Top & Bottom Edge Softening */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-16 pointer-events-none bg-gradient-to-b from-[#0B0B0D]/50 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-gradient-to-t from-[#0B0B0D] to-transparent"
        />
      </div>
    </section>
  );
};

export default Hero;
