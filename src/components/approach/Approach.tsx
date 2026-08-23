import React, { useState, useEffect, useRef } from "react";
import { approachStepsData } from "../../data/metrics";
import { ApproachProgressionVisual } from "./ApproachProgressionVisual";
import { initApproachAnimations } from "../../animations/approachTrustTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export const Approach: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<HTMLElement[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || !headerRef.current || !stepRefs.current.length) return;

    const cleanup = initApproachAnimations({
      containerRef: containerRef.current,
      headerRef: headerRef.current,
      stepRefs: stepRefs.current,
      progressBarRef: progressBarRef.current || undefined,
      onActiveStepChange: (idx) => setActiveStepIndex(idx),
      prefersReducedMotion,
    });

    return cleanup;
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      id="approach"
      className="relative z-10 py-32 md:py-48 border-t border-white/[0.08] bg-[#000000]"
    >
      <div className="site-container">
        {/* Editorial Section Header */}
        <div ref={headerRef} className="grid-12 mb-24 md:mb-32 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div className="approach-badge flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#168BFF] shadow-[0_0_8px_#168BFF]" />
              <span className="text-label text-[#168BFF] tracking-[0.2em]">
                11 / APPROACH
              </span>
            </div>

            <h2 className="text-section-heading text-[#F5FAFF] uppercase font-semibold select-none">
              <span className="approach-heading-line block overflow-hidden">
                HOW WE
              </span>
              <span className="approach-heading-line block overflow-hidden text-[#168BFF]">
                MAKE IT HAPPEN.
              </span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-5 mt-8 lg:mt-0">
            <p className="approach-copy text-body text-[#8293AA] max-w-md leading-relaxed">
              A clear process keeps ambitious ideas moving from first conversation to final launch.
            </p>
          </div>
        </div>

        {/* 2-Column Connected Flow Layout */}
        <div className="grid-12 items-start gap-12 lg:gap-16">
          {/* Left Column: Connected Steps with Vertical Progress Line */}
          <div className="col-span-12 lg:col-span-7 relative">
            {/* Thin Connecting Vertical Progress Line */}
            <div className="absolute left-[15px] top-6 bottom-6 w-[1px] bg-white/[0.1] hidden md:block">
              <div
                ref={progressBarRef}
                className="w-full h-full bg-[#168BFF] origin-top will-change-transform"
              />
            </div>

            <div className="flex flex-col gap-12 md:gap-16 md:pl-12">
              {approachStepsData.map((step, index) => {
                const isActive = activeStepIndex === index;

                return (
                  <article
                    key={step.step}
                    ref={(el) => {
                      if (el) stepRefs.current[index] = el;
                    }}
                    className={`approach-step-card group relative p-8 rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? "bg-[#06111F]/80 border-[#168BFF]/40 shadow-[0_0_30px_rgba(22, 139, 255,0.06)]"
                        : "bg-[#06111F]/30 border-white/[0.06] hover:border-white/[0.15]"
                    }`}
                  >
                    {/* Step Number Dot on connecting line (Desktop) */}
                    <div
                      className={`hidden md:flex absolute -left-12 top-8 -translate-x-1/2 w-8 h-8 rounded-full border items-center justify-center text-xs font-mono transition-all duration-500 ${
                        isActive
                          ? "bg-[#168BFF] text-[#000000] border-transparent font-bold scale-110 shadow-[0_0_15px_#168BFF]"
                          : "bg-[#000000] text-[#8293AA] border-white/[0.15]"
                      }`}
                    >
                      {step.step}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono tracking-widest text-[#168BFF] uppercase">
                          PHASE {step.step} // {step.tagline}
                        </span>
                        <span className="text-xs font-mono text-[#8293AA]">
                          0{index + 1} / 04
                        </span>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-sans font-bold text-[#F5FAFF] mb-4 tracking-tight group-hover:text-[#168BFF] transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-body text-[#8293AA] mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Deliverables */}
                      <div className="pt-4 border-t border-white/[0.06]">
                        <span className="text-[10px] font-mono text-[#8293AA] tracking-widest uppercase block mb-2.5">
                          KEY ARTIFACTS
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {step.deliverables.map((item) => (
                            <span
                              key={item}
                              className="text-xs font-mono text-[#F5FAFF] px-2.5 py-1 rounded-sm bg-white/[0.04] border border-white/[0.06]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Evolving Progression Visual */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-36">
            <ApproachProgressionVisual activeStep={activeStepIndex} />
          </div>
        </div>
      </div>
    </section>
  );
};
