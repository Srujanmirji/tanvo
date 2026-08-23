import React from "react";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";

export const App: React.FC = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default App;
