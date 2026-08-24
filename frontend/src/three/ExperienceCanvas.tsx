import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { HeroCrystalScene } from "./components/HeroCrystalScene";
import { useIsMobile } from "../hooks/useIsMobile";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useWebGLAvailability } from "../hooks/useWebGLAvailability";

export interface ExperienceCanvasRef {
  setStoryProgress: (progress: number) => void;
  setScrollProgress: (progress: number) => void;
}

export const ExperienceCanvas = forwardRef<ExperienceCanvasRef, { className?: string }>(
  ({ className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<HeroCrystalScene | null>(null);
    const isMobile = useIsMobile();
    const prefersReducedMotion = useReducedMotion();
    const isWebGLSupported = useWebGLAvailability();

    useImperativeHandle(ref, () => ({
      setStoryProgress: (progress: number) => {
        if (sceneRef.current) {
          sceneRef.current.setStoryProgress(progress);
        }
      },
      setScrollProgress: (progress: number) => {
        if (sceneRef.current) {
          sceneRef.current.setStoryProgress(progress);
        }
      },
    }));

    useEffect(() => {
      if (!isWebGLSupported || !containerRef.current || typeof window === "undefined") return;

      const scene = new HeroCrystalScene({
        container: containerRef.current,
        isMobile,
        prefersReducedMotion,
      });

      sceneRef.current = scene;

      const handleResize = () => {
        scene.onResize(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize, { passive: true });

      return () => {
        window.removeEventListener("resize", handleResize);
        scene.destroy();
        sceneRef.current = null;
      };
    }, [isWebGLSupported, isMobile, prefersReducedMotion]);

    if (!isWebGLSupported) {
      return (
        <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
          {/* Static SVG fallback visual for non-WebGL */}
          <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[380px] h-[480px] opacity-85">
            <svg viewBox="0 0 400 500" fill="none" className="w-full h-full">
              <defs>
                <radialGradient id="fallbackCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#168BFF" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#168BFF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="facetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a2233" />
                  <stop offset="100%" stopColor="#06111f" />
                </linearGradient>
                <linearGradient id="facetGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#071a30" />
                  <stop offset="100%" stopColor="#1c2538" />
                </linearGradient>
              </defs>
              <circle cx="200" cy="250" r="140" fill="url(#fallbackCore)" />
              <polygon points="200,60 310,180 200,320 90,180" fill="url(#facetGrad1)" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.4" />
              <polygon points="200,320 310,180 260,420 200,440" fill="url(#facetGrad2)" stroke="#4DE8FF" strokeWidth="1" strokeOpacity="0.3" />
              <polygon points="200,320 90,180 140,420 200,440" fill="url(#facetGrad1)" stroke="#168BFF" strokeWidth="1" strokeOpacity="0.3" />
              <polygon points="200,60 200,320 140,420 200,440" fill="none" stroke="#F5FAFF" strokeWidth="1" strokeOpacity="0.15" />
            </svg>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      />
    );
  }
);

ExperienceCanvas.displayName = "ExperienceCanvas";
