import { agentPathEnv } from '../../clients/agent-path.js';
import { runStreamingCommand } from '../../install/run-streaming-command.js';
import type { AgentProviderInstall } from '../types.js';

export const cursorInstall: AgentProviderInstall = {
  detectCommand: 'agent',
  alternateDetectCommands: ['cursor-agent'],
  tokenEnvVar: 'CURSOR_API_KEY',
  async run(ctx) {
    ctx.onProgress?.('Installing Cursor CLI');
    const result = await runStreamingCommand(
      'bash',
      ['-lc', 'curl -fsSL https://cursor.com/install | bash'],
      {
        timeoutMs: 300_000,
        env: { ...agentPathEnv(ctx.env), CURSOR_API_KEY: ctx.authToken },
        onLine: (line: string) => ctx.onProgress?.('Installing Cursor CLI', line),
      },
    );
    if (result.code !== 0) {
      throw new Error(`Cursor CLI install failed (exit ${result.code ?? 'signal'})`);
    }
  },
};
