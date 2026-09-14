export type PermissionOptionView = { optionId: string; label: string };

export function humanizeOptionLabel(optionId: string, kind?: string, given?: string): string {
  const trimmed = given?.trim();
  if (trimmed && trimmed !== optionId && !/^[\w-]+$/.test(trimmed)) return trimmed;
  const token = `${kind ?? ''} ${optionId}`.toLowerCase().replace(/_/g, '-');
  if (/\ballow-always\b|\ballow-all\b/.test(token)) return 'Allow all';
  if (/\ballow-once\b/.test(token)) return 'Allow once';
  if (/\breject\b|\bdeny\b/.test(token)) return 'Reject';
  return optionId.replace(/[_-]+/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function permissionOptionsFromParams(
  params: Record<string, unknown>,
): PermissionOptionView[] {
  const raw = Array.isArray(params.options) ? params.options : [];
  const out: PermissionOptionView[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const optionId =
      (typeof rec.optionId === 'string' && rec.optionId) ||
      (typeof rec.id === 'string' && rec.id) ||
      '';
    if (!optionId) continue;
    const given = typeof rec.name === 'string' ? rec.name : typeof rec.title === 'string' ? rec.title : undefined;
    const kind = typeof rec.kind === 'string' ? rec.kind : undefined;
    out.push({ optionId, label: humanizeOptionLabel(optionId, kind, given) });
  }
  return out;
}

export const AUTH_OPTIONS: PermissionOptionView[] = [
  { optionId: 'token', label: 'Provide API token' },
];
