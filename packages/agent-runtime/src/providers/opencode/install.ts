import { runNpmGlobalInstall } from '../../install/commands/run-npm-global-install.js';
import type { AgentProviderInstall } from '../types.js';

export const opencodeInstall: AgentProviderInstall = {
  detectCommand: 'opencode',
  tokenEnvVar: 'OPENCODE_API_KEY',
  async run(ctx) {
    ctx.onProgress?.('Installing OpenCode');
    await runNpmGlobalInstall(
      'opencode-ai',
      { ...ctx.env, OPENCODE_API_KEY: ctx.authToken },
      { onLine: (line: string) => ctx.onProgress?.('Installing OpenCode', line) },
    );
  },
};
