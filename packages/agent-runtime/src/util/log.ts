import type { LogFn } from '../types/log.js';

let defaultLog: LogFn = (line) => {
  console.log(line);
};

export function setDefaultLog(fn: LogFn): void {
  defaultLog = fn;
}

export function log(line: string): void {
  defaultLog(line);
}

export function logDebug(line: string): void {
  if (process.env.AGENT_RUNTIME_DEBUG === '1' || process.env.DEBUG) {
    defaultLog(`[debug] ${line}`);
  }
}
