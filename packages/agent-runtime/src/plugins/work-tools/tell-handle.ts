import type { ToolContext } from '@/types/tools/implementation.js';
import type { McpToolCallResult } from '@/types/tools/definitions.js';
import { hasArtifacts } from '@plugins/work/artifacts/kinds.js';
import { parseSubmitWork } from './parse-submit.js';
import { NO_ARTIFACTS, NO_WORK_BACKEND } from './format-next.js';
import { text } from './ask-handle.js';

export async function handleTellWhatWasBuilt(
  args: Record<string, unknown>,
  ctx: ToolContext,
): Promise<McpToolCallResult> {
  if (!ctx.work) return text(NO_WORK_BACKEND, true);
  const parsed = parseSubmitWork(args);
  if (typeof parsed === 'string') return text(parsed, true);
  if (!hasArtifacts(parsed)) return text(NO_ARTIFACTS, true);
  const artifact = await ctx.work.recordSubmission(parsed);
  const names = artifact.files.map((f) => `  ${f.path}`).join('\n');
  return text([`Recorded "${artifact.title}"`, `Artifact ${artifact.id}`, 'Files:', names].join('\n'));
}
