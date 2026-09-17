import type { WorkArtifact, WorkClient } from './types.js';

export async function loadArtifacts(client: WorkClient): Promise<WorkArtifact[]> {
  const summaries = await client.listArtifacts();
  const rows = await Promise.all(summaries.map((row) => client.getArtifact(row.id)));
  return rows.filter((row): row is WorkArtifact => row !== null);
}
