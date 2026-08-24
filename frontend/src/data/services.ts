export interface ServiceItemData {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  capabilities: string[];
  visualType: "strategy" | "branding" | "uiux" | "webdev" | "ai" | "experience";
}

export const servicesData: ServiceItemData[] = [
  {
    id: "strategy",
    number: "01",
    title: "Strategy",
    tagline: "CLARIFY THE CORE",
    description: "We deconstruct the core premise, extract true competitive advantages, and map the technical and creative trajectory before a single pixel is designed.",
    deliverables: [
      "Product Vision & Scope",
      "Technical Architecture",
      "Market Positioning",
      "Ecosystem Roadmapping",
    ],
    capabilities: ["Discovery Sprints", "Feasibility Audits", "Systems Architecture", "Opportunity Mapping"],
    visualType: "strategy",
  },
  {
    id: "branding",
    number: "02",
    title: "Branding",
    tagline: "FORGE VISUAL AUTHORITY",
    description: "Designing modern visual identities, typographic systems, and bespoke design languages that establish enduring cultural authority and market distinction.",
    deliverables: [
      "Visual Identity Systems",
      "Editorial Typography",
      "Motion & Interaction Rules",
      "Brand Guidelines & Toolkits",
    ],
    capabilities: ["Brand Systems", "Logomarks & Geometry", "Typefoundry Direction", "Iconography"],
    visualType: "branding",
  },
  {
    id: "uiux",
    number: "03",
    title: "UI / UX",
    tagline: "MAKE COMPLEXITY EFFORTLESS",
    description: "Crafting intuitive, editorial-grade digital interfaces designed around human behavior—turning high-density workflows into fluid, memorable experiences.",
    deliverables: [
      "Product Interface Design",
      "Design Systems & Tokens",
      "Interaction Choreography",
      "Usability Prototyping",
    ],
    capabilities: ["Multi-Modal Interfaces", "Micro-Interactions", "Figma Design Systems", "User Journeys"],
    visualType: "uiux",
  },
  {
    id: "webdev",
    number: "04",
    title: "Web Development",
    tagline: "ENGINEER TO SCALE",
    description: "Architecting high-performance websites and web applications with robust engineering, modern frameworks, and sub-second load times built for the real world.",
    deliverables: [
      "Full-Stack Web Engineering",
      "Custom CMS Architectures",
      "API & Cloud Integration",
      "Core Web Vitals Tuning",
    ],
    capabilities: ["React 19 / TypeScript", "Edge Computing", "Serverless Infrastructure", "Sub-second TTFB"],
    visualType: "webdev",
  },
  {
    id: "ai",
    number: "05",
    title: "AI Integration",
    tagline: "EMBED INTELLIGENCE",
    description: "Embedding custom AI workflows, autonomous agent orchestration, and real-time generative intelligence directly into core user experiences.",
    deliverables: [
      "Custom Model Pipelines",
      "Agentic Workflow Systems",
      "Prompt & Context Architecture",
      "Real-Time Inference UI",
    ],
    capabilities: ["LLM Orchestration", "Vector Databases", "Streaming Interfaces", "Multi-Agent Networks"],
    visualType: "ai",
  },
  {
    id: "experience",
    number: "06",
    title: "Digital Experiences",
    tagline: "IMMERSIVE SPATIAL WORLDS",
    description: "Creating award-level WebGL worlds, GLSL shader installations, and interactive storytelling environments that capture imagination and drive deep engagement.",
    deliverables: [
      "3D WebGL Environments",
      "GLSL Custom Shaders",
      "Interactive Storytelling",
      "Spatial Web Experiences",
    ],
    capabilities: ["Three.js / WebGPU", "Physics & Particle Swarms", "GSAP Choreography", "Sound & Haptics"],
    visualType: "experience",
  },
];
