#!/usr/bin/env node
// Post-deploy SEO regression check for www.tanvo.in.
//
//   node scripts/seo-check.mjs [origin]
//
// Asserts the things earlier audit phases fixed, so a regression is caught by
// a command rather than noticed months later. Exits non-zero on any failure.

const origin = process.argv[2] || 'https://www.tanvo.in';

const PAGES = [
  '/',
  '/services/web-design-development',
  '/services/ecommerce-development',
  '/services/ui-ux-design',
  '/services/brand-identity',
  '/services/custom-web-apps',
  '/privacy',
  '/terms',
];

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!ok) failed++;
};

const get = async (path) => {
  const res = await fetch(origin + path, { redirect: 'follow' });
  return { status: res.status, headers: res.headers, body: await res.text() };
};

console.log(`\nSEO check — ${origin}\n`);

console.log('Pages reachable');
const home = await get('/');
for (const p of PAGES) {
  const r = p === '/' ? home : await get(p);
  check(p, r.status === 200, `HTTP ${r.status}`);
}

console.log('\nCrawl baseline');
const robots = await get('/robots.txt');
check('robots.txt served', robots.status === 200);
check('robots.txt points at sitemap', robots.body.includes('sitemap.xml'));
const sitemap = await get('/sitemap.xml');
check('sitemap.xml served', sitemap.status === 200);
const locs = (sitemap.body.match(/<loc>/g) || []).length;
check('sitemap lists every page', locs === PAGES.length, `${locs} of ${PAGES.length}`);

console.log('\nHomepage integrity');
check('title carries service + location',
  /Web Design.*Hubli/i.test(home.body));
check('canonical present', home.body.includes('rel="canonical"'));
check('Organization schema', home.body.includes('ProfessionalService'));
check('FAQPage schema', home.body.includes('FAQPage'));
check('Service catalog schema', home.body.includes('hasOfferCatalog'));
check('real phone numbers', home.body.includes('9663341218') && home.body.includes('8073623745'));
check('placeholder phone gone', !home.body.includes('9881234567'));
check('hero is in the HTML (no JS needed)', home.body.includes('hero-static'));
check('links to all 5 service pages',
  PAGES.slice(1, 6).every((p) => home.body.includes(`href="${p}"`)));
// These were dead (href="#intro") for a long time while the form collected
// personal data — assert they stay pointed at real pages.
check('privacy + terms links are live, not anchors',
  home.body.includes('href="/privacy"') && home.body.includes('href="/terms"'));

console.log('\nSecurity headers');
for (const h of ['content-security-policy', 'x-content-type-options', 'x-frame-options',
                 'referrer-policy', 'permissions-policy', 'strict-transport-security']) {
  check(h, home.headers.has(h));
}

console.log('\nCaching');
const asset = home.body.match(/\/assets\/[A-Za-z0-9._-]+\.js/)?.[0];
if (asset) {
  const a = await fetch(origin + asset);
  check('hashed assets immutable',
    (a.headers.get('cache-control') || '').includes('immutable'),
    a.headers.get('cache-control') || 'none');
} else {
  check('found a hashed asset to test', false);
}

console.log(`\n${failed === 0 ? 'All checks passed.' : failed + ' check(s) FAILED.'}\n`);
process.exit(failed === 0 ? 0 : 1);
