/** Default working directory for agent subprocesses when the host does not pass cwd. */
export function getDefaultAgentCwd(): string {
  return process.cwd();
}
