import { mapRequestKind } from '@runtime/acp/lifecycle/map-request-kind.js';
import { permissionOptionsFromParams, type PermissionOptionView } from './permission-label.js';

export type UnwrappedRequest = {
  requestId?: string;
  method: string;
  params: Record<string, unknown>;
  kind: string;
};

export function unwrapAgentRequest(payload: unknown): UnwrappedRequest {
  const rec = asRecord(payload) ?? {};
  const inner = asRecord(rec.payload) ?? {};
  const requestId = idOf(rec.requestId) ?? idOf(inner.requestId);
  const method = str(rec.method) ?? str(inner.method) ?? '';
  const params = asRecord(rec.params) ?? asRecord(inner.params) ?? {};
  const kind = str(rec.kind) ?? mapRequestKind(method);
  return { requestId, method, params, kind };
}

export function minionRequestKind(
  kind: string,
  method: string,
): 'permission' | 'auth' | 'question' {
  if (kind === 'permission' || method === 'session/request_permission') return 'permission';
  if (kind === 'auth' || /auth|login|token/i.test(`${kind} ${method}`)) return 'auth';
  return 'question';
}

export function summarizeMinionRequest(method: string, params: Record<string, unknown>): string {
  const toolCall = asRecord(params.toolCall);
  const title = str(toolCall?.title);
  if (title) return title;
  const message = str(params.message);
  if (message) return message;
  const toolKind = str(toolCall?.kind);
  if (toolKind) return `${method} (${toolKind})`;
  return method || 'minion request';
}

export function requestOptions(params: Record<string, unknown>): PermissionOptionView[] {
  return permissionOptionsFromParams(params);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function idOf(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}
