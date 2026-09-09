import type { AcpSessionAgentKey } from './acp-agent.js';

export type AcpPromptRunRoute = {
  sessionId?: string;
  runId: string;
};

/**
 * Maps in-flight prompt turns to their cloud session/run, and tracks which turn is actively
 * streaming on each per-session ACP subprocess.
 */
export class AcpPromptRoutingRegistry {
  private readonly runs = new Map<string, AcpPromptRunRoute>();
  private readonly streamingRunIdBySessionAgent = new Map<AcpSessionAgentKey, string>();

  registerRun(route: AcpPromptRunRoute): void {
    this.runs.set(route.runId, route);
  }

  unregisterRun(runId: string): void {
    this.runs.delete(runId);
    for (const [sessionAgentKey, streamingRunId] of this.streamingRunIdBySessionAgent.entries()) {
      if (streamingRunId === runId) {
        this.streamingRunIdBySessionAgent.delete(sessionAgentKey);
      }
    }
  }

  isRegisteredRun(runId: string): boolean {
    return this.runs.has(runId);
  }

  setStreamingRunId(sessionAgentKey: AcpSessionAgentKey, runId: string | undefined): void {
    if (runId) {
      this.streamingRunIdBySessionAgent.set(sessionAgentKey, runId);
    } else {
      this.streamingRunIdBySessionAgent.delete(sessionAgentKey);
    }
  }

  clearStreamingRunId(sessionAgentKey: AcpSessionAgentKey, runId: string): void {
    if (this.streamingRunIdBySessionAgent.get(sessionAgentKey) === runId) {
      this.streamingRunIdBySessionAgent.delete(sessionAgentKey);
    }
  }

  getStreamingRunId(sessionAgentKey: AcpSessionAgentKey): string | undefined {
    return this.streamingRunIdBySessionAgent.get(sessionAgentKey);
  }

  resolveRouting(sessionAgentKey: AcpSessionAgentKey): AcpPromptRunRoute | undefined {
    const runId = this.streamingRunIdBySessionAgent.get(sessionAgentKey);
    if (!runId) return undefined;
    return this.runs.get(runId);
  }
}
