export type {
  AcpClientOptions,
  AcpClientHandle,
  PromptResult,
  PromptImagePayload,
  SendPromptOptions,
} from '../types/client.js';
export type { AgentFileChangeEvent as CliFileChangeEvent } from '../types/lifecycle.js';

export {
  createSdkStdioAcpClient,
  createSdkStdioAcpClient as createAcpClient,
} from './sdk/sdk-stdio-acp-client.js';
