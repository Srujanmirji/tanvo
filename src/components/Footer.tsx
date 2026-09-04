import { useEffect, useRef, type PointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const exploreLinks = [
  ['Work', '#work'],
  ['Services', '#services'],
  ['About', '#about'],
  ['Process', '#process'],
  ['Contact', '#contact'],
] as const;

const serviceLinks = [
  'Web Development',
  'Mobile Applications',
  'UI/UX Design',
  'Brand Identity',
  'Digital Marketing',
] as const;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const projectButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: footer,
          start: 'top 82%',
          once: true,
        },
      })
        .from('.footer-cta', { clipPath: 'inset(0 100% 0 0 round 28px)', duration: 0.85 })
        .from('.footer-cta-label, .footer-cta-title', { y: 32, opacity: 0, duration: 0.65, stagger: 0.08 }, '-=0.45')
        .from('.footer-cta-copy, .footer-cta-actions', { y: 20, opacity: 0, duration: 0.55, stagger: 0.08 }, '-=0.4')
        .from('.footer-brand', { y: 28, opacity: 0, duration: 0.6 }, '-=0.1')
        .from('.footer-column', { y: 24, opacity: 0, duration: 0.55, stagger: 0.09 }, '-=0.42')
        .from('.footer-bottom', { opacity: 0, duration: 0.45 }, '-=0.2');
    }, footer);

    return () => ctx.revert();
  }, []);

  const moveProjectButton = (event: PointerEvent<HTMLButtonElement>) => {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(event.currentTarget, {
      x: (event.clientX - rect.left - rect.width / 2) * 0.1,
      y: (event.clientY - rect.top - rect.height / 2) * 0.1,
      duration: 0.2,
      ease: 'power3.out',
    });
  };

  const resetProjectButton = () => {
    if (projectButtonRef.current) {
      gsap.to(projectButtonRef.current, { x: 0, y: 0, duration: 0.35, ease: 'power3.out' });
    }
  };

  return (
    <footer id="contact" className="site-footer" ref={footerRef}>
      <div className="footer-shell">
        <section className="footer-cta" aria-labelledby="footer-cta-title">
          <div className="footer-cta-heading">
            <p className="footer-cta-label">Let’s create something meaningful</p>
            <h2 id="footer-cta-title" className="footer-cta-title">
              Have an <em>ambitious</em> idea?
            </h2>
          </div>
          <div className="footer-cta-side">
            <p className="footer-cta-copy">
              Tell us what you’re building. We’ll help shape the right digital experience.
            </p>
            <div className="footer-cta-actions">
              <button
                ref={projectButtonRef}
                type="button"
                className="footer-project-button"
                data-open-modal="project"
                onPointerMove={moveProjectButton}
                onPointerLeave={resetProjectButton}
              >
                <span>Start a project</span>
                <span aria-hidden="true">→</span>
              </button>
              <a className="footer-support-link" href="mailto:support@tanvo.in">support@tanvo.in</a>
            </div>
          </div>
        </section>

        <div className="footer-main">
          <div className="footer-main-grid">
            <div className="footer-brand">
              <a className="footer-brand-lockup" href="#intro" aria-label="TANVO home">
                <img src="/assets/images/Tanvo.png" alt="" width="36" height="36" />
                <span>TANVO</span>
              </a>
              <p className="footer-tagline">Products. Platforms. Possibilities.</p>
              <span className="footer-brand-rule" aria-hidden="true" />
              <p className="footer-closing">Built with clarity.<br />Delivered with care.</p>
              <a className="footer-site-link" href="https://www.tanvo.in/">www.tanvo.in</a>
            </div>

            <nav className="footer-column footer-explore" aria-label="Footer explore">
              <h2 className="footer-col-title">Explore</h2>
              <ul className="footer-links-list">
                {exploreLinks.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}><span>{label}</span><span aria-hidden="true">↗</span></a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="footer-column footer-services" aria-label="Footer services">
              <h2 className="footer-col-title">Services</h2>
              <ul className="footer-links-list">
                {serviceLinks.map((label) => (
                  <li key={label}>
                    <a href="#services"><span>{label}</span><span aria-hidden="true">↗</span></a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-column footer-contact">
              <h2 className="footer-col-title">Contact</h2>
              <address className="footer-contact-list">
                <a href="mailto:support@tanvo.in">support@tanvo.in</a>
                <a href="tel:+919663341218">+91 96633 41218</a>
                <a href="tel:+916362318041">+91 63623 18041</a>
                <span>Hubli–Dharwad<br />Karnataka, India</span>
              </address>
              <div className="footer-socials" aria-label="Social links">
                <a href="https://www.linkedin.com/company/tanvoin/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://www.instagram.com/tanvo.in/" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© {new Date().getFullYear()} TANVO. All rights reserved.</p>
            <nav className="footer-legal-links" aria-label="Legal">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
            </nav>
            <div className="footer-availability">
              <span className="footer-status"><span aria-hidden="true" />Available for selected projects</span>
              <button
                type="button"
                className="footer-back-top"
                aria-label="Back to top"
                onClick={() => window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                })}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
