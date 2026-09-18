import path from 'node:path';
import { defineConfig } from 'tsup';

const src = path.resolve(__dirname, 'src');

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  tsconfig: './tsconfig.json',
  esbuildOptions(options) {
    options.alias = {
      '@/types': `${src}/types`,
      '@plugins': `${src}/plugins`,
    };
  },
});
