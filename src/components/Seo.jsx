import { SITE, SITE_URL } from '../lib/constants';

/**
 * Universal SEO, AEO (Answer Engine Optimization) & GEO (Generative Engine Optimization) Component.
 *
 * Emits comprehensive meta tags and Schema.org JSON-LD graph tailored for:
 * 1. Traditional Search Engines: Google, Bing, DuckDuckGo, Yandex
 * 2. AI Answer Engines & LLMs: Perplexity Pro, ChatGPT Search, Claude, Google Gemini AI Overviews, Apple Intelligence
 * 3. Open Graph & Social Cards: Twitter/X, LinkedIn, WhatsApp, Slack
 */
export default function Seo({
  title,
  description,
  path = '/',
  image = '/images/og-cover.png',
  noindex = false,
  type = 'website',
}) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const metaDesc =
    description ||
    'Tanvo Tech builds high-performance MERN web applications, cross-platform mobile apps, custom AI agent integrations, and automated cloud workflows.';
  const canonical = `${SITE_URL}${path}`;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  // Structured Schema.org Graph for AEO & GEO
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/favicon.svg`,
          caption: `${SITE.name} Logo`,
        },
        image: absoluteImage,
        description: metaDesc,
        email: SITE.email,
        telephone: SITE.phone || undefined,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bengaluru',
          addressRegion: 'Karnataka',
          addressCountry: 'IN',
        },
        sameAs: [
          SITE.socials.github,
          SITE.socials.twitter,
          SITE.socials.linkedin,
        ].filter(Boolean),
        knowsAbout: [
          'Full-Stack Web Development',
          'MERN Stack (MongoDB, Express, React, Node.js)',
          'Next.js & Server-Side Rendering',
          'Mobile App Development (React Native & Flutter)',
          'Artificial Intelligence & Large Language Model (LLM) Integrations',
          'Retrieval-Augmented Generation (RAG) Systems',
          'Digital Process Automation & Webhooks',
          'Cloud Architecture & Zero-Downtime AWS / Vercel Migrations',
          'Technical Search Engine Optimization (SEO)',
          'High-Performance UI/UX Engineering',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Tanvo Tech Engineering & Design Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Custom Web & SaaS Development',
                description: 'Modular, fast-loading MERN and Next.js web applications, client portals, and e-commerce platforms.',
                serviceType: 'Web Development',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cross-Platform Mobile App Development',
                description: 'Native-feel iOS and Android applications built with React Native and Flutter, offline-tolerant with secure APIs.',
                serviceType: 'Mobile App Development',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'AI Agent & RAG Pipeline Solutions',
                description: 'Custom conversational AI agents, semantic document vector search, automated triage, and predictive machine learning models.',
                serviceType: 'Artificial Intelligence Services',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cloud Automation & Systems Integration',
                description: 'Automated CRM syncs, custom webhook pipelines, database tuning, and API orchestration.',
                serviceType: 'Process Automation',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'en-US',
        description: SITE.tagline,
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#service`,
        name: SITE.name,
        url: SITE_URL,
        image: absoluteImage,
        priceRange: '$$$',
        currenciesAccepted: 'INR, USD, EUR, AED',
        paymentAccepted: 'UPI, Wire Transfer, Credit Card, ACH, Netbanking',
        areaServed: {
          '@type': 'Country',
          name: 'Worldwide',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What technologies and frameworks does Tanvo Tech specialize in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tanvo Tech specializes in modern full-stack web and mobile engineering: React, Next.js, Node.js, Express, MongoDB (MERN), React Native, Flutter, Python, FastAPI, Tailwind CSS, BullMQ, PostgreSQL, and vector database systems (Pinecone/Chroma) for custom AI pipelines.',
            },
          },
          {
            '@type': 'Question',
            name: 'How fast can Tanvo Tech build and ship an MVP or custom web application?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Typical MVPs and production applications are shipped within 2 to 6 weeks using our agile sprint methodology. We provide live staging environments, weekly video demos, and transparent client portal tracking.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do clients own 100% of the code, IP, and design assets?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Upon milestone settlement, full copyright, source code repositories (GitHub/GitLab), Figma designs, documentation, and cloud infrastructure keys are transferred 100% to the client with zero vendor lock-in.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does Tanvo Tech implement enterprise AI without exposing confidential company data?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We implement zero-data-retention API agreements, dedicated private VPC deployments, enterprise vector databases, and role-based access control (RBAC) so sensitive organizational data is never used for model training.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          ...(path !== '/'
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: title || path.replace('/', '').toUpperCase(),
                  item: canonical,
                },
              ]
            : []),
        ],
      },
    ],
  };

  return (
    <>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDesc} />
      <meta name="author" content="Tanvo Tech Private Limited" />
      <link rel="canonical" href={canonical} />

      {/* Robots & Indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow, noarchive" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      )}

      {/* Open Graph / Facebook / LinkedIn / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE.name} Digital Solutions Agency`} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tanvotech" />
      <meta name="twitter:creator" content="@tanvotech" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={`${SITE.name} Agency Cover`} />

      {/* GEO Geographic & Entity Resolution Tags */}
      <meta name="geo.region" content="IN-KA" />
      <meta name="geo.placename" content="Bengaluru" />
      <meta name="geo.position" content="12.9716;77.5946" />
      <meta name="ICBM" content="12.9716, 77.5946" />

      {/* AEO / GEO Schema.org JSON-LD Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
    </>
  );
}
