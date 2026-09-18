import { mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync, appendFileSync, unlinkSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import type { FileStore } from '@/types/file-store/implementation.js';

export function createNodeFileStore(root: string): FileStore {
  mkdirSync(root, { recursive: true });
  const resolve = (p: string) => (isAbsolute(p) ? p : join(root, p));
  return {
    read(path) {
      const full = resolve(path);
      if (!existsSync(full)) return null;
      return readFileSync(full, 'utf8');
    },
    write(path, content) {
      writeFileSync(resolve(path), content);
    },
    append(path, content) {
      appendFileSync(resolve(path), content);
    },
    remove(path) {
      const full = resolve(path);
      if (existsSync(full)) unlinkSync(full);
    },
    mkdir(path) {
      mkdirSync(resolve(path), { recursive: true });
    },
    list(dir) {
      const full = resolve(dir);
      return existsSync(full) ? readdirSync(full) : [];
    },
    exists(path) {
      return existsSync(resolve(path));
    },
  };
}
