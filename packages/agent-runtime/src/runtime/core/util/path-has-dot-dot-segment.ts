/**
 * True when a path contains a `..` segment (parent traversal).
 * Does not treat Next.js catch-all folders like `[[...slug]]` as unsafe
 * (those contain the substring `..` but not a `..` segment).
 */
export function pathHasDotDotSegment(path: string): boolean {
  if (!path) return false;
  return path.split(/[/\\]/).includes('..');
}
