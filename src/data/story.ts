export interface StorySectionData {
  id: string;
  stepNumber: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  visualTheme: string;
}

export const storySectionsData: StorySectionData[] = [
  {
    id: "idea",
    stepNumber: "01",
    badge: "01 / IDEA",
    titleLine1: "EVERYTHING STARTS",
    titleLine2: "WITH AN IDEA.",
    description: "A problem. A thought. A possibility. Every product begins somewhere.",
    visualTheme: "cyan particle field",
  },
  {
    id: "vision",
    stepNumber: "02",
    badge: "02 / VISION",
    titleLine1: "THEN WE GIVE",
    titleLine2: "IT DIRECTION.",
    description: "We turn your idea into a clear product, experience and digital direction.",
    visualTheme: "wireframe landscape",
  },
  {
    id: "design",
    stepNumber: "03",
    badge: "03 / DESIGN",
    titleLine1: "WE MAKE IT",
    titleLine2: "FEEL REAL.",
    description: "Beautiful, intuitive interfaces designed around the people who use them.",
    visualTheme: "floating product interfaces",
  },
  {
    id: "build",
    stepNumber: "04",
    badge: "04 / BUILD",
    titleLine1: "THEN WE",
    titleLine2: "BUILD IT.",
    description: "Engineered for speed. Built to scale. Designed to last.",
    visualTheme: "code/data environment",
  },
  {
    id: "launch",
    stepNumber: "05",
    badge: "05 / LAUNCH",
    titleLine1: "UNTIL THE IDEA",
    titleLine2: "BECOMES REAL.",
    description: "We launch with precision and prepare the product for the real world.",
    visualTheme: "cinematic launch",
  },
  {
    id: "impact",
    stepNumber: "06",
    badge: "06 / IMPACT",
    titleLine1: "BUILD SOMETHING",
    titleLine2: "PEOPLE REMEMBER.",
    description: "Digital products that create impact, drive growth and change businesses.",
    visualTheme: "finished products ecosystem",
  },
];
