import CustomCursor from '../components/CustomCursor';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Achievements from '../components/Achievements';
import Process from '../components/Process';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import Seo from '../components/Seo';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SITE, SITE_URL } from '../lib/constants';

const DESCRIPTION =
  'Tanvo Tech builds high-performance MERN web applications, cross-platform mobile apps, custom AI integrations, and business process automation.';

/** Structured data so search engines can render a rich result. */
function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    description: DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/images/og-cover.png`,
    ...(SITE.email && { email: SITE.email }),
    ...(SITE.phone && { telephone: SITE.phone }),
    ...(SITE.location && {
      address: { '@type': 'PostalAddress', addressLocality: SITE.location },
    }),
    sameAs: Object.values(SITE.socials).filter(Boolean),
    serviceType: [
      'Web Development',
      'Mobile App Development',
      'AI Integration',
      'Business Process Automation',
      'Digital Marketing',
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Static, developer-authored object — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const revealRef = useScrollReveal({ enabled: !prefersReducedMotion });

  return (
    <>
      <Seo title={null} description={DESCRIPTION} path="/" />
      <OrganizationSchema />

      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <CustomCursor />
      <Header />

      <main id="main" ref={revealRef} className="site-ambience flex-1" tabIndex={-1}>
        <ErrorBoundary label="the hero">
          <Hero />
        </ErrorBoundary>

        <ErrorBoundary label="our services">
          <Services />
        </ErrorBoundary>

        <ErrorBoundary label="the portfolio">
          <Portfolio />
        </ErrorBoundary>

        <ErrorBoundary label="our track record">
          <Achievements />
        </ErrorBoundary>

        <ErrorBoundary label="the process section">
          <Process />
        </ErrorBoundary>

        <ErrorBoundary label="the contact form">
          <Contact />
        </ErrorBoundary>
      </main>

      <Footer />
    </>
  );
}
