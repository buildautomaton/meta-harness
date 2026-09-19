import type {
  AnswerQuestionsResult,
  ArtifactSummary,
  WorkArtifact,
  WorkClient,
  WorkItem,
  WorkPatch,
} from './types.js';

export type HttpWorkClientOptions = {
  base?: string;
  workPath?: string;
  artifactsPath?: string;
};

async function json<T>(res: Promise<Response>): Promise<T> {
  const resolved = await res;
  if (!resolved.ok) throw new Error(`${resolved.status} ${resolved.statusText}`);
  if (resolved.status === 204) return undefined as T;
  const text = await resolved.text();
  if (!text.trim()) return undefined as T;
  return JSON.parse(text) as T;
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
    updateWork: (id, patch: WorkPatch) =>
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
    answerQuestions: async (artifactId, answers) => {
      const result = await json<AnswerQuestionsResult | WorkItem[] | undefined>(
        fetch(`${base}${artifactsPath}/${artifactId}/answers`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answers),
        }),
      );
      if (Array.isArray(result)) return { queued: result, removed: [] };
      return { queued: result?.queued ?? [], removed: result?.removed ?? [] };
    },
    answerWorkQuestions: (workId, answers) =>
      json<WorkItem | null>(
        fetch(`${base}${workPath}/${workId}/answers`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answers),
        }),
      ),
  };
}
