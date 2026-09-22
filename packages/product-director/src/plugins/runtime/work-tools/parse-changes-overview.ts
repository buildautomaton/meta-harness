import type { ChangeKind } from '@/types/work/change.js';
import { CHANGE_KINDS } from '@/types/work/change.js';
import type {
  ChangesOverviewArtifactInput,
  ChangesOverviewGroupInput,
  ChangesOverviewPathInput,
} from '@/types/work/changes-overview.js';
import { obj, str } from './parse-value.js';

export function parseChangesOverview(value: unknown): ChangesOverviewArtifactInput | undefined {
  const row = obj(value);
  if (!row || !Array.isArray(row.groups)) return undefined;
  const groups = row.groups
    .map(parseGroup)
    .filter((g): g is ChangesOverviewGroupInput => g !== undefined);
  return groups.length ? { groups } : undefined;
}

function parseGroup(value: unknown): ChangesOverviewGroupInput | undefined {
  const row = obj(value);
  const description = str(row?.description);
  if (!description || !Array.isArray(row?.paths)) return undefined;
  const paths = row.paths
    .map(parsePath)
    .filter((p): p is ChangesOverviewPathInput => p !== undefined);
  return paths.length ? { description, paths } : undefined;
}

function parsePath(value: unknown): ChangesOverviewPathInput | undefined {
  const row = obj(value);
  const path = str(row?.path);
  const change = str(row?.change) as ChangeKind | undefined;
  if (!path || !change || !CHANGE_KINDS.includes(change)) return undefined;
  return { path, change };
}
