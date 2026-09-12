import type { AcpSessionContext } from '../../../runtime/harnesses/clients/acp-session-context.js';
import { acpReadTextFileInProcess, acpWriteTextFileInProcess } from '../../../runtime/harnesses/clients/shared/acp-fs-read-write.js';
import {
  isCursorFsReadMethod,
  isCursorFsWriteMethod,
  type JsonRpcRequestId,
} from './cursor-json-rpc-types.js';

function pathFromFsParams(params: Record<string, unknown>): string {
  for (const key of ['path', 'filePath', 'file_path', 'targetPath', 'target_path']) {
    const value = params[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

export function handleCursorIncomingFsRequest(
  method: string,
  id: JsonRpcRequestId,
  msg: Record<string, unknown>,
  deps: {
    dbgFs: boolean;
    sessionCtx: AcpSessionContext;
    respond: (id: JsonRpcRequestId, result: unknown) => void;
    respondJsonRpcError: (id: JsonRpcRequestId, code: number, message: string) => void;
  },
): boolean {
  const params = (msg.params as Record<string, unknown> | undefined) ?? {};
  const isRead = isCursorFsReadMethod(method);
  const isWrite = isCursorFsWriteMethod(method);
  if (!isRead && !isWrite) return false;

  const filePath = pathFromFsParams(params);

  if (isRead) {
    if (deps.dbgFs) {
      console.error(`[acp-fs] ${method} path=${filePath.slice(0, 200)}${filePath.length > 200 ? '…' : ''}`);
    }
    try {
      const lineNum = typeof params.line === 'number' ? params.line : undefined;
      const limitNum = typeof params.limit === 'number' ? params.limit : undefined;
      const out = acpReadTextFileInProcess(deps.sessionCtx, filePath, lineNum, limitNum);
      deps.respond(id, out);
    } catch (e) {
      if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
        deps.respond(id, { content: '' });
      } else {
        deps.respondJsonRpcError(id, -32000, e instanceof Error ? e.message : String(e));
      }
    }
    return true;
  }

  if (isWrite) {
    const newText = typeof params.content === 'string' ? params.content : '';
    if (deps.dbgFs) {
      console.error(
        `[acp-fs] ${method} path=${filePath.slice(0, 200)}${filePath.length > 200 ? '…' : ''} newBytes=${newText.length}`,
      );
    }
    try {
      acpWriteTextFileInProcess(deps.sessionCtx, filePath, newText);
      deps.respond(id, null);
    } catch (e) {
      if ((e as Error).message === 'Invalid or disallowed path') {
        if (deps.dbgFs) {
          console.error(`[acp-fs] ${method} rejected path (outside cwd or empty): ${filePath.slice(0, 120)}`);
        }
        deps.respondJsonRpcError(id, -32602, 'Invalid or disallowed path');
      } else {
        deps.respondJsonRpcError(id, -32000, e instanceof Error ? e.message : String(e));
      }
    }
    return true;
  }

  return false;
}
