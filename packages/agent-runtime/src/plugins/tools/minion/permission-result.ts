import { defaultAllowPermission } from './default-permission.js';
import { isDenyDecision, matchPermissionOption } from './permission-match.js';

export function permissionResultFromDecision(
  args: Record<string, unknown>,
  params?: Record<string, unknown>,
): unknown {
  const outcome = typeof args.outcome === 'string' ? args.outcome.trim() : '';
  const optionId = typeof args.optionId === 'string' ? args.optionId.trim() : '';
  if (isDenyDecision(outcome, optionId)) return { outcome: { outcome: 'denied' } };
  const selected = matchPermissionOption(params, optionId) ?? matchPermissionOption(params, outcome);
  if (selected) return { outcome: { outcome: 'selected', optionId: selected } };
  if (optionId) return { outcome: { outcome: 'selected', optionId } };
  const content = args.content;
  if (content && typeof content === 'object' && !Array.isArray(content)) {
    return permissionResultFromDecision(content as Record<string, unknown>, params);
  }
  return defaultAllowPermission(params);
}

export function decisionFromElicitation(result: unknown): unknown | undefined {
  if (result == null || typeof result !== 'object') return result ?? undefined;
  const rec = result as { action?: string; content?: Record<string, unknown> };
  if (rec.action === 'decline' || rec.action === 'cancel') {
    return { outcome: { outcome: 'denied' } };
  }
  if (rec.action === 'accept' && rec.content) {
    return permissionResultFromDecision(rec.content, rec.content);
  }
  return result;
}
