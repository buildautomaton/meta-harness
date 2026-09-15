import { applyClaudePermissionFromAcpSession } from './apply-permission.js';
import { wrapPermissionAfterSession } from '@plugins/harnesses/shared/wrap-permission-after-session.js';

export const applyClaudeCodeAfterSessionEstablished = wrapPermissionAfterSession(
  applyClaudePermissionFromAcpSession,
);
