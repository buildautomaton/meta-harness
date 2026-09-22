import type { ArtifactKind } from '@/types/artifact/kind.js';

const BASE = `You have product director tools.

At the start of a session, call ask_product_director_what_to_build_next.
If there is no queued work and no drafts, that call waits until work is queued.
If it returns queued work, implement that. When finished, call tell_product_director_what_was_built with the same sessionId, project, and artifacts.
Keep that sessionId for the whole agent session: reuse it on every tell; do not invent a new one or ask again only to obtain another sessionId.
The sessionId is an MCP explicit state handle in ask's structuredContent — read it from there and thread it into tell.
On tell: always pass summary and changesOverview for code changes, plus ui/api/dataModel/algorithm whenever those surfaces changed. Do not stop after summary/changesOverview.
If it lists drafts, interview each with ask_product_director_interview_questions: exactly one question per call, 2–6 options with a recommended choice and a "Something else" option, then wait for the answer before continuing. When the plan is sharp, pass questions: [] to queue (or the user may accept the draft from the dashboard).`;

export function workInstructions(artifacts: ArtifactKind[]): string {
  const extra = artifacts.map((kind) => kind.instructions ?? kind.description).filter(Boolean);
  return [BASE, ...extra].join('\n\n');
}

export const WORK_INSTRUCTIONS = workInstructions([]);
