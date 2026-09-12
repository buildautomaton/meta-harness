import type { AcpSessionContext } from '../../../runtime/harnesses/clients/acp-session-context.js';
import { handleCursorIncomingCursorMethods, handleCursorIncomingCursorNotification } from './cursor-incoming-cursor-methods.js';
import { handleCursorIncomingFsRequest } from './cursor-incoming-fs-request.js';
import { handleCursorIncomingPermissionRequest } from './cursor-incoming-permission-request.js';
import { resolveCursorIncomingRequest } from './cursor-incoming-resolve-request.js';
import { handleCursorIncomingSessionUpdate } from './cursor-incoming-session-update.js';
import { safeJsonParse } from './cursor-json-rpc-parse.js';
import {
  parseIncomingJsonRpcRequestId,
  type JsonRpcRequestId,
  type PendingRequest,
} from './cursor-json-rpc-types.js';

export type CursorAcpIncomingLineHandlerDeps = {
  dbgFs: boolean;
  sessionCtx: AcpSessionContext;
  onSessionUpdate?: (params: unknown) => void;
  onRequest?: (request: {
    requestId: string;
    method: string;
    params: Record<string, unknown>;
  }) => void;
  respond: (id: JsonRpcRequestId, result: unknown) => void;
  respondJsonRpcError: (id: JsonRpcRequestId, code: number, message: string) => void;
  settleResponse: (id: number, msg: Record<string, unknown>) => boolean;
  pendingRequests: Map<JsonRpcRequestId, PendingRequest>;
};

export function createCursorAcpIncomingLineHandler(deps: CursorAcpIncomingLineHandlerDeps) {
  const respondDeps = {
    dbgFs: deps.dbgFs,
    sessionCtx: deps.sessionCtx,
    respond: deps.respond,
    respondJsonRpcError: deps.respondJsonRpcError,
    onRequest: deps.onRequest,
    onSessionUpdate: deps.onSessionUpdate,
    pendingRequests: deps.pendingRequests,
  };

  return {
    resolveRequest: (requestId: JsonRpcRequestId, result: unknown) =>
      resolveCursorIncomingRequest(
        deps.pendingRequests,
        deps.respond,
        requestId,
        result,
        deps.sessionCtx.acpSessionId,
        deps.sessionCtx.pendingPlanExecute,
      ),
    handleLine(line: string): void {
      const msg = safeJsonParse(line);
      if (!msg) return;

      const requestId = parseIncomingJsonRpcRequestId(msg.id);
      if (requestId != null && (msg.result !== undefined || msg.error !== undefined)) {
        if (typeof requestId === 'number') {
          deps.settleResponse(requestId, msg);
        }
        return;
      }

      const method = typeof msg.method === 'string' ? msg.method : undefined;
      if (method === 'session/update') {
        handleCursorIncomingSessionUpdate(msg, {
          dbgFs: deps.dbgFs,
          sessionCtx: deps.sessionCtx,
          onSessionUpdate: deps.onSessionUpdate,
        });
        return;
      }

      if (method && requestId == null) {
        handleCursorIncomingCursorNotification(method, msg, deps.onSessionUpdate);
        return;
      }

      if (method === 'session/request_permission' && requestId != null) {
        handleCursorIncomingPermissionRequest(requestId, method, msg, respondDeps);
        return;
      }

      if (requestId != null && method) {
        if (handleCursorIncomingFsRequest(method, requestId, msg, respondDeps)) return;
        if (handleCursorIncomingCursorMethods(method, requestId, msg, respondDeps)) return;
        deps.respond(requestId, {});
      }
    },
  };
}
