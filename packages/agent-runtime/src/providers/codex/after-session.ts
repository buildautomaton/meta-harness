import { applyCodexPermissionFromAcpSession } from './apply-permission.js';
import { wrapPermissionAfterSession } from '../shared/wrap-permission-after-session.js';

export const applyCodexAfterSessionEstablished = wrapPermissionAfterSession(
  applyCodexPermissionFromAcpSession,
);
