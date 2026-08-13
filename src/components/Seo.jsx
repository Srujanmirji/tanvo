import { SITE, SITE_URL } from '../lib/constants';

/**
 * Per-route document metadata.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the
 * tree into <head>, so no helmet library is needed.
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
  const canonical = `${SITE_URL}${path}`;
  // Open Graph requires an absolute URL — a relative path renders no preview.
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex, nofollow, noarchive" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </>
  );
}
