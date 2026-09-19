import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.resolve(__dirname);

export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:3333' },
    },
    fs: { allow: [path.resolve(root, '..')] },
  },
  build: { outDir: 'dist' },
});
