import type { ArtifactKind } from '@/types/artifact/kind.js';

const BASE = `You have product director tools.

At the start of a session, call ask_product_director_what_to_build_next.
If it returns queued work, implement that. When finished, call tell_product_director_what_was_built with the same sessionId plus artifacts.
If it lists drafts, run a relentless interview with ask_product_director_interview_questions until you have no more questions, then pass questions: [].`;

export function workInstructions(artifacts: ArtifactKind[]): string {
  const extra = artifacts.map((kind) => kind.instructions ?? kind.description).filter(Boolean);
  return [BASE, ...extra].join('\n\n');
}

export const WORK_INSTRUCTIONS = workInstructions([]);
