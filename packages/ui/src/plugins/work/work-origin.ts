import type { WorkOrigin } from './types.js';
import { revealElement } from './reveal-element.js';

export function questionOriginId(origin: Extract<WorkOrigin, { kind: 'question' }>): string {
  return ['work-question', origin.artifactId, origin.subject, origin.questionId]
    .map(encodeURIComponent)
    .join('--');
}

export function artifactOriginId(artifactId: string): string {
  return `work-artifact-${artifactId}`;
}

export function draftOriginId(workId: string): string {
  return `work-draft-${workId}`;
}

export function originTargetIds(origin: WorkOrigin): string[] {
  if (origin.kind === 'question') return [questionOriginId(origin), artifactOriginId(origin.artifactId)];
  return [draftOriginId(origin.workId)];
}

export function scrollToOrigin(origin: WorkOrigin): void {
  const el = originTargetIds(origin)
    .map((id) => document.getElementById(id))
    .find((node): node is HTMLElement => node !== null);
  if (!el) return;
  revealElement(el);
  el.setAttribute('data-origin-flash', '');
  window.setTimeout(() => el.removeAttribute('data-origin-flash'), 1200);
}
