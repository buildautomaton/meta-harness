import type { WorkItem } from './records.js';

export type InterviewAnswer = {
  id: string;
  prompt: string;
  choiceId: string;
  label: string;
};

export type InterviewRound = {
  done: boolean;
  item: WorkItem;
  answers?: InterviewAnswer[];
};
