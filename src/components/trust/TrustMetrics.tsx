import React, { useEffect, useRef } from "react";
import { trustCapabilitiesData } from "../../data/metrics";
import { TrustPrecisionGridVisual } from "./TrustPrecisionGridVisual";
import { initTrustAnimations } from "../../animations/approachTrustTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { scrollToTarget } from "../../hooks/useLenis";
import { ArrowDown } from "lucide-react";

export const TrustMetrics: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || !headerRef.current || !cardRefs.current.length) return;

    const cleanup = initTrustAnimations({
      containerRef: containerRef.current,
      headerRef: headerRef.current,
      capabilityCards: cardRefs.current,
      prefersReducedMotion,
    });

    return cleanup;
  }, [prefersReducedMotion]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget("#contact");
  };

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative z-10 py-32 md:py-48 border-t border-white/[0.08] bg-[#000000]"
    >
      <div className="site-container">
        {/* Editorial Section Header */}
        <div ref={headerRef} className="grid-12 mb-24 md:mb-32 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div className="trust-badge flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4DE8FF] shadow-[0_0_8px_#4DE8FF]" />
              <span className="text-label text-[#4DE8FF] tracking-[0.2em]">
                12 / TRUST
              </span>
            </div>

            <h2 className="text-section-heading text-[#F5FAFF] uppercase font-semibold select-none">
              <span className="trust-heading-line block overflow-hidden">
                BUILT FOR
              </span>
              <span className="trust-heading-line block overflow-hidden text-[#4DE8FF]">
                REAL RESULTS.
              </span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-5 mt-8 lg:mt-0">
            <p className="trust-copy text-body text-[#8293AA] max-w-md leading-relaxed">
              Good design matters. Good engineering matters. But the outcome matters most.
            </p>
          </div>
        </div>

        {/* 2-Column Layout: Capability Cards + Precision Grid Visual */}
        <div className="grid-12 items-start gap-12 lg:gap-16 mb-28">
          {/* Left: 4 Large Editorial Capability Cards */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
            {trustCapabilitiesData.map((cap, index) => (
              <article
                key={cap.number}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="group p-8 md:p-10 rounded-2xl bg-[#06111F]/40 border border-white/[0.08] hover:border-[#4DE8FF]/40 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#8293AA]">
                    {cap.number} // {cap.headline}
                  </span>
                  <span className="text-xs font-mono text-[#4DE8FF] px-2.5 py-0.5 rounded-full bg-[#4DE8FF]/10 border border-[#4DE8FF]/20">
                    {cap.capabilityBadge}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-sans font-bold text-[#F5FAFF] group-hover:text-[#4DE8FF] transition-colors">
                    {cap.pillar}
                  </h3>
                </div>

                <p className="text-sm text-[#8293AA] leading-relaxed mb-6">
                  {cap.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.04]">
                  {cap.standards.map((std) => (
                    <span
                      key={std}
                      className="text-[11px] font-mono text-[#F5FAFF]/80 px-2.5 py-1 rounded-sm bg-white/[0.03] border border-white/[0.05]"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Right: Sticky Precision Engineering Matrix Visual */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-36">
            <TrustPrecisionGridVisual />
          </div>
        </div>

        {/* Section End Transition Bridge into Final CTA */}
        <div className="pt-20 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-3">
              NEXT STEP // INITIATION
            </span>
            <div className="text-3xl md:text-5xl font-sans font-bold text-[#F5FAFF] tracking-tight">
              READY TO <span className="text-[#168BFF]">BUILD SOMETHING</span> REAL?
            </div>
            <p className="text-body text-[#8293AA] max-w-md mt-4">
              Bring us the idea. We'll help you turn it into reality.
            </p>
          </div>

          <a
            href="#contact"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8293AA] hover:text-[#F5FAFF] transition-colors py-2 group"
          >
            <span>START YOUR PROJECT</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
