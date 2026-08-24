import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    glsl({
      include: [
        '**/*.glsl', '**/*.wgsl',
        '**/*.vert', '**/*.frag',
        '**/*.vs', '**/*.fs'
      ],
    }),
  ],
  resolve: {
    // One React instance, always. A second copy makes every hook call throw.
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Vite's dependency scanner does not reach this subpath on its own, so in
    // dev it was served unbundled and resolved its own React.
    include: ['@vercel/analytics/react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          lenis: ['lenis'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
