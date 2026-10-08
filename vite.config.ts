import { defineConfig } from 'vite';

// Относительный base: сборка корректно работает из любого подкаталога,
// включая GitHub Pages (https://username.github.io/repo/).
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
});
