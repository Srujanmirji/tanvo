import React from "react";
import { ServiceItemData } from "../../data/services";
import { ArrowUpRight, Plus } from "lucide-react";
import { StrategyVisual } from "./visuals/StrategyVisual";
import { BrandingVisual } from "./visuals/BrandingVisual";
import { UiUxVisual } from "./visuals/UiUxVisual";
import { WebDevVisual } from "./visuals/WebDevVisual";
import { AiVisual } from "./visuals/AiVisual";
import { ExperienceVisual } from "./visuals/ExperienceVisual";

interface ServiceItemProps {
  service: ServiceItemData;
  isActive: boolean;
  isAnyActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  isActive,
  isAnyActive,
  onMouseEnter,
  onMouseLeave,
  onToggle,
}) => {
  const renderVisual = () => {
    switch (service.visualType) {
      case "strategy":
        return <StrategyVisual />;
      case "branding":
        return <BrandingVisual />;
      case "uiux":
        return <UiUxVisual />;
      case "webdev":
        return <WebDevVisual />;
      case "ai":
        return <AiVisual />;
      case "experience":
        return <ExperienceVisual />;
      default:
        return <StrategyVisual />;
    }
  };

  return (
    <div
      data-cursor="pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`service-row border-t border-white/[0.08] transition-all duration-500 ease-out ${
        isActive
          ? "opacity-100 bg-white/[0.02] border-[#168BFF]/40"
          : isAnyActive
          ? "opacity-40 hover:opacity-100"
          : "opacity-85 hover:opacity-100"
      }`}
    >
      {/* Clickable Header Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        className="w-full py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between text-left group focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#168BFF]"
      >
        {/* Left: Number & Large Editorial Title */}
        <div className="flex items-baseline gap-6 md:gap-12">
          <span className="text-xs md:text-sm font-mono text-[#8293AA] transition-colors duration-300 group-hover:text-[#168BFF]">
            {service.number}
          </span>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold text-[#F5FAFF] tracking-tight transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#168BFF]">
            {service.title}
          </h3>
        </div>

        {/* Right: Tagline & Interactive Indicator */}
        <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
          <span className="text-xs font-mono text-[#8293AA] tracking-widest uppercase hidden lg:block">
            {service.tagline}
          </span>

          <div
            className={`w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-[#F5FAFF] transition-all duration-500 ${
              isActive
                ? "rotate-45 bg-[#168BFF] text-[#000000] border-transparent scale-110"
                : "group-hover:border-[#168BFF] group-hover:text-[#168BFF]"
            }`}
          >
            <Plus className="w-4 h-4 md:hidden" />
            <ArrowUpRight className="w-4 h-4 hidden md:block" />
          </div>
        </div>
      </button>

      {/* Expandable Body & Visual Preview */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isActive
            ? "grid-rows-[1fr] opacity-100 pb-10 md:pb-14"
            : "grid-rows-[0fr] opacity-0 pb-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid-12 pt-4 items-start gap-8">
            {/* Narrative & Capabilities */}
            <div className="col-span-12 lg:col-span-6 flex flex-col justify-between">
              <p className="text-body text-[#F5FAFF]/85 leading-relaxed mb-8 max-w-lg">
                {service.description}
              </p>

              {/* Deliverables tags */}
              <div className="mb-6">
                <span className="text-[10px] font-mono text-[#8293AA] tracking-widest uppercase block mb-3">
                  CORE DELIVERABLES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.deliverables.map((item) => (
                    <div
                      key={item}
                      className="text-xs font-mono text-[#F5FAFF] px-3 py-2 rounded-sm bg-white/[0.03] border border-white/[0.06] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#168BFF]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities checklist */}
              <div className="flex flex-wrap gap-2">
                {service.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-[11px] font-mono text-[#8293AA] px-2.5 py-0.5 rounded-sm bg-white/[0.02]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Contextual Generative Visual */}
            <div className="col-span-12 lg:col-span-6">
              {renderVisual()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
