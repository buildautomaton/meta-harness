import type { LaunchAgentParams, SessionStatusResult } from '../../types/session/records.js';
import type { ToolRegistry } from '../../types/tools/implementation.js';
import { CORE_TOOL_DEFINITIONS } from './definitions.js';
import { jsonToolResult } from './json-result.js';
import { GET_SESSION_TOOL, LAUNCH_SUBAGENT_TOOL } from './names.js';

export type CoreToolHost = {
  launchAgent: (params: LaunchAgentParams) => Promise<{ sessionId: string }>;
  getSession: (sessionId: string) => Promise<SessionStatusResult | null>;
};

export function createCoreToolRegistry(host: CoreToolHost): ToolRegistry {
  return {
    listTools: () => CORE_TOOL_DEFINITIONS,
    callTool: async (name, args) => {
      if (name === LAUNCH_SUBAGENT_TOOL) return launch(host, args);
      if (name === GET_SESSION_TOOL) return status(host, args);
      return jsonToolResult({ error: `Unknown tool: ${name}` }, true);
    },
  };
}

async function launch(host: CoreToolHost, args: Record<string, unknown>) {
  const harness = typeof args.harness === 'string' ? args.harness.trim() : '';
  const prompt = typeof args.prompt === 'string' ? args.prompt : '';
  const model = typeof args.model === 'string' ? args.model.trim() : undefined;
  if (!harness || !prompt) {
    return jsonToolResult({ error: 'harness and prompt are required' }, true);
  }
  return jsonToolResult(await host.launchAgent({ harness, prompt, model }));
}

async function status(host: CoreToolHost, args: Record<string, unknown>) {
  const sessionId = typeof args.sessionId === 'string' ? args.sessionId.trim() : '';
  if (!sessionId) return jsonToolResult({ error: 'sessionId is required' }, true);
  const result = await host.getSession(sessionId);
  if (!result) return jsonToolResult({ error: `Unknown session: ${sessionId}` }, true);
  return jsonToolResult(result);
}
