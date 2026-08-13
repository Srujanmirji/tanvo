import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], .interactive-hover';

/**
 * A dot that tracks the pointer exactly and a ring that eases behind it.
 *
 * Rewritten from the original for three reasons:
 *   1. It set React state on every mousemove — a re-render per pixel.
 *      Now both elements are driven by direct transform writes inside a
 *      single rAF loop, so React renders once and never again.
 *   2. `cursor: none` was applied unconditionally in CSS, leaving users
 *      with no cursor at all if JS failed. The `.has-custom-cursor` class
 *      is now added here, only once the cursor is actually running.
 *   3. The rAF loop ran forever. It now parks itself when the pointer is
 *      at rest and on tab blur.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const hasFinePointer =
      window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

    // Touch devices and reduced-motion users keep the native cursor.
    if (!hasFinePointer || prefersReducedMotion) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pointer };
    let frame = null;
    let visible = false;

    const setVisibility = (next) => {
      if (visible === next) return;
      visible = next;
      const opacity = next ? '1' : '0';
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    };

    const render = () => {
      const dx = pointer.x - ringPos.x;
      const dy = pointer.y - ringPos.y;
      ringPos.x += dx * 0.15;
      ringPos.y += dy * 0.15;

      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;

      // Park the loop once the ring has caught up — no idle CPU burn.
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        frame = null;
        return;
      }
      frame = requestAnimationFrame(render);
    };

    const wake = () => {
      if (frame === null) frame = requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setVisibility(true);
      // The dot must never lag, so write it immediately.
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      wake();
    };

    const handlePointerOver = (event) => {
      const clickable = event.target instanceof Element && event.target.closest(INTERACTIVE);
      document.body.classList.toggle('custom-cursor-hover', Boolean(clickable));
    };

    const handleLeave = () => setVisibility(false);
    const handleEnter = () => setVisibility(true);

    const handleBlur = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    setVisibility(false);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('blur', handleBlur);
      if (frame !== null) cancelAnimationFrame(frame);
      root.classList.remove('has-custom-cursor');
      document.body.classList.remove('custom-cursor-hover');
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden="true">
      <div ref={dotRef} className="custom-cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="custom-cursor-ring" style={{ opacity: 0 }} />
    </div>
  );
}
