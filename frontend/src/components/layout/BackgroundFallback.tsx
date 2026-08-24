import React from "react";

export const BackgroundFallback: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#000000]"
      aria-hidden="true"
    >
      {/* Deep atmospheric gradients */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-radial-[circle,rgba(22, 139, 255,0.06)_0%,transparent_70%] blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[800px] h-[800px] bg-radial-[circle,rgba(7, 26, 48,0.8)_0%,transparent_70%] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[900px] h-[900px] bg-radial-[circle,rgba(77, 232, 255,0.03)_0%,transparent_70%] blur-3xl pointer-events-none" />
    </div>
  );
};
