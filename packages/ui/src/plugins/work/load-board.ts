import type { WorkArtifact, WorkClient, WorkItem } from './types.js';
import { loadArtifacts } from './load-artifacts.js';
import { resolveWorkOrigin } from './resolve-origin.js';

export type WorkBoard = {
  artifacts: WorkArtifact[];
  items: WorkItem[];
};

export async function loadBoard(client: WorkClient): Promise<WorkBoard> {
  const [artifacts, items] = await Promise.all([loadArtifacts(client), client.listWork()]);
  return {
    artifacts,
    items: items.map((item) => ({ ...item, origin: resolveWorkOrigin(item, artifacts) })),
  };
}
