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
