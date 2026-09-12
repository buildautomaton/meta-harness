/** Join stdout/stderr from a subprocess into one log string (preserves line breaks). */
export function formatCommandOutput(stdout: string | Buffer, stderr: string | Buffer): string {
  const parts = [String(stdout ?? '').trimEnd(), String(stderr ?? '').trimEnd()].filter(Boolean);
  return parts.join('\n');
}
