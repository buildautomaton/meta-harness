import { spawn } from 'node:child_process';
import * as readline from 'node:readline';

export type StreamCommandResult = { code: number | null; signal: NodeJS.Signals | null };

/** Run a command, invoking onLine for each stdout/stderr line as it arrives. */
export function runStreamingCommand(
  command: string,
  args: string[],
  options: {
    env: NodeJS.ProcessEnv;
    timeoutMs?: number;
    onLine?: (line: string) => void;
  }
): Promise<StreamCommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let settled = false;
    const timer =
      options.timeoutMs != null
        ? setTimeout(() => {
            child.kill('SIGKILL');
            if (!settled) {
              settled = true;
              reject(new Error(`Command timed out after ${options.timeoutMs}ms`));
            }
          }, options.timeoutMs)
        : null;

    const onLine = (line: string) => {
      if (line.length > 0) options.onLine?.(line);
    };
    if (child.stdout) {
      readline.createInterface({ input: child.stdout, crlfDelay: Infinity }).on('line', onLine);
    }
    if (child.stderr) {
      readline.createInterface({ input: child.stderr, crlfDelay: Infinity }).on('line', onLine);
    }

    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      if (!settled) {
        settled = true;
        reject(err);
      }
    });
    child.on('close', (code, signal) => {
      if (timer) clearTimeout(timer);
      if (!settled) {
        settled = true;
        resolve({ code, signal });
      }
    });
  });
}
