import { formatSessionUpdateKindForLog } from '../../logging/format-session-update-kind-for-log.js';
import type { AcpSessionContext } from '../../clients/acp-session-context.js';
import { dispatchAcpSessionUpdate } from '../../clients/shared/dispatch-session-update.js';

export function handleCursorIncomingSessionUpdate(
  msg: Record<string, unknown>,
  deps: {
    dbgFs: boolean;
    sessionCtx: AcpSessionContext;
    onSessionUpdate?: (params: unknown) => void;
  },
): boolean {
  const params = msg.params as
    | {
        sessionId?: string;
        update?: {
          sessionUpdate?: string;
          session_update?: string;
          toolCall?: { name?: string };
          tool_call?: { name?: string };
        };
      }
    | undefined;
  const update = params?.update;
  if (!update) return false;

  const sessionUpdate = (update.sessionUpdate ?? update.session_update) as string | undefined;
  const toolCall = (update.toolCall ?? update.tool_call) as { name?: string } | undefined;
  const toolName = typeof toolCall?.name === 'string' ? toolCall.name : '';
  if (deps.dbgFs && (sessionUpdate === 'tool_call' || sessionUpdate === 'tool_call_update')) {
    const kindLabel = formatSessionUpdateKindForLog(sessionUpdate ?? 'update');
    console.error(`[acp] Received session update (${kindLabel}) tool=${toolName || '(none)'}`);
  }
  dispatchAcpSessionUpdate({
    flatPayload: update as Record<string, unknown>,
    onAcpConfigOptionsUpdated: deps.sessionCtx.onAcpConfigOptionsUpdated,
    onAcpAvailableCommandsUpdated: deps.sessionCtx.onAcpAvailableCommandsUpdated,
    onSessionUpdate: deps.onSessionUpdate,
    suppressLoadReplay: () => deps.sessionCtx.suppressLoadReplay.value,
  });
  return true;
}
