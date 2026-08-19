import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LegalPage from './pages/LegalPage';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';

// The admin bundle is only fetched when someone actually visits /admin,
// so it never costs a public visitor anything.
const AdminPage = lazy(() => import('./pages/AdminPage'));

/**
 * Owns scroll position across navigation.
 *
 * Without a hash: reset to the top on route change.
 *
 * With a hash: scroll to the target ourselves. The browser tries this at
 * initial parse, when the document is still an empty <div id="root"> and
 * the section does not exist yet — so it silently gives up and the
 * visitor lands at the top. Anyone opening a shared tanvo.tech/#contact
 * link would never reach the contact section.
 *
 * Header offset is handled by `scroll-padding-top` in index.css, which
 * scrollIntoView respects.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    const go = () => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'instant', block: 'start' });
      return Boolean(target);
    };

    // Two frames: one for the route to commit, one for layout.
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(go);
    });
    // Late images and webfonts shift layout under us — correct once more.
    const settle = setTimeout(go, 350);

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      clearTimeout(settle);
    };
  }, [pathname, hash]);

  return null;
}

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status">
      <span className="sr-only">Loading…</span>
      <div
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400"
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary label="the application">
      {/* Sits above the routes; self-dismisses and shows once per session. */}
      <Preloader />
      <ScrollManager />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<LegalPage variant="privacy" />} />
          <Route path="/terms" element={<LegalPage variant="terms" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
