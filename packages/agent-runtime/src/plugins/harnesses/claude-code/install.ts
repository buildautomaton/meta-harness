import { runNpmGlobalInstall } from '../../../runtime/harnesses/install/commands/run-npm-global-install.js';
import type { AgentInstallContext } from '../../../types/harness/host.js';

export const claudeCodeInstallDetectCommand = 'claude';
export const claudeCodeInstallTokenEnvVar = 'ANTHROPIC_API_KEY';

export async function installClaudeCode(ctx: AgentInstallContext): Promise<void> {
  ctx.onProgress?.('Installing Anthropic Claude Code');
  await runNpmGlobalInstall(
    '@anthropic-ai/claude-code',
    { ...ctx.env, ANTHROPIC_API_KEY: ctx.authToken },
    { onLine: (line: string) => ctx.onProgress?.('Installing Anthropic Claude Code', line) },
  );
}
