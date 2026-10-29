import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  css: { preprocessorOptions: { scss: { silenceDeprecations: ['legacy-js-api'] } } },
  build: { outDir: 'dist', sourcemap: false },
});
