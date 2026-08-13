import Seo from '../components/Seo';
import ErrorBoundary from '../components/ErrorBoundary';
import AdminGate from '../admin/AdminGate';
import AdminDashboard from '../admin/AdminDashboard';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminPage() {
  const { isAuthenticated, expiresAt, pending, error, signIn, signOut } = useAdminAuth();

  return (
    <>
      {/*
        noindex + nofollow keeps this out of search results. It is also
        listed under Disallow in /robots.txt. Neither is a security
        control — see src/lib/auth.js for what this gate does and does not do.
      */}
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
          <AdminGate onSubmit={signIn} pending={pending} error={error} />
        )}
      </ErrorBoundary>
    </>
  );
}
