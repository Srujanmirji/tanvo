import React, { useState, useEffect } from "react";
import { navItems, navCta } from "../../data/navigation";
import { scrollToTarget } from "../../hooks/useLenis";
import { useActiveSection } from "../../hooks/useActiveSection";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { BrandLogo } from "../brand/BrandLogo";

// Module scope: a fresh array each render would restart the observer.
const NAV_HREFS = navItems.map((item) => item.href);

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const activeHref = useActiveSection(NAV_HREFS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      scrollToTarget(href);
    }
  };

  return (
    <>
      {/* The bottom border is declared in both states so its colour only ever
          animates transparent <-> 6% white. Omitting it from the unscrolled
          state left the colour inheriting currentColor (#F5FAFF), and
          transition-all then faded a solid white line in on first scroll. */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b transition-all duration-500 ${
          isScrolled
            ? "py-4 bg-[#000000]/85 backdrop-blur-md border-white/[0.06]"
            : "py-6 md:py-8 bg-transparent border-transparent"
        }`}
      >
        <div className="site-container flex items-center justify-between">
          {/* Official TANVO mark and wordmark */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "#top")}
            className="group select-none rounded-sm focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#4DE8FF]"
          >
            <BrandLogo />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`text-[12px] font-mono tracking-[0.2em] transition-colors py-1 relative group uppercase ${
                    isActive ? "text-[#F5FAFF]" : "text-[#8293AA] hover:text-[#F5FAFF]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] bg-[#168BFF] transition-all duration-300 group-hover:w-full ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Desktop Right CTA Pill (Matching reference) */}
          <div className="hidden md:flex items-center">
            <a
              href={navCta.href}
              onClick={(e) => handleNavClick(e, navCta.href)}
              data-cursor="cta"
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.04] hover:bg-[#168BFF] border border-white/[0.18] hover:border-transparent text-[#F5FAFF] hover:text-[#000000] transition-all duration-300"
            >
              <span className="text-[12px] font-mono tracking-widest uppercase font-semibold">{navCta.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F5FAFF] hover:text-[#168BFF] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#168BFF]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavClick={handleNavClick}
        activeHref={activeHref}
      />
    </>
  );
};
