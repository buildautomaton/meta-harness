import { normalizeProjectName } from './project-name.js';
import type { WorkClient } from './types.js';

export async function assignToProject(
  client: WorkClient,
  target: { workId?: string; artifactId?: string },
  name: string,
): Promise<string | null> {
  const next = normalizeProjectName(name);
  if (!next) return null;
  if (target.workId) await client.updateWork(target.workId, { project: next });
  else if (target.artifactId) await client.updateArtifact(target.artifactId, { project: next });
  else return null;
  return next;
}
