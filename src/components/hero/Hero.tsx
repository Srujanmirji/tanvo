import React, { useEffect, useRef } from "react";
import { siteConfig } from "../../data/site";
import { ArrowUpRight } from "lucide-react";
import { scrollToTarget } from "../../hooks/useLenis";
import { initHeroAnimations } from "../../animations/heroTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface HeroProps {
  onHeroProgress?: (progress: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ onHeroProgress }) => {
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const supportingTextRef = useRef<HTMLParagraphElement | null>(null);
  const ctaContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLAnchorElement | null>(null);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToTarget(href);
  };

  useEffect(() => {
    if (
      !sectionRef.current ||
      !eyebrowRef.current ||
      !line1Ref.current ||
      !line2Ref.current ||
      !line3Ref.current ||
      !supportingTextRef.current ||
      !ctaContainerRef.current
    ) {
      return;
    }

    const cleanup = initHeroAnimations(
      {
        sectionRef: sectionRef.current,
        eyebrowRef: eyebrowRef.current,
        headlineLines: [line1Ref.current, line2Ref.current, line3Ref.current],
        supportingTextRef: supportingTextRef.current,
        ctaContainerRef: ctaContainerRef.current,
        scrollIndicatorRef: scrollIndicatorRef.current ?? undefined,
        onScrollProgress: (progress) => {
          onHeroProgress?.(progress);
        },
      },
      prefersReducedMotion
    );

    return cleanup;
  }, [onHeroProgress, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 md:pt-32 pb-4 overflow-hidden pointer-events-none"
    >
      {/* Main Grid Content */}
      <div className="site-container relative z-10 w-full my-auto pointer-events-none">
        <div className="grid-12 items-center">
          {/* Left Column: Editorial Typography & Action */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 pointer-events-auto">
            {/* Small Eyebrow */}
            <div ref={eyebrowRef} className="mb-6 flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#8293AA]">
              <span>DIGITAL</span>
              <span className="text-[#168BFF] font-semibold">DREAMS.</span>
              <span>REAL IMPACT.</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="tracking-tight text-[#F5FAFF] uppercase font-medium mb-8 select-none">
              <span
                ref={line1Ref}
                className="block overflow-hidden text-[clamp(2.5rem,5.2vw,5.8rem)] leading-[0.95] font-sans font-light tracking-tight"
              >
                WE BUILD
              </span>
              <span
                ref={line2Ref}
                className="block overflow-hidden text-[clamp(2.5rem,5.2vw,5.8rem)] leading-[0.95] font-sans font-light tracking-tight"
              >
                WHAT YOU
              </span>
              <span ref={line3Ref} className="block overflow-hidden">
                <span className="font-sans font-extrabold text-[clamp(3.0rem,6.4vw,7.2rem)] leading-[0.9] tracking-tight bg-gradient-to-r from-[#168BFF] via-[#67DFFF] to-[#D6F8FF] bg-clip-text text-transparent">
                  IMAGINE.
                </span>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              ref={supportingTextRef}
              className="text-body max-w-md text-[#8293AA] mb-8 leading-relaxed text-sm md:text-base font-normal"
            >
              We are Tanvo, a digital creation studio crafting immersive websites, powerful brands and digital experiences that drive real growth.
            </p>

            {/* Primary Action CTA */}
            <div ref={ctaContainerRef} className="flex items-center gap-4">
              <a
                href={siteConfig.primaryCta.href}
                onClick={(e) => handleCtaClick(e, siteConfig.primaryCta.href)}
                data-cursor="cta"
                className="group inline-flex items-center gap-4 py-1.5 pr-6 pl-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-[#168BFF]/50 transition-all duration-300 pointer-events-auto"
              >
                {/* Circular Glowing Icon Button */}
                <div className="w-12 h-12 rounded-full border border-[#168BFF]/60 bg-[#071A30] flex items-center justify-center text-[#F5FAFF] shadow-[0_0_20px_rgba(22, 139, 255,0.45)] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#168BFF]">
                  <ArrowUpRight className="w-5 h-5 text-[#168BFF] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </div>

                {/* Text Label + Glowing Dot */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono tracking-widest text-[#F5FAFF] uppercase font-semibold group-hover:text-[#168BFF] transition-colors">
                    {siteConfig.primaryCta.label}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#168BFF] shadow-[0_0_8px_#168BFF]" />
                </div>
              </a>
            </div>
          </div>

          {/* Right Floating Sparkle & Quote */}
          <div className="hidden xl:flex col-span-3 col-start-10 flex-col items-start gap-4 text-xs font-mono text-[#8293AA] leading-relaxed pointer-events-auto pl-8 border-l border-white/[0.08]">
            <span className="text-[#168BFF] text-base">✦</span>
            <p className="max-w-[200px]">
              Turning ideas into digital reality through design, technology and innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Hero Metrics Bar & Center Scroll Indicator */}
      <div className="site-container relative z-10 w-full pt-4 pb-4 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto border-t border-white/[0.06]">
        {/* Empty left spacer */}
        <div className="hidden md:block w-32" />

        {/* Center Scroll Capsule */}
        <a
          ref={scrollIndicatorRef}
          href="#idea"
          onClick={(e) => handleCtaClick(e, "#idea")}
          className="flex flex-col items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#8293AA] hover:text-[#F5FAFF] transition-colors uppercase group pointer-events-auto"
        >
          <div className="w-5 h-9 rounded-full border border-white/[0.15] flex items-start justify-center p-1.5 group-hover:border-[#168BFF] transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#168BFF] animate-bounce" />
          </div>
          <span>SCROLL TO EXPLORE</span>
        </a>

        {/* Right Side Metrics (50+ / 98%) */}
        <div className="flex items-center gap-8 text-right font-mono">
          <div className="border-r border-white/[0.1] pr-8">
            <div className="text-2xl md:text-3xl font-sans font-bold text-[#F5FAFF]">50+</div>
            <div className="text-[9px] text-[#8293AA] tracking-widest uppercase">PROJECTS DELIVERED</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-sans font-bold text-[#F5FAFF]">98%</div>
            <div className="text-[9px] text-[#8293AA] tracking-widest uppercase">CLIENT SATISFACTION</div>
          </div>
        </div>
      </div>

      {/* Brand Trust Strip */}
      <div className="w-full bg-[#000000]/95 border-t border-white/[0.06] py-5 pointer-events-auto">
        <div className="site-container flex flex-wrap items-center justify-between gap-8 text-[#8293AA]/70">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8293AA]">
            TRUSTED BY INNOVATIVE BRANDS
          </span>

          <div className="flex flex-wrap items-center gap-8 md:gap-14 font-sans font-semibold tracking-wider text-sm md:text-base">
            <span className="hover:text-[#F5FAFF] transition-colors">🌿 Leafy</span>
            <span className="hover:text-[#F5FAFF] transition-colors font-mono">qikly</span>
            <span className="hover:text-[#F5FAFF] transition-colors">Homely.</span>
            <span className="hover:text-[#F5FAFF] transition-colors">SaaSy</span>
            <span className="hover:text-[#F5FAFF] transition-colors tracking-widest font-mono font-bold">PULSE</span>
            <span className="hover:text-[#F5FAFF] transition-colors">☁️ Cloudix</span>
          </div>
        </div>
      </div>
    </section>
  );
};
