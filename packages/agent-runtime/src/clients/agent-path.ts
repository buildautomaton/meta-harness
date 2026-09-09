import { homedir } from 'node:os';
import { join } from 'node:path';

/** Common install locations not always present in a long-lived bridge process PATH. */
export function getAgentPathEntries(home = process.env.HOME ?? homedir()): string[] {
  const entries = [join(home, '.local', 'bin'), join(home, '.npm-global', 'bin'), '/usr/local/bin'];
  const prefix = process.env.NPM_CONFIG_PREFIX;
  if (prefix) entries.push(join(prefix, 'bin'));
  return entries;
}

export function augmentPath(pathValue: string | undefined, extra: string[]): string {
  const current = pathValue ?? '';
  const parts = current.split(':').filter(Boolean);
  const seen = new Set(parts);
  const prefix: string[] = [];
  for (const entry of extra) {
    if (!entry || seen.has(entry)) continue;
    seen.add(entry);
    prefix.push(entry);
  }
  if (prefix.length === 0) return current;
  return current ? `${prefix.join(':')}:${current}` : prefix.join(':');
}

/** Prepend known agent install dirs so `which` and spawn find freshly installed CLIs. */
export function applyAgentPathToProcessEnv(): void {
  const extra = getAgentPathEntries();
  process.env.PATH = augmentPath(process.env.PATH, extra);
}

export function agentPathEnv(base: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  return { ...base, PATH: augmentPath(base.PATH, getAgentPathEntries()) };
}
