import type { ToolContext } from '@buildautomaton/runtime';
import type { McpToolCallResult } from '@buildautomaton/runtime';
import { hasArtifacts } from '@plugins/runtime/work/artifacts/kinds.js';
import { parseSubmitWork } from './parse-submit.js';
import { NO_ARTIFACTS, NO_WORK_BACKEND } from './format-next.js';
import { text } from './ask-handle.js';
import { artifactsFrom, workFrom } from './ctx.js';

export async function handleTellWhatWasBuilt(
  args: Record<string, unknown>,
  ctx: ToolContext,
): Promise<McpToolCallResult> {
  const work = workFrom(ctx);
  if (!work) return text(NO_WORK_BACKEND, true);
  const kinds = artifactsFrom(ctx);
  const parsed = parseSubmitWork(args, kinds);
  if (typeof parsed === 'string') return text(parsed, true);
  if (!hasArtifacts(parsed, kinds)) return text(NO_ARTIFACTS, true);
  const artifact = await work.recordSubmission(parsed);
  const names = artifact.files.map((f) => `  ${f.path}`).join('\n');
  return text([`Recorded "${artifact.title}"`, `Artifact ${artifact.id}`, 'Files:', names].join('\n'));
}
