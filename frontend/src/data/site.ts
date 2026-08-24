export interface SiteConfig {
  name: string;
  tagline: string;
  heroEyebrow: string;
  heroHeadline: {
    line1: string;
    line2: string;
    line3: string;
  };
  heroSupportingText: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  finalCta: {
    badge: string;
    headline: {
      line1: string;
      line2: string;
      line3: string;
    };
    supportingText: string;
    primaryBtn: string;
    secondaryBtn: string;
  };
  contact: {
    email: string;
    location: string;
  };
  socials: {
    name: string;
    href: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "TANVO",
  tagline: "WE BUILD WHAT YOU IMAGINE.",
  heroEyebrow: "DIGITAL DREAMS. REAL IMPACT.",
  heroHeadline: {
    line1: "WE BUILD",
    line2: "WHAT YOU",
    line3: "IMAGINE.",
  },
  heroSupportingText: "We turn ambitious ideas into digital products, experiences and brands built for the real world.",
  primaryCta: {
    label: "START YOUR PROJECT",
    href: "#contact",
  },
  secondaryCta: {
    label: "SEE THE WORK",
    href: "#work",
  },
  finalCta: {
    badge: "13 / CONTACT",
    headline: {
      line1: "READY TO",
      line2: "BUILD SOMETHING",
      line3: "REAL?",
    },
    supportingText: "Bring us the idea. We'll help you turn it into reality.",
    primaryBtn: "LET'S BUILD",
    secondaryBtn: "VIEW SELECTED WORK",
  },
  contact: {
    email: "hello@tanvo.in",
    location: "SINGAPORE • SAN FRANCISCO • LONDON",
  },
  socials: [
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "X", href: "https://x.com" },
  ],
};
