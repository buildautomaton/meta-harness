import type { DataModelHighlight } from '../../../../../types/work/data-model.js';

const MERMAID_RE = /```mermaid\s*\n([\s\S]*?)```/;
const HIGHLIGHTS_RE = /```json\s+highlights\s*\n([\s\S]*?)```/;
const TITLE_RE = /^#\s+(.+)$/m;
const WHAT_RE = /##\s+What changed\s*\n+([\s\S]*?)(?=\n##|\n```|$)/i;

export type MermaidMdParts = {
  title: string;
  whatChanged: string;
  mermaid: string;
  highlights: DataModelHighlight[];
};

export function parseMermaidMarkdown(md: string): MermaidMdParts | undefined {
  const mermaid = md.match(MERMAID_RE)?.[1]?.trim();
  if (!mermaid) return undefined;
  const title = md.match(TITLE_RE)?.[1]?.trim() || 'Data model';
  const whatChanged = md.match(WHAT_RE)?.[1]?.trim() || '';
  let highlights: DataModelHighlight[] = [];
  const raw = md.match(HIGHLIGHTS_RE)?.[1]?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) highlights = parsed as DataModelHighlight[];
    } catch {
      highlights = [];
    }
  }
  return { title, whatChanged, mermaid, highlights };
}
