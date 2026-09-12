import { applyClaudePermissionFromAcpSession } from './apply-permission.js';
import { wrapPermissionAfterSession } from '../shared/wrap-permission-after-session.js';

export const applyClaudeCodeAfterSessionEstablished = wrapPermissionAfterSession(
  applyClaudePermissionFromAcpSession,
);
