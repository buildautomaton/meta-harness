import type { ToolContext } from '@buildautomaton/runtime';
import type { McpToolCallResult } from '@buildautomaton/runtime';
import { hasArtifacts } from '@plugins/runtime/work/artifacts/kinds.js';
import { parseSubmitWork } from './parse-submit.js';
import { NO_ARTIFACTS, NO_WORK_BACKEND } from './format-next.js';
import { toolText } from './tool-result.js';
import { artifactsFrom, workFrom } from './ctx.js';

export async function handleTellWhatWasBuilt(
  args: Record<string, unknown>,
  ctx: ToolContext,
): Promise<McpToolCallResult> {
  const work = workFrom(ctx);
  if (!work) return toolText(NO_WORK_BACKEND, { isError: true });
  const kinds = artifactsFrom(ctx);
  const parsed = parseSubmitWork(args, kinds);
  if (typeof parsed === 'string') return toolText(parsed, { isError: true });
  if (!hasArtifacts(parsed, kinds)) return toolText(NO_ARTIFACTS, { isError: true });
  const artifact = await work.recordSubmission(parsed);
  const names = artifact.files.map((f) => `  ${f.path}`).join('\n');
  const sessionId = artifact.sessionId ?? parsed.sessionId;
  const lines = [`Recorded "${artifact.title}"`, `Artifact ${artifact.id}`, 'Files:', names];
  if (sessionId) lines.splice(2, 0, `Session ID: ${sessionId}`);
  return toolText(lines.join('\n'), {
    structuredContent: {
      artifactId: artifact.id,
      ...(sessionId ? { sessionId } : {}),
    },
  });
}
