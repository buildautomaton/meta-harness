import type { MinionAsk, NotifierHub, NotifierSink } from '@/types/notify.js';

export function createNotifierHub(): NotifierHub {
  const sinks = new Set<NotifierSink>();
  return {
    notify(event) {
      for (const sink of sinks) sink.notify(event);
    },
    ask(request) {
      const tasks = [...sinks]
        .map((sink) => sink.ask?.(request))
        .filter((task): task is Promise<unknown | undefined> => task != null);
      if (tasks.length === 0) return Promise.resolve(undefined);
      return firstDefined(tasks);
    },
    subscribe(sink) {
      sinks.add(sink);
      return () => {
        sinks.delete(sink);
      };
    },
  };
}

function firstDefined(tasks: Promise<unknown | undefined>[]): Promise<unknown | undefined> {
  return new Promise((resolve) => {
    let remaining = tasks.length;
    for (const task of tasks) {
      void task.then(
        (value) => {
          if (value !== undefined) resolve(value);
          else if (--remaining === 0) resolve(undefined);
        },
        () => {
          if (--remaining === 0) resolve(undefined);
        },
      );
    }
  });
}

export function askMinion(hub: NotifierHub | undefined, request: MinionAsk): void {
  if (!hub) return;
  void hub.ask(request);
}
