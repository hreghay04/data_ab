import { defineConfig } from 'vite';

export default defineConfig({
  base: '/data_ab/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    port: 3000,
  },
});
