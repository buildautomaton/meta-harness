import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { ArtifactKind } from '@/types/artifact/kind.js';
import { parseQuestions } from './parse-parts.js';
import { parseAssets } from './parse-extra.js';

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function parseSubmitWork(
  args: Record<string, unknown>,
  artifacts: ArtifactKind[],
): SubmitWorkInput | string {
  const title = str(args.title);
  const description = str(args.description);
  if (!title || !description) return 'title and description are required';
  const project = str(args.project);
  if (!project) return 'project is required';
  const extra: Record<string, unknown> = {};
  for (const kind of artifacts) {
    const parsed = kind.parse ? kind.parse(args[kind.key]) : args[kind.key];
    if (parsed != null) extra[kind.key] = parsed;
  }
  return {
    title,
    description,
    project,
    sessionId: str(args.sessionId),
    turnId: str(args.turnId),
    assets: parseAssets(args.assets),
    questions: parseQuestions(args.questions),
    ...extra,
  } as SubmitWorkInput;
}
