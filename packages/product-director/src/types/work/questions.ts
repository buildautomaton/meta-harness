export const CHOICE_KINDS = ['status_quo', 'change'] as const;
export type ChoiceKind = (typeof CHOICE_KINDS)[number];

export type DesignChoice = {
  id: string;
  label: string;
  kind?: ChoiceKind;
  recommended?: boolean;
  prompt?: string;
  context?: string;
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

export function isStatusQuoChoice(choice: Pick<DesignChoice, 'kind'> | undefined): boolean {
  return choice?.kind === 'status_quo';
}
