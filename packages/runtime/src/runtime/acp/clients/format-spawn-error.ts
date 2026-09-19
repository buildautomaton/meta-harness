export function formatSpawnError(err: NodeJS.ErrnoException, command: string): string {
  if (err.code === 'ENOENT') {
    return `Command "${command}" not found. Install the agent (e.g. Cursor CLI) or add it to PATH.`;
  }
  return err.message || String(err);
}
