import { join } from 'node:path';

export function diskPaths(dir: string, id: string) {
  return {
    meta: join(dir, `${id}.json`),
    transcript: join(dir, `${id}.md`),
    events: join(dir, `${id}.jsonl`),
  };
}
