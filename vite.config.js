import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Juurikansio
  build: {
    outDir: 'dist', // Minne build menee (railway tarjoilee tämän)
    emptyOutDir: true,
  },
  server: {
    open: true,
  }
});