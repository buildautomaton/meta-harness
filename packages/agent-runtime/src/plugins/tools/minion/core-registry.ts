import type { LaunchAgentParams, SessionStatusResult } from '@/types/session/records.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';
import { CORE_TOOL_DEFINITIONS } from './definitions.js';
import { jsonToolResult } from './json-result.js';
import {
  AWAIT_MINION_TOOL,
  GET_MINION_CONTEXT_TOOL,
  GET_MINION_TOOL,
  GET_MINION_TRANSCRIPT_TOOL,
  RESOLVE_MINION_REQUEST_TOOL,
  SPAWN_MINION_TOOL,
} from './names.js';

export type MinionContextResult = {
  workingDirectory: string;
  harnesses: Array<{ type: string; displayName: string; authEnvVar?: string }>;
  note: string;
};

export type ResolveMinionResult = {
  ok: boolean;
  error?: string;
  storedAuth?: boolean;
  envVar?: string;
};

export type CoreToolHost = {
  spawnMinion: (
    params: LaunchAgentParams,
    opts?: { background?: boolean },
  ) => Promise<SessionStatusResult | null>;
  awaitMinion: (minionId: string) => Promise<SessionStatusResult | null>;
  getMinion: (minionId: string) => Promise<SessionStatusResult | null>;
  getMinionContext: () => MinionContextResult;
  resolveMinionRequest: (args: Record<string, unknown>) => Promise<ResolveMinionResult>;
};

export function createCoreToolRegistry(host: CoreToolHost): ToolRegistry {
  return {
    listTools: () => CORE_TOOL_DEFINITIONS,
    callTool: async (name, args) => {
      if (name === SPAWN_MINION_TOOL) return spawn(host, args);
      if (name === AWAIT_MINION_TOOL) return awaitStatus(host.awaitMinion, args);
      if (name === GET_MINION_TOOL) return awaitStatus(host.getMinion, args);
      if (name === GET_MINION_TRANSCRIPT_TOOL) return transcript(host, args);
      if (name === GET_MINION_CONTEXT_TOOL) return jsonToolResult(host.getMinionContext());
      if (name === RESOLVE_MINION_REQUEST_TOOL) {
        const result = await host.resolveMinionRequest(args);
        return jsonToolResult(result, !result.ok);
      }
      return jsonToolResult({ error: `Unknown tool: ${name}` }, true);
    },
  };
}

async function spawn(host: CoreToolHost, args: Record<string, unknown>) {
  const harness = typeof args.harness === 'string' ? args.harness.trim() : '';
  const prompt = typeof args.prompt === 'string' ? args.prompt : '';
  const model = typeof args.model === 'string' ? args.model.trim() : undefined;
  if (!harness || !prompt) {
    return jsonToolResult({ error: 'harness and prompt are required' }, true);
  }
  const result = await host.spawnMinion({ harness, prompt, model }, { background: args.background === true });
  if (!result) return jsonToolResult({ error: 'Failed to spawn minion' }, true);
  return jsonToolResult(result);
}

async function awaitStatus(
  load: (id: string) => Promise<SessionStatusResult | null>,
  args: Record<string, unknown>,
) {
  const minionId = idOf(args);
  if (!minionId) return jsonToolResult({ error: 'minionId is required' }, true);
  const result = await load(minionId);
  if (!result) return jsonToolResult({ error: `Unknown minion: ${minionId}` }, true);
  return jsonToolResult(result);
}

async function transcript(host: CoreToolHost, args: Record<string, unknown>) {
  const minionId = idOf(args);
  if (!minionId) return jsonToolResult({ error: 'minionId is required' }, true);
  const result = await host.getMinion(minionId);
  if (!result) return jsonToolResult({ error: `Unknown minion: ${minionId}` }, true);
  return jsonToolResult({ minionId, transcript: result.transcript });
}

function idOf(args: Record<string, unknown>): string {
  return typeof args.minionId === 'string' ? args.minionId.trim() : '';
}
