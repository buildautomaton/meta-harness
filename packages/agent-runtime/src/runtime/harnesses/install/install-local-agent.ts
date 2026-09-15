import { applyAgentPathToProcessEnv } from '@runtime/acp/clients/agent-path.js';
import { waitForCommandOnPath } from '@runtime/acp/clients/detect-command-on-path.js';
import type { GetAgentHarnessFn } from '@runtime/harnesses/types.js';

export async function installLocalAgentOnBridge(params: {
  agentType: string;
  authToken: string;
  onProgress?: (message: string, logOutput?: string) => void;
  getHarness: GetAgentHarnessFn;
}): Promise<{ success: boolean; error?: string }> {
  const harness = params.getHarness(params.agentType);
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
