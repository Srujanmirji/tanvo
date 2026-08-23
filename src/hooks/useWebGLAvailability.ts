import { useState } from "react";

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function useWebGLAvailability(): boolean {
  const [isSupported] = useState<boolean>(checkWebGLSupport);
  return isSupported;
}
