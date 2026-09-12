import { runNpmGlobalInstall } from '../../../runtime/harnesses/install/commands/run-npm-global-install.js';
import type { AgentInstallContext } from '../../../types/harness/host.js';

export const codexInstallDetectCommand = 'codex';
export const codexInstallTokenEnvVar = 'OPENAI_API_KEY';

export async function installCodex(ctx: AgentInstallContext): Promise<void> {
  ctx.onProgress?.('Installing Codex');
  await runNpmGlobalInstall(
    '@openai/codex',
    { ...ctx.env, OPENAI_API_KEY: ctx.authToken },
    { onLine: (line: string) => ctx.onProgress?.('Installing Codex', line) },
  );
}
