/** ACP wire transport shared by SDK stdio and Cursor JSON-RPC clients. */

export type AcpTextPromptPart = { type: 'text'; text: string };

/** MCP-aligned image block for ACP `session/prompt` (base64). */
export type AcpImagePromptPart = { type: 'image'; mimeType: string; data: string };

export type AcpPromptContentBlock = AcpTextPromptPart | AcpImagePromptPart;

export type AcpSessionTransport = {
  initialize(request: Record<string, unknown>): Promise<Record<string, unknown>>;
  afterInitialize?(): Promise<void>;
  resumeSession(params: { sessionId: string; cwd: string; mcpServers: unknown[] }): Promise<unknown>;
  loadSession(params: { sessionId: string; cwd: string; mcpServers: unknown[] }): Promise<unknown>;
  newSession(params: { cwd: string; mcpServers: unknown[] }): Promise<unknown>;
  prompt(params: { sessionId: string; prompt: AcpPromptContentBlock[] }): Promise<unknown>;
  cancelSession(sessionId: string): Promise<void>;
  closeSession?(sessionId: string): Promise<void>;
  setSessionConfigOption?(params: {
    sessionId: string;
    configId: string;
    value: string;
  }): Promise<unknown>;
  setSessionMode?(params: { sessionId: string; modeId: string }): Promise<unknown>;
};
