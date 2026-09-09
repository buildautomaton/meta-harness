import { agentPathEnv } from '../../clients/agent-path.js';
import { runStreamingCommand } from '../run-streaming-command.js';

export async function runNpmGlobalInstall(
  packageName: string,
  env: NodeJS.ProcessEnv,
  options?: { timeoutMs?: number; onLine?: (line: string) => void }
): Promise<void> {
  const result = await runStreamingCommand('npm', ['install', '-g', packageName], {
    env: agentPathEnv(env),
    timeoutMs: options?.timeoutMs ?? 300_000,
    onLine: options?.onLine,
  });
  if (result.code !== 0) {
    throw new Error(`npm install -g ${packageName} failed (exit ${result.code ?? 'signal'})`);
  }
}
