import React from "react";
import { siteConfig } from "../../data/site";
import { navItems } from "../../data/navigation";
import { scrollToTarget } from "../../hooks/useLenis";
import { ArrowUp } from "lucide-react";
import { BrandLogo } from "../brand/BrandLogo";

export const Footer: React.FC = () => {
  const handleScrollTop = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    scrollToTarget("#top");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href);
    }
  };

  return (
    <footer className="relative pt-24 pb-12 border-t border-white/[0.08] bg-[#000000] overflow-hidden z-10">
      {/* Subtle Geometric Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#F5FAFF_1px,transparent_1px),linear-gradient(to_bottom,#F5FAFF_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Massive TANVO Wordmark — letterforms cut out of the brand's own
          atmosphere rather than painted a flat grey. */}
      <div
        aria-hidden="true"
        className="footer-wordmark absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[18vw] font-sans font-bold tracking-tighter leading-none whitespace-nowrap"
      >
        TANVO
      </div>

      <div className="site-container relative z-10">
        {/* Main Footer Row */}
        <div className="grid-12 mb-20">
          {/* Brand & Manifesto */}
          <div className="col-span-12 lg:col-span-5 mb-12 lg:mb-0">
            <a
              href="#top"
              onClick={handleScrollTop}
              className="inline-flex mb-5 rounded-sm focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#4DE8FF]"
            >
              <BrandLogo variant="footer" />
            </a>
            <p className="text-sm text-[#8293AA] max-w-sm leading-relaxed mb-6">
              We turn ambitious ideas into digital products, experiences and brands built for the real world.
            </p>
            <div className="text-xs font-mono text-[#8293AA]">
              {siteConfig.contact.location}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-6 md:col-span-4 lg:col-span-3 lg:col-start-7">
            <span className="text-label text-[#F5FAFF] block mb-6">NAVIGATION</span>
            <ul className="space-y-3 text-sm text-[#8293AA]">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="hover:text-[#F5FAFF] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/[0.2] group-hover:bg-[#168BFF] transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Connect */}
          <div className="col-span-6 md:col-span-4 lg:col-span-2">
            <span className="text-label text-[#F5FAFF] block mb-6">CONNECT</span>
            <ul className="space-y-3 text-sm text-[#8293AA]">
              {siteConfig.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#168BFF] transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-[#8293AA] font-mono gap-4">
          <div>
            © {new Date().getFullYear()} TANVO TECH. ALL RIGHTS RESERVED.
          </div>

          <button
            type="button"
            onClick={handleScrollTop}
            className="flex items-center gap-2 hover:text-[#F5FAFF] transition-colors group focus:outline-hidden"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};
