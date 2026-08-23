import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface StoryAnimationOptions {
  containerRef: HTMLElement;
  trackRef: HTMLElement;
  sectionRefs: HTMLElement[];
  onProgressUpdate?: (progress: number) => void;
  onActiveSectionChange?: (index: number) => void;
  prefersReducedMotion?: boolean;
}

/**
 * Scroll budget per chapter, in viewport heights. A slide locks in place for
 * HOLD_VH of scrolling before it travels to the next one over TRANSITION_VH,
 * so the narrative reads as a series of beats rather than a continuous drift.
 *
 * TRANSITION_VH stays at 1 so a slide covers one viewport of travel per
 * viewport of scrolling: the step reads at normal scroll speed instead of
 * whipping past. Shortening it makes the content outrun the wheel.
 */
const HOLD_VH = 0.5;
const TRANSITION_VH = 1;

const COPY_SELECTOR =
  ".story-badge, .story-heading-line, .story-desc, .story-tags";

/**
 * Scroll position that parks each chapter in view. Chapters live inside a pin,
 * so their document offsets are all identical and cannot be linked to directly.
 */
let chapterScrollPositions: number[] = [];

export function getChapterScrollPosition(index: number): number | null {
  return chapterScrollPositions[index] ?? null;
}

/**
 * Initializes the pinned story deck and its text choreography.
 */
export function initStoryAnimations(options: StoryAnimationOptions): () => void {
  const {
    containerRef,
    trackRef,
    sectionRefs,
    onProgressUpdate,
    onActiveSectionChange,
    prefersReducedMotion = false,
  } = options;

  const ctx = gsap.context(() => {
    const slideCount = sectionRefs.length;
    if (!slideCount) return;

    let lastActiveIndex = -1;

    // Chapter progress is published on the same 1..6 axis the WebGL stage and
    // the story indicator already expect.
    const publish = (chapterProgress: number) => {
      onProgressUpdate?.(1 + chapterProgress);

      const activeIndex = gsap.utils.clamp(
        0,
        slideCount - 1,
        Math.round(chapterProgress)
      );

      if (activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;
        onActiveSectionChange?.(activeIndex);
      }
    };

    // Reduced motion never pins: the slides stay in normal document flow and
    // the stage simply tracks how far through the section the reader is.
    if (prefersReducedMotion) {
      sectionRefs.forEach((section) => {
        gsap.set(section.querySelectorAll(COPY_SELECTOR), { opacity: 1, y: 0 });
      });

      ScrollTrigger.create({
        id: "tanvo-story-sync",
        trigger: containerRef,
        start: "top center",
        end: "bottom center",
        invalidateOnRefresh: true,
        refreshPriority: 5,
        onRefresh: () => {
          chapterScrollPositions = sectionRefs.map(
            (section) => section.getBoundingClientRect().top + window.scrollY
          );
        },
        onUpdate: (self) => publish(self.progress * (slideCount - 1)),
      });

      return;
    }

    sectionRefs.forEach((section, index) => {
      if (index === 0) return;
      gsap.set(section.querySelectorAll(COPY_SELECTOR), { opacity: 0, y: 24 });
    });

    const totalScroll = () =>
      window.innerHeight *
      (slideCount * HOLD_VH + (slideCount - 1) * TRANSITION_VH);

    // The stage progress rides its own tween inside the timeline, so it holds
    // while the slide holds and eases exactly when the slide travels.
    const chapter = { progress: 0 };

    const mapChapters = (self: ScrollTrigger) => {
      const span = self.end - self.start;
      const duration = tl.duration();
      if (!span || !duration) return;

      chapterScrollPositions = sectionRefs.map((_, index) => {
        // Aim at the middle of the chapter's hold, so a jump lands on a beat
        // rather than mid-travel.
        const holdMiddle = index * (HOLD_VH + TRANSITION_VH) + HOLD_VH * 0.5;
        return self.start + (holdMiddle / duration) * span;
      });
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        id: "tanvo-story-deck",
        trigger: containerRef,
        start: "top top",
        end: () => `+=${totalScroll()}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        refreshPriority: 5,
        onRefresh: mapChapters,
      },
    });

    // First chapter assembles as the deck locks in.
    tl.from(
      sectionRefs[0].querySelectorAll(COPY_SELECTOR),
      {
        opacity: 0,
        y: 24,
        duration: HOLD_VH * 0.5,
        stagger: 0.05,
        ease: "power3.out",
      },
      0
    );

    let cursor = HOLD_VH;

    for (let index = 1; index < slideCount; index++) {
      const outgoing = sectionRefs[index - 1].querySelectorAll(COPY_SELECTOR);
      const incoming = sectionRefs[index].querySelectorAll(COPY_SELECTOR);

      tl.to(
        trackRef,
        {
          // Measured from layout, so it survives resizes and any slide height.
          y: () => -sectionRefs[index].offsetTop,
          duration: TRANSITION_VH,
          ease: "sine.inOut",
        },
        cursor
      )
        .to(
          chapter,
          {
            progress: index,
            duration: TRANSITION_VH,
            ease: "sine.inOut",
            onUpdate: () => publish(chapter.progress),
          },
          cursor
        )
        .to(
          outgoing,
          {
            opacity: 0,
            y: -18,
            duration: TRANSITION_VH * 0.45,
            ease: "power2.in",
          },
          cursor
        )
        .to(
          incoming,
          {
            opacity: 1,
            y: 0,
            duration: TRANSITION_VH * 0.55,
            stagger: 0.04,
            ease: "power3.out",
          },
          cursor + TRANSITION_VH * 0.45
        );

      cursor += TRANSITION_VH + HOLD_VH;
    }

    // The final chapter earns the same beat as the others before the deck
    // releases; without it the timeline ends the instant slide six arrives.
    tl.to({}, { duration: HOLD_VH });

    if (tl.scrollTrigger) mapChapters(tl.scrollTrigger);
  }, containerRef);

  return () => {
    chapterScrollPositions = [];
    ctx.revert();
  };
}
