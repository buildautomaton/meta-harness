export type DesignChoice = {
  id: string;
  label: string;
};

export type DesignQuestion = {
  id: string;
  prompt: string;
  context: string;
  choices: DesignChoice[];
  answerId?: string | null;
  locked?: boolean;
};

export type UiReviewQuestions = {
  filename: string;
  questions: DesignQuestion[];
};

export type ReviewQuestions = {
  overview?: DesignQuestion[];
  modules?: DesignQuestion[];
  ui?: UiReviewQuestions[];
};

export type QuestionAnswer = {
  subject: string;
  questionId: string;
  choiceId: string;
};

export const OVERVIEW_QUESTIONS_KEY = '__overview__';
export const MODULES_QUESTIONS_KEY = '__modules__';
