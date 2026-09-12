import { applyAgentPathToProcessEnv } from '../clients/agent-path.js';
import { waitForCommandOnPath } from '../clients/detect-command-on-path.js';
import { getAgentHarness } from '../registry.js';
import type { GetAgentHarnessFn } from '../keys/resolve-agent-command.js';

export async function installLocalAgentOnBridge(params: {
  agentType: string;
  authToken: string;
  onProgress?: (message: string, logOutput?: string) => void;
  getHarness?: GetAgentHarnessFn;
}): Promise<{ success: boolean; error?: string }> {
  const harness = (params.getHarness ?? getAgentHarness)(params.agentType);
  if (!harness?.install || !harness.installDetectCommand || !harness.installTokenEnvVar) {
    return { success: false, error: `Unsupported agent type: ${params.agentType}` };
  }

  params.onProgress?.(`Configuring ${harness.displayName} credentials`);

  try {
    await harness.install({
      authToken: params.authToken,
      onProgress: params.onProgress,
      env: { ...process.env, [harness.installTokenEnvVar]: params.authToken },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: msg };
  }

  applyAgentPathToProcessEnv();
  const detectNames = [harness.installDetectCommand, ...(harness.installAlternateDetectCommands ?? [])];
  for (const name of detectNames) {
    if (await waitForCommandOnPath(name)) return { success: true };
  }
  return { success: false, error: `${harness.installDetectCommand} not found on PATH after install` };
}
