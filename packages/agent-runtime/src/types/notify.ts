export type MinionEventType =
  | 'progress'
  | 'permission'
  | 'auth'
  | 'question'
  | 'failure'
  | 'completed';

export type MinionEvent = {
  minionId: string;
  type: MinionEventType;
  message: string;
  payload?: unknown;
};

export type MinionPendingRequest = {
  requestId: string;
  kind: 'permission' | 'auth' | 'question';
  method: string;
  title: string;
  message: string;
  options?: Array<{ optionId: string; label: string }>;
};

export type MinionAsk = MinionPendingRequest & { minionId: string };

export type NotifierSink = {
  notify(event: MinionEvent): void;
  ask?(request: MinionAsk): Promise<unknown | undefined>;
};

export type NotifierHub = {
  notify(event: MinionEvent): void;
  ask(request: MinionAsk): Promise<unknown | undefined>;
  subscribe(sink: NotifierSink): () => void;
};
