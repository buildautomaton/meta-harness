/**
 * When the user selects a permission option, some agents (e.g. Claude Code over ACP) need the
 * selected option's `kind` (allow_once vs allow_always) in addition to `optionId`. The session UI
 * usually forwards `_meta.permissionOptionKind`; this helper fills it from the original
 * `session/request_permission` params when missing (web UI and other callers).
 */

const META_KEY = 'permissionOptionKind' as const;

function optionRecordId(rec: Record<string, unknown>): string {
  const raw = rec.optionId ?? rec.id;
  if (typeof raw === 'string' && raw.trim() !== '') return raw.trim();
  if (typeof raw === 'number' && Number.isFinite(raw)) return String(raw);
  return '';
}

export function enrichAcpPermissionRpcResultFromRequestParams(
  result: unknown,
  params: Record<string, unknown> | undefined,
): unknown {
  if (params == null || result == null || typeof result !== 'object' || Array.isArray(result)) {
    return result;
  }
  const root = result as { outcome?: unknown };
  const outcome = root.outcome;
  if (outcome == null || typeof outcome !== 'object' || Array.isArray(outcome)) return result;
  const o = outcome as {
    outcome?: unknown;
    optionId?: unknown;
    _meta?: unknown;
  };
  if (o.outcome !== 'selected' || typeof o.optionId !== 'string' || o.optionId.trim() === '') {
    return result;
  }
  const selectedId = o.optionId.trim();
  const prevMeta =
    o._meta != null && typeof o._meta === 'object' && !Array.isArray(o._meta)
      ? (o._meta as Record<string, unknown>)
      : {};
  if (typeof prevMeta[META_KEY] === 'string' && prevMeta[META_KEY]!.trim() !== '') {
    return result;
  }

  const rawOpts = Array.isArray(params.options) ? params.options : [];
  let matchedKind: string | undefined;
  for (const item of rawOpts) {
    if (item == null || typeof item !== 'object' || Array.isArray(item)) continue;
    const rec = item as Record<string, unknown>;
    const id = optionRecordId(rec);
    if (!id || id !== selectedId) continue;
    if (typeof rec.kind === 'string' && rec.kind.trim() !== '') {
      matchedKind = rec.kind.trim();
      break;
    }
  }
  if (!matchedKind) return result;

  return {
    ...root,
    outcome: {
      ...o,
      _meta: { ...prevMeta, [META_KEY]: matchedKind },
    },
  };
}
