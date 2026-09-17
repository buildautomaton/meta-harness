import type { WorkArtifact, WorkClient, WorkItem } from './types.js';
import { loadArtifacts } from './load-artifacts.js';

export type WorkBoard = {
  artifacts: WorkArtifact[];
  items: WorkItem[];
};

export async function loadBoard(client: WorkClient): Promise<WorkBoard> {
  const [artifacts, items] = await Promise.all([
    loadArtifacts(client),
    client.listWork().catch(() => [] as WorkItem[]),
  ]);
  return { artifacts, items };
}
