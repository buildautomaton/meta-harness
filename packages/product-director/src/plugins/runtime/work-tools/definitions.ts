import type { McpToolDefinition } from '@buildautomaton/runtime';
import type { ArtifactKind } from '@/types/artifact/kind.js';
import { ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DEFINITION } from './ask-def.js';
import { tellWhatWasBuiltDefinition } from './tell-def.js';
import { ASK_PRODUCT_DIRECTOR_INTERVIEW_QUESTIONS_DEFINITION } from './interview-def.js';
import { builtinArtifactKinds } from '../artifacts/builtins.js';

export function workToolDefinitions(artifacts: ArtifactKind[]): McpToolDefinition[] {
  return [
    ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DEFINITION,
    ASK_PRODUCT_DIRECTOR_INTERVIEW_QUESTIONS_DEFINITION,
    tellWhatWasBuiltDefinition(artifacts),
  ];
}

export const WORK_TOOL_DEFINITIONS: McpToolDefinition[] = workToolDefinitions(builtinArtifactKinds());
