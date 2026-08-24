import React from "react";
// The /react entry point, not /next — this is a Vite SPA, and /next imports
// next/navigation. Analytics is inert outside Vercel deployments.
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";

export const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Home />
      </Layout>
      <Analytics />
    </>
  );
};

export default App;
