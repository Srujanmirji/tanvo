import React, { useState, useEffect, useRef } from "react";
import { servicesData } from "../../data/services";
import { ServiceItem } from "./ServiceItem";
import { initServicesAnimations } from "../../animations/servicesTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { scrollToTarget } from "../../hooks/useLenis";
import { ArrowDown } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Services: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<HTMLElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Desktop active service on hover, mobile open accordion state
  const [activeServiceId, setActiveServiceId] = useState<string | null>("strategy");
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !headerRef.current || !rowRefs.current.length) return;

    const cleanup = initServicesAnimations({
      containerRef: containerRef.current,
      headerRef: headerRef.current,
      serviceRows: rowRefs.current,
      prefersReducedMotion,
    });

    return cleanup;
  }, [prefersReducedMotion]);

  const handleRowToggle = (id: string) => {
    setActiveServiceId((prev) => (prev === id ? null : id));
  };

  const handleNextSectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget("#approach");
  };

  // Determine current active item (hover takes precedence on desktop)
  const currentActiveId = hoveredServiceId || activeServiceId;
  const isAnyActive = Boolean(currentActiveId);

  // Expanding a service changes the document height. Refresh after the CSS
  // transition finishes so every downstream trigger keeps its real position.
  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 550);

    return () => window.clearTimeout(refreshTimer);
  }, [currentActiveId]);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative z-10 py-32 md:py-48 border-t border-white/[0.08] bg-[#000000]"
    >
      <div className="site-container">
        {/* Editorial Section Header */}
        <div ref={headerRef} className="grid-12 mb-24 md:mb-32 items-end">
          <div className="col-span-12 lg:col-span-6">
            <div className="services-badge flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#168BFF] shadow-[0_0_8px_#168BFF]" />
              <span className="text-label text-[#168BFF] tracking-[0.2em]">
                10 / SERVICES
              </span>
            </div>

            <h2 className="text-section-heading text-[#F5FAFF] uppercase font-semibold select-none">
              <span className="services-heading-line block overflow-hidden">
                FROM IDEA
              </span>
              <span className="services-heading-line block overflow-hidden text-[#168BFF]">
                TO DIGITAL
              </span>
              <span className="services-heading-line block overflow-hidden">
                REALITY.
              </span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8 mt-8 lg:mt-0">
            <p className="services-copy text-body text-[#8293AA] max-w-lg leading-relaxed">
              We bring strategy, design and engineering together to turn ambitious ideas into products people want to use.
            </p>
          </div>
        </div>

        {/* Full-Width Large Horizontal Service Rows */}
        <div className="border-b border-white/[0.08]">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                if (el) rowRefs.current[index] = el;
              }}
            >
              <ServiceItem
                service={service}
                isActive={currentActiveId === service.id}
                isAnyActive={isAnyActive}
                onMouseEnter={() => setHoveredServiceId(service.id)}
                onMouseLeave={() => setHoveredServiceId(null)}
                onToggle={() => handleRowToggle(service.id)}
              />
            </div>
          ))}
        </div>

        {/* Section End Transition Bridge into Approach */}
        <div className="mt-32 pt-20 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span className="text-[12px] font-mono text-[#8293AA] uppercase tracking-widest block mb-3">
              HOW WE WORK // METHODOLOGY
            </span>
            <div className="text-2xl md:text-4xl font-sans font-medium text-[#F5FAFF]">
              OUR APPROACH <span className="text-[#168BFF]">FORGED IN</span> PRECISION.
            </div>
          </div>

          <a
            href="#approach"
            onClick={handleNextSectionClick}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8293AA] hover:text-[#F5FAFF] transition-colors py-2 group"
          >
            <span>EXPLORE APPROACH</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
