import type { SummaryAreaInput, SummaryArtifactInput } from '@/types/work/summary.js';
import { obj, str } from './parse-value.js';

export function parseSummary(value: unknown): SummaryArtifactInput | undefined {
  const row = obj(value);
  if (!row || !Array.isArray(row.areas)) return undefined;
  const areas = row.areas.map(parseArea).filter((a): a is SummaryAreaInput => a !== undefined);
  return areas.length ? { areas } : undefined;
}

function parseArea(value: unknown): SummaryAreaInput | undefined {
  const row = obj(value);
  const area = str(row?.area);
  const description = str(row?.description);
  return area && description ? { area, description } : undefined;
}
