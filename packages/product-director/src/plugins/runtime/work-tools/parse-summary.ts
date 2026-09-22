import type { ChangeKind } from '@/types/work/change.js';
import { CHANGE_KINDS } from '@/types/work/change.js';
import type { SummaryAreaInput, SummaryArtifactInput, SummaryPathInput } from '@/types/work/summary.js';
import { obj, str } from './parse-value.js';

export function parseSummary(value: unknown): SummaryArtifactInput | undefined {
  const row = obj(value);
  if (!row || !Array.isArray(row.areas)) return undefined;
  const areas = row.areas.map(parseArea).filter((a): a is SummaryAreaInput => a !== undefined);
  if (!areas.length) return undefined;
  const paths = Array.isArray(row.paths)
    ? row.paths.map(parsePath).filter((p): p is SummaryPathInput => p !== undefined)
    : undefined;
  return { areas, ...(paths?.length ? { paths } : {}) };
}

function parseArea(value: unknown): SummaryAreaInput | undefined {
  const row = obj(value);
  const area = str(row?.area);
  const description = str(row?.description);
  return area && description ? { area, description } : undefined;
}

function parsePath(value: unknown): SummaryPathInput | undefined {
  const row = obj(value);
  const path = str(row?.path);
  const change = str(row?.change) as ChangeKind | undefined;
  if (!path || !change || !CHANGE_KINDS.includes(change)) return undefined;
  return { path, change };
}
