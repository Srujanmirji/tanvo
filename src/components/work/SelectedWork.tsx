import React, { useEffect, useRef } from "react";
import { projectsData } from "../../data/projects";
import { ProjectCard } from "./ProjectCard";
import { initWorkAnimations } from "../../animations/workTimeline";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { scrollToTarget } from "../../hooks/useLenis";
import { ArrowDown } from "lucide-react";

export const SelectedWork: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || !headerRef.current || !cardRefs.current.length) return;

    const cleanup = initWorkAnimations({
      containerRef: containerRef.current,
      headerRef: headerRef.current,
      projectCards: cardRefs.current,
      prefersReducedMotion,
    });

    return cleanup;
  }, [prefersReducedMotion]);

  const handleNextSectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToTarget("#services");
  };

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative z-10 py-32 md:py-48 border-t border-white/[0.08] bg-[#000000]"
    >
      <div className="site-container">
        {/* Section Header */}
        <div ref={headerRef} className="mb-24 md:mb-36">
          <div className="work-badge flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#168BFF] shadow-[0_0_8px_#168BFF]" />
            <span className="text-label text-[#168BFF] tracking-[0.2em]">
              09 / SELECTED WORK
            </span>
          </div>

          <h2 className="text-section-heading text-[#F5FAFF] uppercase font-semibold select-none">
            <span className="work-heading-line1 block overflow-hidden">
              DIGITAL PRODUCTS
            </span>
            <span className="work-heading-line2 block overflow-hidden text-[#8293AA]">
              BUILT TO MATTER.
            </span>
          </h2>
        </div>

        {/* Alternating Asymmetric Project Cards */}
        <div className="flex flex-col">
          {projectsData.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {/* Section End Transition Statement into Services */}
        <div className="mt-32 pt-20 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span className="text-[11px] font-mono text-[#8293AA] uppercase tracking-widest block mb-3">
              NEXT UP // CAPABILITIES
            </span>
            <div className="text-2xl md:text-4xl font-sans font-medium text-[#F5FAFF]">
              FROM IDEA <span className="text-[#168BFF]">TO DIGITAL</span> REALITY.
            </div>
          </div>

          <a
            href="#services"
            onClick={handleNextSectionClick}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8293AA] hover:text-[#F5FAFF] transition-colors py-2 group"
          >
            <span>EXPLORE SERVICES</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
