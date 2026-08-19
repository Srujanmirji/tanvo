import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import ClientLogin from '../portal/ClientLogin';
import ClientDashboard from '../portal/ClientDashboard';
import { STORAGE_KEYS } from '../lib/constants';
import { useContent } from '../lib/store';

export default function PortalPage() {
  const { clients = [] } = useContent();
  const [searchParams] = useSearchParams();

  const [currentClientId, setCurrentClientId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.clientSession) || null;
    } catch {
      return null;
    }
  });

  // Direct login from URL query param `?code=CODE`
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && clients.length > 0) {
      const match = clients.find((c) => c.accessCode?.toLowerCase() === code.trim().toLowerCase());
      if (match) {
        setCurrentClientId(match.id);
        try {
          localStorage.setItem(STORAGE_KEYS.clientSession, match.id);
        } catch {
          // ignore
        }
      }
    }
  }, [searchParams, clients]);

  const activeClient = clients.find((c) => c.id === currentClientId) || null;

  const handleLogin = (client) => {
    setCurrentClientId(client.id);
    try {
      localStorage.setItem(STORAGE_KEYS.clientSession, client.id);
    } catch {
      // storage error
    }
  };

  const handleSignOut = () => {
    setCurrentClientId(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.clientSession);
    } catch {
      // storage error
    }
  };

  return (
    <>
      <Seo
        title={
          activeClient
            ? `${activeClient.company || activeClient.name} Portal | Tanvo Tech`
            : 'Client Portal | Tanvo Tech'
        }
        description="Client workspace for project tracking, deliverables, milestone approvals, invoicing, and support requests."
        path="/portal"
      />

      {activeClient ? (
        <ClientDashboard client={activeClient} onSignOut={handleSignOut} />
      ) : (
        <ClientLogin onLogin={handleLogin} />
      )}
    </>
  );
}
