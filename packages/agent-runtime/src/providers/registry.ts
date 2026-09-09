import { claudeCodeProvider } from './claude-code/definition.js';
import { codexProvider } from './codex/definition.js';
import { cursorProvider } from './cursor/definition.js';
import { kiroProvider } from './kiro/definition.js';
import { opencodeProvider } from './opencode/definition.js';
import type { AgentProvider } from '../types/provider.js';

const providers: AgentProvider[] = [
  cursorProvider,
  codexProvider,
  kiroProvider,
  claudeCodeProvider,
  opencodeProvider,
];

const byType = new Map(providers.map((p) => [p.type, p]));

/** Built-in providers in historical auto-detect order. */
export function listAgentProviders(): readonly AgentProvider[] {
  return providers;
}

export function registerAgentProvider(provider: AgentProvider): void {
  const idx = providers.findIndex((p) => p.type === provider.type);
  if (idx >= 0) providers[idx] = provider;
  else providers.push(provider);
  byType.set(provider.type, provider);
}

export function getAgentProvider(agentType: string | null | undefined): AgentProvider | undefined {
  if (agentType == null || agentType === '') return undefined;
  return byType.get(agentType);
}

export function listAutoDetectAgentProviders(): AgentProvider[] {
  return providers.filter((p) => p.detectPresence != null);
}

export function notifyAgentProvidersSessionClosed(sessionId: string): void {
  for (const p of providers) p.onSessionClosed?.(sessionId);
}

export function notifyAgentProvidersPromptTurnFinished(sessionId: string | undefined): void {
  for (const p of providers) p.onPromptTurnFinished?.(sessionId);
}

/** @deprecated Prefer listAgentProviders(); kept for bridge compatibility. */
export const AGENT_PROVIDERS: readonly AgentProvider[] = providers;
