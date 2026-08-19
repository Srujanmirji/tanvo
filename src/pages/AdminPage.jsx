import Seo from '../components/Seo';
import ErrorBoundary from '../components/ErrorBoundary';
import AdminGate from '../admin/AdminGate';
import AdminDashboard from '../admin/AdminDashboard';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminPage() {
  const { isAuthenticated, expiresAt, pending, error, signIn, signOut, devUnlock } = useAdminAuth();

  return (
    <>
      <Seo
        title="Team dashboard"
        description="Private content management for the Tanvo Tech team."
        path="/admin"
        noindex
      />

      <ErrorBoundary label="the dashboard">
        {isAuthenticated ? (
          <AdminDashboard onSignOut={signOut} expiresAt={expiresAt} />
        ) : (
          <AdminGate
            onSubmit={signIn}
            onDevUnlock={devUnlock}
            pending={pending}
            error={error}
          />
        )}
      </ErrorBoundary>
    </>
  );
}
