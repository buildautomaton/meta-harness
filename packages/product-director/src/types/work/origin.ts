export type QuestionOrigin = {
  kind: 'question';
  artifactId: string;
  subject: string;
  questionId: string;
};

export type DraftOrigin = { kind: 'draft'; workId: string };

export type WorkOrigin = QuestionOrigin | DraftOrigin;
