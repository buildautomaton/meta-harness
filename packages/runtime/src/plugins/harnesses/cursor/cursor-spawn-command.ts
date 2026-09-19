/** Full argv for spawn, including Cursor CLI `--mode` when session mode is ask/plan. */
export function buildCursorAcpSpawnCommand(base: string[], sessionMode?: string): string[] {
  if (!sessionMode) return [...base];
  const m = sessionMode.trim();
  if (m !== 'ask' && m !== 'plan') return [...base];
  return [...base, '--mode', m];
}
