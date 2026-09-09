import { applyAgentPathToProcessEnv } from '../clients/agent-path.js';
import { waitForCommandOnPath } from '../clients/detect-command-on-path.js';
import { getAgentProvider } from '../providers/registry.js';

export async function installLocalAgentOnBridge(params: {
  agentType: string;
  authToken: string;
  onProgress?: (message: string, logOutput?: string) => void;
}): Promise<{ success: boolean; error?: string }> {
  const provider = getAgentProvider(params.agentType);
  const install = provider?.install;
  if (!provider || !install) return { success: false, error: `Unsupported agent type: ${params.agentType}` };

  params.onProgress?.(`Configuring ${provider.displayName} credentials`);

  try {
    await install.run({
      authToken: params.authToken,
      onProgress: params.onProgress,
      env: { ...process.env, [install.tokenEnvVar]: params.authToken },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: msg };
  }

  applyAgentPathToProcessEnv();
  const detectNames = [install.detectCommand, ...(install.alternateDetectCommands ?? [])];
  let found = false;
  for (const name of detectNames) {
    if (await waitForCommandOnPath(name)) {
      found = true;
      break;
    }
  }
  if (!found) {
    return { success: false, error: `${install.detectCommand} not found on PATH after install` };
  }

  return { success: true };
}
