import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@stories': path.resolve(__dirname, './src/stories'),
      '@components': path.resolve(__dirname, './src/components/index'),
      '@components/*': path.resolve(__dirname, './src/components/*'),
      '@pages': path.resolve(__dirname, './src/pages/index'),
      '@pages/*': path.resolve(__dirname, './src/pages/*'),
    },
  },
  plugins: [react()],
  server: {
    port: 8080,
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
