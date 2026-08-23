import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface StoryAnimationOptions {
  containerRef: HTMLElement;
  sectionRefs: HTMLElement[];
  onProgressUpdate?: (progress: number) => void;
  onActiveSectionChange?: (index: number) => void;
  prefersReducedMotion?: boolean;
}

/**
 * Initializes continuous storytelling GSAP ScrollTriggers and text choreography.
 */
export function initStoryAnimations(options: StoryAnimationOptions): () => void {
  const {
    containerRef,
    sectionRefs,
    onProgressUpdate,
    onActiveSectionChange,
    prefersReducedMotion = false,
  } = options;

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      sectionRefs.forEach((sec) => {
        gsap.set(
          sec.querySelectorAll(
            ".story-badge, .story-heading-line, .story-desc, .story-tags"
          ),
          { opacity: 1, y: 0 }
        );
      });
    } else {
      // 1. Text entrance and exit animations per story section
      sectionRefs.forEach((section) => {
        const badge = section.querySelector(".story-badge");
        const headingLines = section.querySelectorAll(".story-heading-line");
        const description = section.querySelector(".story-desc");
        const tags = section.querySelector(".story-tags");

        if (badge && headingLines.length && description) {
          // Initial hidden state
          gsap.set(badge, { opacity: 0, y: 12 });
          gsap.set(headingLines, { opacity: 0, y: 24 });
          gsap.set(description, { opacity: 0, y: 18 });
          if (tags) gsap.set(tags, { opacity: 0, y: 12 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play reverse play reverse",
            },
          });

          tl.to(badge, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
            .to(
              headingLines,
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.08,
                ease: "power3.out",
              },
              "-=0.3"
            )
            .to(
              description,
              { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
              "-=0.4"
            );

          if (tags) {
            tl.to(
              tags,
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
              "-=0.4"
            );
          }
        }
      });
    }

    // 2. Keep the WebGL stage and active chapter on the same center-to-center
    // scroll axis. Each integer progress value now lands exactly when its
    // corresponding slide is centered in the viewport.
    if (containerRef && sectionRefs.length > 0) {
      const firstSection = sectionRefs[0];
      const lastSection = sectionRefs[sectionRefs.length - 1];
      let sectionCenters: number[] = [];
      let lastActiveIndex = -1;

      const measureSectionCenters = () => {
        const scrollY = window.scrollY;
        sectionCenters = sectionRefs.map((section) => {
          const rect = section.getBoundingClientRect();
          return scrollY + rect.top + rect.height / 2;
        });
      };

      const syncStoryState = (viewportCenter: number) => {
        if (!sectionCenters.length) return;

        let sectionProgress = 0;
        const finalIndex = sectionCenters.length - 1;

        if (viewportCenter >= sectionCenters[finalIndex]) {
          sectionProgress = finalIndex;
        } else if (viewportCenter > sectionCenters[0]) {
          const nextIndex = sectionCenters.findIndex(
            (center) => center >= viewportCenter
          );
          const previousIndex = Math.max(0, nextIndex - 1);
          const segmentStart = sectionCenters[previousIndex];
          const segmentEnd = sectionCenters[nextIndex];
          const segmentProgress = gsap.utils.clamp(
            0,
            1,
            (viewportCenter - segmentStart) / (segmentEnd - segmentStart)
          );

          sectionProgress = previousIndex + segmentProgress;
        }

        const continuousProgress = 1 + sectionProgress;
        const activeIndex = gsap.utils.clamp(
          0,
          finalIndex,
          Math.round(sectionProgress)
        );

        onProgressUpdate?.(continuousProgress);

        if (activeIndex !== lastActiveIndex) {
          lastActiveIndex = activeIndex;
          onActiveSectionChange?.(activeIndex);
        }
      };

      measureSectionCenters();

      ScrollTrigger.create({
        id: "tanvo-story-sync",
        trigger: firstSection,
        start: "center center",
        endTrigger: lastSection,
        end: "center center",
        invalidateOnRefresh: true,
        refreshPriority: 5,
        onRefresh: measureSectionCenters,
        onUpdate: (self) => {
          if (!self.isActive && self.progress === 0) return;
          syncStoryState(self.scroll() + window.innerHeight / 2);
        },
        onEnter: (self) =>
          syncStoryState(self.scroll() + window.innerHeight / 2),
        onEnterBack: (self) =>
          syncStoryState(self.scroll() + window.innerHeight / 2),
        onLeave: () => syncStoryState(sectionCenters[sectionCenters.length - 1]),
      });
    }
  }, containerRef);

  return () => ctx.revert();
}
