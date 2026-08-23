export interface ApproachStepData {
  step: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  principle: string;
}

export interface TrustCapabilityData {
  number: string;
  headline: string;
  pillar: string;
  capabilityBadge: string;
  description: string;
  standards: string[];
}

export const approachStepsData: ApproachStepData[] = [
  {
    step: "01",
    title: "THINK",
    tagline: "DEFINE THE CORE PROBLEM",
    description: "We deconstruct the premise, identify market opportunities, and formulate the exact technical and architectural direction before designing or coding.",
    deliverables: ["Discovery Blueprint", "System Architecture", "Feasibility Audit", "Product Roadmap"],
    principle: "Strategy before execution.",
  },
  {
    step: "02",
    title: "DESIGN",
    tagline: "MAKE IT VISCERAL & REAL",
    description: "We translate strategy into cohesive visual identities, high-fidelity interfaces, and fluid interaction systems tailored to human psychology.",
    deliverables: ["Design Systems", "Interactive Prototypes", "Editorial Typography", "Design Tokens"],
    principle: "Form follows intent.",
  },
  {
    step: "03",
    title: "BUILD",
    tagline: "ENGINEER TO SCALE",
    description: "We build resilient, lightweight, and high-performance digital products using modern web frameworks, WebGL, and edge-native architectures.",
    deliverables: ["Production Web App", "Custom AI Pipelines", "WebGL / Shaders", "Performance Tuning"],
    principle: "Precision in every byte.",
  },
  {
    step: "04",
    title: "LAUNCH",
    tagline: "DELIVER MAXIMUM IMPACT",
    description: "We deploy with zero downtime, fine-tuned performance budgets, real-time telemetry, and ongoing evolution strategies.",
    deliverables: ["Zero-Downtime Deployment", "Observability Setup", "Launch Playbook", "Growth Readiness"],
    principle: "Ship, measure, and evolve.",
  },
];

export const trustCapabilitiesData: TrustCapabilityData[] = [
  {
    number: "01",
    headline: "PERFORMANCE",
    pillar: "BUILT FOR SPEED",
    capabilityBadge: "ENGINEERED VELOCITY",
    description: "Engineered from the ground up for sub-second page transitions, zero layout shifts, and instantaneous interactive response across all devices.",
    standards: ["Fast Initial Render", "60 FPS WebGL Layer", "Optimized Asset Budgets"],
  },
  {
    number: "02",
    headline: "ENGINEERING",
    pillar: "ARCHITECTED TO SCALE",
    capabilityBadge: "MODULAR RESILIENCE",
    description: "Modern modular codebases built with strict TypeScript, edge-distributed infrastructure, and cloud architectures that scale gracefully with growth.",
    standards: ["Type-Safe Codebases", "Edge-Native APIs", "Automated Pipelines"],
  },
  {
    number: "03",
    headline: "EXPERIENCE",
    pillar: "DESIGNED FOR CLARITY",
    capabilityBadge: "HUMAN ERGONOMICS",
    description: "Intuitive, high-density interfaces designed around human ergonomics—accessible to every user, keyboard-navigable, and naturally legible.",
    standards: ["Accessible Contrast", "Semantic Document Tree", "Keyboard Choreography"],
  },
  {
    number: "04",
    headline: "SYSTEMS",
    pillar: "BUILT TO EVOLVE",
    capabilityBadge: "FUTURE-PROOF",
    description: "Design systems and software architectures designed to outlast trends, adapt to new AI capabilities, and expand seamlessly over time.",
    standards: ["Atomic Token Systems", "Modular Data Layers", "Extensible Integrations"],
  },
];
