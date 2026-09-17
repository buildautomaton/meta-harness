import { artifactTabLabel } from './preview-files.js';
import type { DesignQuestion } from './types.js';

export type FlatQuestion = {
  key: string;
  subject: string;
  subjectLabel: string;
  question: DesignQuestion;
};

export function subjectLabel(path: string): string {
  if (path === '__modules__') return 'Modules';
  if (path === '__overview__' || path === 'overview.md') return 'Overview';
  return artifactTabLabel(path);
}

export function flattenQuestions(bySubject: Record<string, DesignQuestion[]>): FlatQuestion[] {
  const out: FlatQuestion[] = [];
  for (const [subject, questions] of Object.entries(bySubject)) {
    for (const question of questions) {
      out.push({
        key: `${subject}:${question.id}`,
        subject,
        subjectLabel: subjectLabel(subject),
        question,
      });
    }
  }
  return out;
}
