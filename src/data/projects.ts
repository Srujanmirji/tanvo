export interface ProjectData {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  services: string[];
  technologies: string[];
  visualTheme: {
    accent: string;
    bgGlow: string;
    type: "ai" | "fintech" | "saas" | "commerce";
  };
  metricsPlaceholder: {
    value: string;
    label: string;
  };
  ctaLabel: string;
  href: string;
}

export const projectsData: ProjectData[] = [
  {
    id: "nova",
    slug: "nova",
    number: "01",
    title: "NOVA",
    category: "AI PRODUCT",
    year: "2026",
    description: "Next-generation generative design intelligence platform converting complex prompt architectures into production design systems and multi-modal spatial assets.",
    services: ["AI Strategy", "Interface Design", "System Architecture"],
    technologies: ["Custom Models", "WebGL", "Real-Time Inference", "TypeScript"],
    visualTheme: {
      accent: "#168BFF",
      bgGlow: "rgba(22, 139, 255, 0.15)",
      type: "ai",
    },
    metricsPlaceholder: {
      value: "14ms",
      label: "INFERENCE LATENCY",
    },
    ctaLabel: "DISCUSS A PROJECT LIKE NOVA",
    href: "#contact",
  },
  {
    id: "arc",
    slug: "arc",
    number: "02",
    title: "ARC",
    category: "FINTECH PLATFORM",
    year: "2025",
    description: "Institutional digital liquidity infrastructure and high-frequency settlement terminal engineered for microsecond execution and sub-pixel precision data visualization.",
    services: ["Trading UI / UX", "Full-Stack Development", "Performance Tuning"],
    technologies: ["React 19", "WebSockets", "Canvas 2D", "Rust Backend"],
    visualTheme: {
      accent: "#4DE8FF",
      bgGlow: "rgba(77, 232, 255, 0.15)",
      type: "fintech",
    },
    metricsPlaceholder: {
      value: "$4.2B+",
      label: "DAILY LIQUIDITY PIPELINE",
    },
    ctaLabel: "DISCUSS A PROJECT LIKE ARC",
    href: "#contact",
  },
  {
    id: "orbit",
    slug: "orbit",
    number: "03",
    title: "ORBIT",
    category: "SAAS PLATFORM",
    year: "2025",
    description: "Collaborative spatial computing workspace bringing distributed engineering and product architecture teams together across synchronized multi-dimensional canvases.",
    services: ["Product Strategy", "Spatial UI", "Cloud Infrastructure"],
    technologies: ["Three.js", "CRDTs", "Edge Functions", "Tailwind CSS"],
    visualTheme: {
      accent: "#168BFF",
      bgGlow: "rgba(22, 139, 255, 0.12)",
      type: "saas",
    },
    metricsPlaceholder: {
      value: "99.99%",
      label: "SYNC UPTIME",
    },
    ctaLabel: "DISCUSS A PROJECT LIKE ORBIT",
    href: "#contact",
  },
  {
    id: "mono",
    slug: "mono",
    number: "04",
    title: "MONO",
    category: "E-COMMERCE",
    year: "2024",
    description: "Luxury digital commerce flagship with bespoke 3D interactive product configurators, editorial typography choreography, and sub-second frictionless checkout.",
    services: ["Branding", "E-Commerce Architecture", "Creative Direction"],
    technologies: ["Headless Shopify", "GLSL Shaders", "GSAP", "Lenis"],
    visualTheme: {
      accent: "#F5FAFF",
      bgGlow: "rgba(245, 250, 255, 0.12)",
      type: "commerce",
    },
    metricsPlaceholder: {
      value: "3.4x",
      label: "CONVERSION VELOCITY",
    },
    ctaLabel: "DISCUSS A PROJECT LIKE MONO",
    href: "#contact",
  },
];
