import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Split vendor code out of the app chunk so it caches independently
    // across deploys. Rolldown (Vite 8) requires the function form.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router)/.test(id)) {
            return 'react';
          }
          if (id.includes('lucide-react')) return 'icons';
          return 'vendor';
        },
      },
    },
  },
});
