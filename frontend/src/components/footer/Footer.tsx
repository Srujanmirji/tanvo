import React, { useEffect, useRef } from "react";
import { siteConfig } from "../../data/site";
import { footerLinkGroups } from "../../data/navigation";
import { scrollToTarget } from "../../hooks/useLenis";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { initFooterAnimations } from "../../animations/footerTimeline";
import { ArrowUp, ArrowUpRight, ArrowRight, MapPin, Mail } from "lucide-react";
import { BrandLogo } from "../brand/BrandLogo";
import { FooterPortal } from "./FooterPortal";

/** Brand marks were dropped from lucide 1.x, so the glyphs are inline. */
const socialIcons: Record<string, React.ReactNode> = {
  LinkedIn: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5.001A2.5 2.5 0 0 1 4.98 3.5zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-.95 1.83-1.96 3.77-1.96 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z" />
  ),
  Instagram: (
    <>
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.9 3.9 0 0 1-1.38-.9 3.9 3.9 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.31-.43.17-.73.37-1.05.69-.32.32-.52.62-.69 1.05-.12.33-.27.81-.31 1.71C3.44 8.5 3.43 8.86 3.43 12s.01 3.5.07 4.74c.4.9.19 1.38.31 1.71.17.43.37.73.69 1.05.32.32.62.52 1.05.69.33.12.81.27 1.71.31 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.31.43-.17.73-.37 1.05-.69.32-.32.52-.62.69-1.05.12-.33.27-.81.31-1.71.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.31-1.71a2.83 2.83 0 0 0-.69-1.05 2.83 2.83 0 0 0-1.05-.69c-.33-.12-.81-.27-1.71-.31-1.24-.06-1.6-.07-4.74-.07z" />
      <path d="M12 7.03A4.97 4.97 0 1 0 12 16.97 4.97 4.97 0 0 0 12 7.03zm0 8.2a3.23 3.23 0 1 1 0-6.46 3.23 3.23 0 0 1 0 6.46z" />
      <circle cx="17.17" cy="6.83" r="1.16" />
    </>
  ),
  X: (
    <path d="M17.53 3h3.05l-6.67 7.62L21.75 21h-6.13l-4.8-6.28L5.32 21H2.27l7.13-8.15L2.25 3h6.29l4.34 5.74L17.53 3z" />
  ),
};

const SocialGlyph: React.FC<{ name: string }> = ({ name }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-[18px] w-[18px]"
    aria-hidden="true"
  >
    {socialIcons[name] ?? socialIcons.X}
  </svg>
);

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!footerRef.current) return;

    return initFooterAnimations({
      containerRef: footerRef.current,
      ctaRef: ctaRef.current,
      portalRef: portalRef.current,
      brandRef: brandRef.current,
      columnRefs: columnRefs.current,
      bottomRef: bottomRef.current,
      wordmarkRef: wordmarkRef.current,
      prefersReducedMotion,
    });
  }, [prefersReducedMotion]);

  const handleScrollTop = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    scrollToTarget("#top");
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href);
    }
  };

  return (
    <footer
      ref={footerRef}
      className="site-footer relative z-10 overflow-hidden pt-24 md:pt-28"
    >
      <div className="footer-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="footer-glow pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="site-container relative z-10">
        {/* ---- Closing invitation ------------------------------------- */}
        <div className="grid-12 items-center gap-y-10">
          <div ref={ctaRef} className="col-span-12 lg:col-span-6">
            <p className="footer-eyebrow mb-6 flex items-center gap-3 text-[color:var(--footer-violet)]">
              LET&apos;S BUILD SOMETHING REAL.
              <span className="footer-pulse" aria-hidden="true" />
            </p>

            <h2 className="footer-cta-heading mb-7">
              YOUR NEXT
              <br />
              <span className="footer-cta-accent">BIG IDEA</span>
              <br />
              STARTS HERE.
            </h2>

            <p className="mb-10 max-w-md text-base leading-relaxed text-[color:var(--footer-muted)]">
              Tell us what you&apos;re building. We&apos;ll help turn the idea
              into a digital product, experience, or brand built for the real
              world.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                data-cursor="cta"
                className="footer-invite footer-focus group inline-flex items-center gap-3 rounded-lg px-7 py-4"
              >
                <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em]">
                  START A CONVERSATION
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <span className="text-[color:var(--footer-rule-strong)]" aria-hidden="true">
                /
              </span>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="footer-link-inline footer-focus text-sm"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>

          <div ref={portalRef} className="col-span-12 lg:col-span-6">
            <FooterPortal />
          </div>
        </div>

        <hr className="footer-rule my-14 md:my-16" />

        {/* ---- Brand + link columns ----------------------------------- */}
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          <div ref={brandRef} className="lg:col-span-3">
            <a
              href="#top"
              onClick={handleScrollTop}
              className="footer-focus mb-6 inline-flex rounded-sm"
            >
              <BrandLogo variant="footer" />
            </a>

            <p className="footer-eyebrow mb-6 text-[color:var(--footer-blue)]">
              PRODUCTS. PLATFORMS. POSSIBILITIES.
            </p>

            <p className="mb-7 max-w-xs text-sm leading-relaxed text-[color:var(--footer-muted)]">
              We turn ambitious ideas into digital products, experiences and
              brands built for the real world.
            </p>

            <p className="flex items-center gap-2.5 text-xs font-mono tracking-wider text-[color:var(--footer-dim)]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[color:var(--footer-gold)]" />
              {siteConfig.contact.location}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:col-span-9 lg:grid-cols-5 lg:gap-x-0"
          >
            {footerLinkGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                ref={(el) => {
                  columnRefs.current[groupIndex] = el;
                }}
                className="footer-column"
              >
                <h3 className="footer-eyebrow mb-6 flex items-center gap-2.5 text-[color:var(--footer-text)]">
                  <span className="footer-column-dot" aria-hidden="true" />
                  {group.title}
                </h3>

                <ul className="space-y-0.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href as string)}
                          className="footer-link footer-focus group"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="footer-link-arrow h-3.5 w-3.5" />
                        </a>
                      ) : (
                        // No destination yet — deliberately not a link.
                        <span className="footer-link footer-link-pending">
                          {link.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div
              ref={(el) => {
                columnRefs.current[footerLinkGroups.length] = el;
              }}
              className="footer-column"
            >
              <h3 className="footer-eyebrow mb-6 flex items-center gap-2.5 text-[color:var(--footer-text)]">
                <span className="footer-column-dot" aria-hidden="true" />
                CONNECT
              </h3>

              <ul className="space-y-2">
                <li>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="footer-connect footer-focus group"
                  >
                    <span className="footer-chip" aria-hidden="true">
                      <Mail className="h-[18px] w-[18px]" />
                    </span>
                    <span>{siteConfig.contact.email}</span>
                  </a>
                </li>

                {siteConfig.socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-connect footer-focus group"
                    >
                      <span className="footer-chip" aria-hidden="true">
                        <SocialGlyph name={social.name} />
                      </span>
                      <span>{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* ---- Wordmark at the base ------------------------------------ */}
        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="footer-wordmark mt-16 select-none text-center text-[21.5vw] font-sans font-bold leading-[0.76] tracking-[-0.055em] md:mt-10"
        >
          TANVO
        </div>

        <hr className="footer-rule" />

        {/* ---- Bottom bar ---------------------------------------------- */}
        <div
          ref={bottomRef}
          className="flex flex-col gap-8 py-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="text-xs font-mono leading-relaxed tracking-wider text-[color:var(--footer-dim)]">
            © {new Date().getFullYear()} TANVO TECH.
            <br /> ALL RIGHTS RESERVED.
          </p>

          <p className="flex items-start gap-3 text-xs font-mono leading-relaxed tracking-wider text-[color:var(--footer-dim)]">
            <span className="footer-pulse mt-1.5 shrink-0" aria-hidden="true" />
            <span>
              BUILT WITH AMBITION.
              <br /> ENGINEERED FOR IMPACT.
            </span>
          </p>

          <div className="flex items-center gap-4">
            {siteConfig.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="footer-social footer-focus"
              >
                <SocialGlyph name={social.name} />
              </a>
            ))}

            <span className="footer-divider-v mx-2 hidden sm:block" aria-hidden="true" />

            <button
              type="button"
              onClick={handleScrollTop}
              aria-label="Back to top"
              className="footer-top footer-focus group"
            >
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
            </button>

            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--footer-dim)]">
              Back to top
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
