import { runNpmGlobalInstall } from '../../install/commands/run-npm-global-install.js';
import type { AgentProviderInstall } from '../types.js';

export const codexInstall: AgentProviderInstall = {
  detectCommand: 'codex',
  tokenEnvVar: 'OPENAI_API_KEY',
  async run(ctx) {
    ctx.onProgress?.('Installing Codex');
    await runNpmGlobalInstall(
      '@openai/codex',
      { ...ctx.env, OPENAI_API_KEY: ctx.authToken },
      { onLine: (line: string) => ctx.onProgress?.('Installing Codex', line) },
    );
  },
};
