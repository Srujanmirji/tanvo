import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function lockScroll() {
  if (lockCount === 0) {
    const { body } = document;
    // Compensate for the disappearing scrollbar so the page doesn't jump.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
  }
  lockCount += 1;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  }
}

/**
 * Everything a dialog or drawer owes a keyboard and screen-reader user:
 *
 *   - focus moves into the panel on open
 *   - Tab and Shift+Tab cycle within it, never escaping to the page behind
 *   - Escape closes it
 *   - background scrolling is locked (without the layout jump)
 *   - focus returns to whatever opened it on close
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 */
export function useModalBehavior(isOpen, onClose) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest callback without re-running the effect on every render.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const panel = panelRef.current;
    restoreRef.current = document.activeElement;
    lockScroll();

    const focusFirst = () => {
      if (!panel) return;
      const target = panel.querySelector(FOCUSABLE);
      (target ?? panel).focus({ preventScroll: true });
    };
    // Wait a frame so the open transition has committed before focusing.
    const raf = requestAnimationFrame(focusFirst);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
      const restore = restoreRef.current;
      if (restore instanceof HTMLElement && document.contains(restore)) {
        restore.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  return panelRef;
}
