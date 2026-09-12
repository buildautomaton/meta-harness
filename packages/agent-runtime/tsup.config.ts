import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    plugins: 'src/plugins/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  tsconfig: './tsconfig.json',
});
