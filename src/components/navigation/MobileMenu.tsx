import React, { useEffect } from "react";
import { navItems, navCta } from "../../data/navigation";
import { siteConfig } from "../../data/site";
import { ArrowUpRight, X } from "lucide-react";
import { BrandLogo } from "../brand/BrandLogo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavClick }) => {
  // Prevent scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onNavClick(e, href);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#000000]/95 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative h-full flex flex-col justify-between px-6 py-8">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between">
          <BrandLogo />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8293AA] hover:text-[#F5FAFF] transition-colors focus:outline-hidden"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-6 my-auto">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="text-3xl font-sans font-semibold tracking-tight text-[#F5FAFF] hover:text-[#168BFF] transition-colors py-2 flex items-center justify-between border-b border-white/[0.06]"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span>{item.label}</span>
              <span className="text-xs text-[#8293AA] font-mono">0{index + 1}</span>
            </a>
          ))}
        </nav>

        {/* Bottom CTA and Socials */}
        <div className="flex flex-col gap-6 pt-6 border-t border-white/[0.08]">
          <a
            href={navCta.href}
            onClick={(e) => handleLinkClick(e, navCta.href)}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#168BFF] text-[#000000] font-semibold text-sm tracking-wider uppercase"
          >
            <span>{navCta.label}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-between text-xs text-[#8293AA] font-mono">
            {siteConfig.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F5FAFF] transition-colors py-1"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
