import type { ArtifactSummary, WorkArtifact, WorkClient, WorkItem } from './types.js';

export type HttpWorkClientOptions = {
  base?: string;
  workPath?: string;
  artifactsPath?: string;
};

async function json<T>(res: Promise<Response>): Promise<T> {
  const resolved = await res;
  if (!resolved.ok) throw new Error(`${resolved.status} ${resolved.statusText}`);
  if (resolved.status === 204) return undefined as T;
  return (await resolved.json()) as T;
}

export function createHttpWorkClient(options: HttpWorkClientOptions | string = ''): WorkClient {
  const opts = typeof options === 'string' ? { base: options } : options;
  const base = opts.base ?? '';
  const workPath = opts.workPath ?? '/api/work';
  const artifactsPath = opts.artifactsPath ?? '/api/artifacts';
  return {
    listWork: () => json<WorkItem[]>(fetch(`${base}${workPath}`)),
    addWork: (input) =>
      json<WorkItem>(
        fetch(`${base}${workPath}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(input),
        }),
      ),
    updateWork: (id, patch) =>
      json<WorkItem | null>(
        fetch(`${base}${workPath}/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(patch),
        }),
      ),
    listArtifacts: (workId) =>
      json<ArtifactSummary[]>(fetch(workId ? `${base}${workPath}/${workId}/artifacts` : `${base}${artifactsPath}`)),
    getArtifact: (id) => json<WorkArtifact | null>(fetch(`${base}${artifactsPath}/${id}`)),
    answerQuestions: (artifactId, answers) =>
      json<void>(
        fetch(`${base}${artifactsPath}/${artifactId}/answers`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answers),
        }),
      ),
  };
}
