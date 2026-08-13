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

/** Reset scroll on navigation, but leave in-page #anchors alone. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      <ScrollToTop />
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
