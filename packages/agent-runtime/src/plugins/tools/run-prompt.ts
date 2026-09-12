import type { AgentRuntimeManager } from '../../runtime/core/manager/types.js';
import type { LaunchAgentParams, SessionRecord } from '../../types/session/records.js';
import { AGENT_CONFIG_AGENT_MODEL_KEY } from '../../runtime/core/util/agent-config.js';
import {
  appendSessionEvent,
  finishSession,
  handleAgentRequest,
  type SessionEventHost,
} from './session-events.js';

export function wirePrompt(options: SessionEventHost & {
  manager: AgentRuntimeManager;
  record: SessionRecord;
  params: LaunchAgentParams;
}): void {
  const { manager, record, params } = options;
  const agentConfig = params.model ? { [AGENT_CONFIG_AGENT_MODEL_KEY]: params.model } : undefined;
  manager.setPreferredHarnessType(params.harness);
  manager.prompt({
    promptText: params.prompt,
    sessionId: record.id,
    runId: record.runId,
    scopeId: record.id,
    agentType: params.harness,
    cwd: record.cwd,
    agentConfig,
    isNewSession: true,
    sendResult: (result) => void finishSession(options, record.id, result),
    sendSessionUpdate: (payload) => void appendSessionEvent(options, record.id, 'update', payload),
    sendRequest: (payload) => void handleAgentRequest(options, record.id, payload),
  });
}
