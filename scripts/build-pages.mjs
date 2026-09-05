// Generates services/*.html from content/services.json + templates/service.html.
// Plain Node, no dependencies. Run by the `prebuild`/`predev` npm scripts.
//
// Generated output is gitignored: content/services.json is the single source of
// truth, so there is nothing to keep in sync by hand.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const { services } = JSON.parse(readFileSync(resolve(root, 'content/services.json'), 'utf8'));
const template = readFileSync(resolve(root, 'templates/service.html'), 'utf8');

const outDir = resolve(root, 'services');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const svc of services) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `https://www.tanvo.in/services/${svc.slug}#service`,
        name: svc.name,
        serviceType: svc.serviceType,
        description: svc.lede,
        provider: { '@id': 'https://www.tanvo.in/#organization' },
        areaServed: { '@type': 'Country', name: 'India' },
        url: `https://www.tanvo.in/services/${svc.slug}`,
      },
      // The four stages are on every service page as an ordered list. Marking
      // them up helps AI answer engines extract the process as steps.
      // Note: Google retired HowTo *rich results* in 2023, so this will not
      // produce a Google search feature — it is here for machine extraction.
      {
        '@type': 'HowTo',
        '@id': `https://www.tanvo.in/services/${svc.slug}#process`,
        name: `How TANVO delivers ${svc.name}`,
        description: 'The four-stage framework every TANVO engagement runs through.',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Discover & Immerse', text: 'Discovery workshops, telemetry audits and journey mapping to establish what actually needs solving.' },
          { '@type': 'HowToStep', position: 2, name: 'Define & Strategize', text: 'Turning those findings into an architecture and a plan you can sign off on.' },
          { '@type': 'HowToStep', position: 3, name: 'Design & Prototype', text: 'Interactive prototypes and systematic design libraries, tested before production code.' },
          { '@type': 'HowToStep', position: 4, name: 'Deliver & Scale', text: 'Build, launch, and the ongoing work of scaling it.' },
        ],
      },
      ...((svc.faq || []).length
        ? [{
            '@type': 'FAQPage',
            '@id': `https://www.tanvo.in/services/${svc.slug}#faq`,
            mainEntity: svc.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.tanvo.in/' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.tanvo.in/#services' },
          { '@type': 'ListItem', position: 3, name: svc.name },
        ],
      },
    ],
  };

  const related = svc.related
    ? `
        <h2 class="svc-h2">Related work</h2>
        <p class="svc-body">See <strong>${esc(svc.related.name)}</strong> — ${esc(svc.related.note)}. <a href="/#work">View our selected work</a>.</p>
`
    : '';

  const siblings = services
    .filter((s) => s.slug !== svc.slug)
    .map((s) => `            <li><a href="/services/${s.slug}">${esc(s.name)}</a></li>`)
    .join('\n');

  const faqHtml = (svc.faq || [])
    .map((f) => `            <details class="faq-item">
              <summary class="faq-q">${esc(f.q)}</summary>
              <div class="faq-a"><p>${esc(f.a)}</p></div>
            </details>`)
    .join('\n');

  const html = template
    .replace('{{faq}}', faqHtml)
    .replaceAll('{{slug}}', esc(svc.slug))
    .replaceAll('{{num}}', esc(svc.num))
    .replaceAll('{{name}}', esc(svc.name))
    .replaceAll('{{title}}', esc(svc.title))
    .replaceAll('{{metaDescription}}', esc(svc.metaDescription))
    .replaceAll('{{lede}}', esc(svc.lede))
    .replaceAll('{{intro}}', esc(svc.intro))
    .replace('{{whatYouGet}}', svc.whatYouGet.map((i) => `          <li>${esc(i)}</li>`).join('\n'))
    .replace('{{stack}}', svc.stack.map((t) => `          <li>${esc(t)}</li>`).join('\n'))
    .replace('{{related}}', related)
    .replace('{{siblings}}', siblings)
    .replace('{{jsonld}}', JSON.stringify(jsonld, null, 2));

  const left = html.match(/\{\{[a-zA-Z]+\}\}/g);
  if (left) throw new Error(`Unreplaced placeholders in ${svc.slug}: ${[...new Set(left)].join(', ')}`);

  writeFileSync(resolve(outDir, `${svc.slug}.html`), html);
  console.log(`  services/${svc.slug}.html`);
}
console.log(`Generated ${services.length} service pages.`);

// ---------------------------------------------------------------------------
// Legal pages (/privacy, /terms) from content/legal.json + templates/legal.html
// ---------------------------------------------------------------------------

const legal = JSON.parse(readFileSync(resolve(root, 'content/legal.json'), 'utf8'));
const legalTemplate = readFileSync(resolve(root, 'templates/legal.html'), 'utf8');

for (const page of legal.pages) {
  const sections = page.sections
    .map((sec) => {
      const parts = [`        <h2 class="legal-h2">${esc(sec.h)}</h2>`];
      // Section prose is authored HTML (it contains deliberate <a> and <strong>),
      // so it is intentionally not escaped. Headings and list items are.
      for (const para of sec.p || []) parts.push(`        <p class="legal-p">${para}</p>`);
      if (sec.ul) {
        parts.push('        <ul class="legal-ul">');
        for (const li of sec.ul) parts.push(`          <li>${li}</li>`);
        parts.push('        </ul>');
      }
      for (const para of sec.p2 || []) parts.push(`        <p class="legal-p">${para}</p>`);
      return parts.join('\n');
    })
    .join('\n\n');

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://www.tanvo.in/${page.slug}#webpage`,
    name: page.name,
    description: page.metaDescription,
    url: `https://www.tanvo.in/${page.slug}`,
    isPartOf: { '@id': 'https://www.tanvo.in/#organization' },
    publisher: { '@id': 'https://www.tanvo.in/#organization' },
  };

  const html = legalTemplate
    .replaceAll('{{slug}}', esc(page.slug))
    .replaceAll('{{name}}', esc(page.name))
    .replaceAll('{{title}}', esc(page.title))
    .replaceAll('{{metaDescription}}', esc(page.metaDescription))
    .replaceAll('{{lede}}', esc(page.lede))
    .replaceAll('{{effectiveDate}}', esc(legal.effectiveDate))
    .replace('{{sections}}', sections)
    .replace('{{jsonld}}', JSON.stringify(jsonld, null, 2));

  const unresolved = html.match(/\{\{[a-zA-Z]+\}\}/g);
  if (unresolved) throw new Error(`Unreplaced placeholders in ${page.slug}: ${[...new Set(unresolved)].join(', ')}`);

  writeFileSync(resolve(root, `${page.slug}.html`), html);
  console.log(`  ${page.slug}.html`);
}
console.log(`Generated ${legal.pages.length} legal pages.`);
