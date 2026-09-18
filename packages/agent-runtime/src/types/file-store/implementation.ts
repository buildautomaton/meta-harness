/** Filesystem operations. Paths may be absolute or relative to the store root. */
export type FileStore = {
  read(path: string): string | null;
  write(path: string, content: string): void;
  append(path: string, content: string): void;
  remove(path: string): void;
  mkdir(path: string): void;
  list(dir: string): string[];
  exists(path: string): boolean;
};
