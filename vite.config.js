import { defineConfig } from 'vite';

// No framework plugin: the site is static HTML + one plain script.
// Vite is here for content-hashed asset output and the dev server.
export default defineConfig({
  server: {
    port: 8081,
    host: true,
    allowedHosts: true,
  },
});
