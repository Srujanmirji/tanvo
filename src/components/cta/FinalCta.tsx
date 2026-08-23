import React, { useEffect, useRef } from "react";
import { siteConfig } from "../../data/site";
import { FinalCtaVisual } from "./FinalCtaVisual";
import { ContactForm } from "./ContactForm";
import { initCtaAnimations } from "../../animations/ctaTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Mail, ArrowUpRight } from "lucide-react";
import { scrollToTarget } from "../../hooks/useLenis";

export const FinalCta: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const copyRef = useRef<HTMLParagraphElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (
      !containerRef.current ||
      !badgeRef.current ||
      !line1Ref.current ||
      !line2Ref.current ||
      !line3Ref.current ||
      !copyRef.current ||
      !formRef.current
    ) {
      return;
    }

    const cleanup = initCtaAnimations({
      containerRef: containerRef.current,
      badgeRef: badgeRef.current,
      headlineLines: [line1Ref.current, line2Ref.current, line3Ref.current],
      copyRef: copyRef.current,
      visualRef: visualRef.current || undefined,
      formRef: formRef.current,
      prefersReducedMotion,
    });

    return cleanup;
  }, [prefersReducedMotion]);

  const handleWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget("#work");
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative z-10 py-32 md:py-48 border-t border-white/[0.08] bg-[#000000] overflow-hidden text-center"
    >
      {/* Background Atmosphere */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-radial-[circle,rgba(22, 139, 255,0.08)_0%,transparent_70%] blur-3xl pointer-events-none" />

      <div className="site-container relative z-10">
        {/* Section Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-[#168BFF] animate-pulse" />
          <span className="text-label text-[#168BFF]">{siteConfig.finalCta.badge}</span>
        </div>

        {/* Luminous Convergence Visual */}
        <div ref={visualRef}>
          <FinalCtaVisual />
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-hero text-[#F5FAFF] uppercase font-semibold mb-6 tracking-tight select-none">
          <span ref={line1Ref} className="block overflow-hidden">
            {siteConfig.finalCta.headline.line1}
          </span>
          <span ref={line2Ref} className="block overflow-hidden">
            {siteConfig.finalCta.headline.line2}
          </span>
          <span ref={line3Ref} className="block overflow-hidden">
            <span className="font-editorial text-[#168BFF] font-normal italic lowercase tracking-normal">
              {siteConfig.finalCta.headline.line3.toLowerCase()}
            </span>
          </span>
        </h2>

        {/* Supporting Copy */}
        <p
          ref={copyRef}
          className="text-body text-[#8293AA] max-w-lg mx-auto mb-12 leading-relaxed"
        >
          {siteConfig.finalCta.supportingText}
        </p>

        {/* Action Buttons: Secondary Anchor to Work */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#work"
            onClick={handleWorkClick}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-[#F5FAFF] text-xs font-mono tracking-wider uppercase transition-all"
          >
            <span>{siteConfig.finalCta.secondaryBtn}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8293AA]" />
          </a>
        </div>

        {/* Fast Contact Form Container */}
        <div ref={formRef} className="mb-20">
          <ContactForm />
        </div>

        {/* Direct Contact Alternative & Social Channels */}
        <div className="pt-12 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[#8293AA]">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#168BFF]" />
            <span>DIRECT:</span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-[#F5FAFF] hover:text-[#168BFF] transition-colors underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="flex items-center gap-6">
            {siteConfig.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#168BFF] transition-colors uppercase tracking-widest"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
