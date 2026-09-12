import * as path from 'node:path';

/**
 * Resolve an agent-supplied path to a real filesystem path that stays under `cwd`.
 * Returns absolute path for I/O, or null if unsafe / outside cwd.
 */
export function resolveSafePathUnderCwd(cwd: string, filePath: string): string | null {
  const trimmed = filePath.trim();
  if (!trimmed) return null;
  const normalizedCwd = path.resolve(cwd);
  const resolved = path.isAbsolute(trimmed) ? path.normalize(trimmed) : path.resolve(normalizedCwd, trimmed);
  const rel = path.relative(normalizedCwd, resolved);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) return null;
  return resolved;
}

/** Path relative to cwd for session / UI (posix-style segments ok on all platforms for display). */
export function toDisplayPathRelativeToCwd(cwd: string, absolutePath: string): string {
  const normalizedCwd = path.resolve(cwd);
  const rel = path.relative(normalizedCwd, path.resolve(absolutePath));
  if (!rel || rel === '') return path.basename(absolutePath);
  return rel.split(path.sep).join('/');
}
