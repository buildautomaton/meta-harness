import type { WorkArtifact, WorkClient, WorkItem } from './types.js';

async function json<T>(res: Promise<Response>): Promise<T> {
  const resolved = await res;
  if (!resolved.ok) throw new Error(`${resolved.status} ${resolved.statusText}`);
  if (resolved.status === 204) return undefined as T;
  return (await resolved.json()) as T;
}

export function createHttpWorkClient(base = ''): WorkClient {
  return {
    listWork: () => json<WorkItem[]>(fetch(`${base}/api/work`)),
    addWork: (input) =>
      json<WorkItem>(
        fetch(`${base}/api/work`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(input),
        }),
      ),
    updateWork: (id, patch) =>
      json<WorkItem | null>(
        fetch(`${base}/api/work/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(patch),
        }),
      ),
    listArtifacts: (workId) =>
      json<{ id: string }[]>(fetch(workId ? `${base}/api/work/${workId}/artifacts` : `${base}/api/artifacts`)),
    getArtifact: (id) => json<WorkArtifact | null>(fetch(`${base}/api/artifacts/${id}`)),
    answerQuestions: (artifactId, answers) =>
      json<void>(
        fetch(`${base}/api/artifacts/${artifactId}/answers`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answers),
        }),
      ),
  };
}
