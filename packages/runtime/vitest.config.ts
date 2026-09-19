import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@/types': path.resolve(__dirname, 'src/types'),
      '@runtime': path.resolve(__dirname, 'src/runtime'),
      '@plugins': path.resolve(__dirname, 'src/plugins'),
    },
  },
});
