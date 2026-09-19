import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import { setInstalledAgentAuthEnv } from '@runtime/acp/clients/installed-agent-auth-env.js';

export function applyMinionAuthToken(
  engine: AcpEngine,
  harnessType: string,
  token: string,
): { envVar?: string; stored: boolean } {
  const envVar = engine.getHarness(harnessType)?.installTokenEnvVar;
  const trimmed = token.trim();
  if (!envVar || !trimmed) return { stored: false };
  setInstalledAgentAuthEnv([{ envVar, token: trimmed }]);
  return { envVar, stored: true };
}

export async function storeElicitedAuth(
  engine: AcpEngine,
  backend: SessionImplementation,
  sessionId: string,
  elicited: unknown,
): Promise<void> {
  const token = elicitationToken(elicited);
  if (!token) return;
  const snapshot = await backend.get(sessionId);
  if (snapshot) applyMinionAuthToken(engine, snapshot.session.harness, token);
}

function elicitationToken(elicited: unknown): string | undefined {
  if (!elicited || typeof elicited !== 'object') return undefined;
  const rec = elicited as { token?: unknown; content?: { token?: unknown } };
  const token = rec.content?.token ?? rec.token;
  return typeof token === 'string' && token.trim() ? token : undefined;
}
