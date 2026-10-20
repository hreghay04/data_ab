import { defineConfig } from 'vite';

export default defineConfig({
  base: '/data_lab/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    port: 3000,
  },
});
