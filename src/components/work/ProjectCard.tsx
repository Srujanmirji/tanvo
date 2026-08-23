import React from "react";
import { ProjectData } from "../../data/projects";
import { ArrowUpRight } from "lucide-react";
import { NovaVisual } from "./visuals/NovaVisual";
import { ArcVisual } from "./visuals/ArcVisual";
import { OrbitVisual } from "./visuals/OrbitVisual";
import { MonoVisual } from "./visuals/MonoVisual";
import { scrollToTarget } from "../../hooks/useLenis";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const isEven = index % 2 === 0;

  const renderVisual = () => {
    switch (project.visualTheme.type) {
      case "ai":
        return <NovaVisual />;
      case "fintech":
        return <ArcVisual />;
      case "saas":
        return <OrbitVisual />;
      case "commerce":
        return <MonoVisual />;
      default:
        return <NovaVisual />;
    }
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (project.href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(project.href);
    }
  };

  return (
    <article
      data-cursor="project"
      className="project-card group relative py-16 md:py-24 border-t border-white/[0.08] first:border-t-0"
    >
      <div className="grid-12 items-center gap-8 lg:gap-14">
        {/* Alternating Layout: Visual Container */}
        <div
          className={`col-span-12 lg:col-span-7 ${
            isEven ? "lg:order-1" : "lg:order-2 lg:col-start-6"
          }`}
        >
          <div className="project-visual-wrapper relative transition-transform duration-700 ease-out group-hover:-translate-y-1">
            {renderVisual()}
          </div>
        </div>

        {/* Narrative & Metadata Column */}
        <div
          className={`col-span-12 lg:col-span-5 flex flex-col justify-between ${
            isEven ? "lg:order-2" : "lg:order-1 lg:col-start-1"
          }`}
        >
          <div>
            {/* Header / Number & Category */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-mono text-[#8293AA]">
                {project.number} / 04
              </span>
              <span className="w-1 h-1 rounded-full bg-white/[0.2]" />
              <span
                className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border"
                style={{
                  color: project.visualTheme.accent,
                  borderColor: `${project.visualTheme.accent}33`,
                  backgroundColor: `${project.visualTheme.accent}10`,
                }}
              >
                {project.category}
              </span>
            </div>

            {/* Large Project Headline */}
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-[#F5FAFF] mb-4 tracking-tight transition-colors duration-300 group-hover:text-[#168BFF]">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-body text-[#8293AA] mb-8 leading-relaxed">
              {project.description}
            </p>

            {/* Services & Deliverables */}
            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#8293AA] tracking-widest uppercase block mb-2.5">
                DELIVERABLES
              </span>
              <div className="flex flex-wrap gap-2">
                {project.services.map((srv) => (
                  <span
                    key={srv}
                    className="text-xs font-mono text-[#F5FAFF] px-3 py-1 rounded-sm bg-white/[0.04] border border-white/[0.06]"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <span className="text-[10px] font-mono text-[#8293AA] tracking-widest uppercase block mb-2.5">
                STACK
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono text-[#8293AA] px-2.5 py-0.5 rounded-sm bg-white/[0.02]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Metric & Action CTA */}
          <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#8293AA] block">
                {project.metricsPlaceholder.label}
              </span>
              <span
                className="text-xl font-sans font-bold tracking-tight"
                style={{ color: project.visualTheme.accent }}
              >
                {project.metricsPlaceholder.value}
              </span>
            </div>

            <a
              href={project.href}
              onClick={handleCtaClick}
              data-cursor="project"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/[0.04] hover:bg-[#168BFF] border border-white/[0.12] hover:border-transparent text-[#F5FAFF] hover:text-[#000000] transition-all duration-300 font-semibold text-xs tracking-wider uppercase group/btn focus:outline-hidden focus:ring-1 focus:ring-[#168BFF]"
              aria-label={`View ${project.title} project details`}
            >
              <span>{project.ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
