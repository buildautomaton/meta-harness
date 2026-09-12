export type {
  AcpClientOptions,
  AcpClientHandle,
  PromptResult,
  PromptImagePayload,
  SendPromptOptions,
} from '../client-types.js';

export {
  createSdkStdioAcpClient,
  createSdkStdioAcpClient as createAcpClient,
} from './sdk/sdk-stdio-acp-client.js';
