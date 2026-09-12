import { logDebug } from '../../../core/util/log.js';
import type { AcpClientOptions } from '../acp-client.js';
import type { AcpSessionContext } from '../acp-session-context.js';
import { createStderrCapture } from '../agent-stderr-capture.js';

export function createSdkStdioSessionContext(options: {
  cwd: string;
  mcpServers?: unknown[];
  persistedAcpSessionId?: string | null;
  backendAgentType?: string | null;
  agentConfig?: Record<string, unknown> | null;
  getActiveConfigOptions?: AcpClientOptions['getActiveConfigOptions'];
  onAcpSessionEstablished?: AcpClientOptions['onAcpSessionEstablished'];
  onAcpConfigOptionsUpdated?: AcpClientOptions['onAcpConfigOptionsUpdated'];
  onAcpAvailableCommandsUpdated?: AcpClientOptions['onAcpAvailableCommandsUpdated'];
  onFileChange?: AcpClientOptions['onFileChange'];
  afterSessionEstablished?: AcpClientOptions['afterSessionEstablished'];
  stderrCapture: ReturnType<typeof createStderrCapture>;
}): AcpSessionContext {
  const suppressLoadReplayRef = { value: false };
  const ctx: AcpSessionContext = {
    acpSessionId: options.persistedAcpSessionId ?? null,
    cwd: options.cwd,
    onFileChange: options.onFileChange,
    mcpServers: options.mcpServers ?? [],
    persistedAcpSessionId: options.persistedAcpSessionId,
    agentLabel: 'ACP',
    suppressLoadReplay: suppressLoadReplayRef,
    backendAgentType: options.backendAgentType ?? null,
    agentConfig: options.agentConfig,
    getActiveConfigOptions: options.getActiveConfigOptions,
    onAcpSessionEstablished: (info) => {
      ctx.acpSessionId = info.acpSessionId;
      options.onAcpSessionEstablished?.(info);
    },
    onAcpConfigOptionsUpdated: options.onAcpConfigOptionsUpdated,
    onAcpAvailableCommandsUpdated: options.onAcpAvailableCommandsUpdated,
    logDebug,
    getStderrText: () => options.stderrCapture.getText(),
    afterSessionEstablished: options.afterSessionEstablished,
  };
  return ctx;
}
