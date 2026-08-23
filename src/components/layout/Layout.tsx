import React from "react";
import { useLenis } from "../../hooks/useLenis";
import { Navbar } from "../navigation/Navbar";
import { CustomCursor } from "./CustomCursor";
import { GrainOverlay } from "./GrainOverlay";
import { BackgroundFallback } from "./BackgroundFallback";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize Lenis smooth scroll ticker
  useLenis();

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#F5FAFF] selection:bg-[#168BFF]/30 selection:text-[#F5FAFF]">
      {/* Background Gradients */}
      <BackgroundFallback />

      {/* Atmospheric Texture & Vignette */}
      <GrainOverlay />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Fixed Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="top" className="relative z-10">
        {children}
      </main>
    </div>
  );
};
