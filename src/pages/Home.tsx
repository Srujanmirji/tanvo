import React, { useRef, useCallback } from "react";
import { Hero } from "../components/hero/Hero";
import { StoryContainer } from "../components/story/StoryContainer";
import { SelectedWork } from "../components/work/SelectedWork";
import { Services } from "../components/services/Services";
import { Approach } from "../components/approach/Approach";
import { TrustMetrics } from "../components/trust/TrustMetrics";
import { FinalCta } from "../components/cta/FinalCta";
import { Footer } from "../components/footer/Footer";
import { ExperienceCanvas, ExperienceCanvasRef } from "../three/ExperienceCanvas";
import {
  StoryIndicator,
  StoryIndicatorHandle,
} from "../components/layout/StoryIndicator";

export const Home: React.FC = () => {
  const canvasRef = useRef<ExperienceCanvasRef | null>(null);
  const storyIndicatorRef = useRef<StoryIndicatorHandle | null>(null);

  const handleHeroProgress = useCallback((progress: number) => {
    if (canvasRef.current) {
      canvasRef.current.setStoryProgress(progress);
    }
    storyIndicatorRef.current?.setActiveSection(0);
    storyIndicatorRef.current?.setProgress(progress / 6);
    storyIndicatorRef.current?.setVisible(true);
  }, []);

  const handleStoryProgress = useCallback((continuousProgress: number) => {
    if (canvasRef.current) {
      canvasRef.current.setStoryProgress(continuousProgress);
    }
    storyIndicatorRef.current?.setProgress(continuousProgress / 6);
    storyIndicatorRef.current?.setVisible(continuousProgress <= 6.05);
  }, []);

  const handleActiveSectionChange = useCallback((index: number) => {
    storyIndicatorRef.current?.setActiveSection(index);
  }, []);

  return (
    <div className="relative flex flex-col">
      {/* Unified Persistent Three.js Background Canvas Layer */}
      <ExperienceCanvas ref={canvasRef} />

      {/* Right-Side Unified Story Progress Indicator (01 - 06) */}
      <StoryIndicator ref={storyIndicatorRef} />

      {/* Narrative Flow */}
      <Hero onHeroProgress={handleHeroProgress} />

      <StoryContainer
        onStoryProgress={handleStoryProgress}
        onActiveSectionChange={handleActiveSectionChange}
      />

      <SelectedWork />
      <Services />
      <Approach />
      <TrustMetrics />
      <FinalCta />
      <Footer />
    </div>
  );
};
