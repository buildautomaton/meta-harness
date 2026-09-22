import { changeMark } from './change-mark.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';

export function mermaidMarkdown(
  title: string,
  whatChanged: string,
  mermaid: string,
  highlightsJson?: string,
): string {
  const parts = [
    `# ${title}`,
    '',
    '## What changed',
    '',
    whatChanged,
    '',
    '```mermaid',
    mermaid.trim(),
    '```',
    '',
  ];
  if (highlightsJson) {
    parts.push('```json highlights', highlightsJson, '```', '');
  }
  return parts.join('\n');
}

export function apiMarkdown(api: NonNullable<SubmitWorkInput['api']>): string {
  const rows = api.routes.map(
    (r) => `| ${changeMark(r.change)} | \`${r.method}\` | \`${r.path}\` | ${r.description} |`,
  );
  return [
    '# API routes',
    '',
    '| | Method | Path | Description |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}
