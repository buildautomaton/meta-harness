import type { SubmitWorkInput } from '@/types/work/submit.js';

type Algorithm = NonNullable<SubmitWorkInput['algorithm']>;

export function algorithmMarkdown(algorithm: Algorithm): string {
  return [
    `# ${algorithm.name}`,
    '',
    '## What changed',
    '',
    algorithm.whatChanged,
    '',
    '## Pseudocode',
    '',
    '```',
    algorithm.pseudocode,
    '```',
    '',
  ].join('\n');
}
