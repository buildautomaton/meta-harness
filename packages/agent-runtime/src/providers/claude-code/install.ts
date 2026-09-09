import { runNpmGlobalInstall } from '../../install/commands/run-npm-global-install.js';
import type { AgentProviderInstall } from '../types.js';

export const claudeCodeInstall: AgentProviderInstall = {
  detectCommand: 'claude',
  tokenEnvVar: 'ANTHROPIC_API_KEY',
  async run(ctx) {
    ctx.onProgress?.('Installing Anthropic Claude Code');
    await runNpmGlobalInstall(
      '@anthropic-ai/claude-code',
      { ...ctx.env, ANTHROPIC_API_KEY: ctx.authToken },
      { onLine: (line: string) => ctx.onProgress?.('Installing Anthropic Claude Code', line) },
    );
  },
};
