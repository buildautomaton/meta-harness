import { humanizeOptionLabel } from './permission-label.js';

export function matchPermissionOption(
  params: Record<string, unknown> | undefined,
  token: string,
): string | undefined {
  if (!token.trim()) return undefined;
  const needle = canon(token);
  const raw = Array.isArray(params?.options) ? params.options : [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const optionId = str(rec.optionId) ?? str(rec.id);
    if (!optionId) continue;
    const kind = str(rec.kind);
    const given = str(rec.label) ?? str(rec.name) ?? str(rec.title);
    const label = humanizeOptionLabel(optionId, kind, given);
    if ([optionId, given ?? '', label].some((value) => canon(value) === needle)) return optionId;
  }
  return undefined;
}

export function isDenyDecision(outcome: string, optionId: string): boolean {
  return canon(`${outcome} ${optionId}`) === 'reject' || /\breject\b|\bdeny\b/.test(`${outcome} ${optionId}`.toLowerCase());
}

function canon(value: string): string {
  const n = value.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
  if (n === 'allow-always' || n === 'allow-all') return 'allow-all';
  if (n === 'allow-once' || n === 'allow' || n === 'accept') return 'allow-once';
  if (n === 'reject' || n === 'deny' || n === 'cancelled' || n === 'canceled') return 'reject';
  return n;
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
