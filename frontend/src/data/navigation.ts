import { servicesData } from "./services";
import { approachStepsData } from "./metrics";

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "WORK", href: "#work" },
  { label: "SERVICES", href: "#services" },
  { label: "APPROACH", href: "#approach" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export const navCta = {
  label: "LET'S BUILD",
  href: "#contact",
};

/**
 * Footer link groups. Derived from the same data the rest of the site renders
 * from, so a service or approach step added elsewhere appears here too.
 *
 * `href` is optional: entries without one have no destination on this
 * single-page site and render as plain text rather than as links that go
 * nowhere.
 */
export interface FooterLink {
  label: string;
  href?: string;
  external?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "NAVIGATION",
    links: navItems.map((item) => ({ label: item.label, href: item.href })),
  },
  {
    title: "SERVICES",
    links: servicesData.map((service) => ({
      label: service.title.toUpperCase(),
      href: "#services",
    })),
  },
  {
    title: "APPROACH",
    links: approachStepsData.map((step) => ({
      label: `${step.step} ${step.title}`,
      href: "#approach",
    })),
  },
  {
    // No destinations exist yet — these render as text, not dead links.
    title: "RESOURCES",
    links: [
      { label: "JOURNAL" },
      { label: "CAREERS" },
      { label: "FAQ" },
      { label: "PRIVACY POLICY" },
      { label: "TERMS & CONDITIONS" },
    ],
  },
];
