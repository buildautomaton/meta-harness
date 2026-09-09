import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { isShutdownRequested } from '../util/shutdown.js';
import { agentPathEnv, getAgentPathEntries } from './agent-path.js';

const execFileAsync = promisify(execFile);

/** Default for `which` probes — keep short so startup/shutdown are not held on a slow PATH lookup. */
export const COMMAND_ON_PATH_PROBE_TIMEOUT_MS = 750;

async function execFileShutdownAware(
  file: string,
  args: readonly string[],
  timeoutMs: number,
): Promise<void> {
  if (isShutdownRequested()) throw new Error('shutdown');

  const ac = new AbortController();
  const shutdownPoll = setInterval(() => {
    if (isShutdownRequested()) ac.abort();
  }, 50);
  shutdownPoll.unref?.();

  try {
    await execFileAsync(file, args, { timeout: timeoutMs, signal: ac.signal });
  } finally {
    clearInterval(shutdownPoll);
  }
}

async function isExecutableFile(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function isCommandInBridgeAgentDirs(command: string): Promise<boolean> {
  const home = process.env.HOME ?? homedir();
  for (const dir of getAgentPathEntries(home)) {
    if (await isExecutableFile(join(dir, command))) return true;
  }
  return false;
}

/** Best-effort: `which <command>` or a known bridge install dir (Unix/macOS bridge host). */
export async function isCommandOnPath(
  command: string,
  timeoutMs = COMMAND_ON_PATH_PROBE_TIMEOUT_MS,
): Promise<boolean> {
  if (isShutdownRequested()) return false;
  try {
    await execFileAsync('which', [command], {
      timeout: timeoutMs,
      env: agentPathEnv(),
    });
    return true;
  } catch {
    return isCommandInBridgeAgentDirs(command);
  }
}

/** Retry PATH probes after install — symlinks can lag briefly on some hosts. */
export async function waitForCommandOnPath(
  command: string,
  opts: { maxAttempts?: number; delayMs?: number; timeoutMs?: number } = {},
): Promise<boolean> {
  const maxAttempts = opts.maxAttempts ?? 8;
  const delayMs = opts.delayMs ?? 400;
  const timeoutMs = opts.timeoutMs ?? COMMAND_ON_PATH_PROBE_TIMEOUT_MS;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (await isCommandOnPath(command, timeoutMs)) return true;
    if (attempt < maxAttempts - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

/** Run a short subprocess probe; aborts on shutdown (used by agent presence detection). */
export async function execProbeShutdownAware(
  file: string,
  args: readonly string[],
  timeoutMs: number,
): Promise<boolean> {
  if (isShutdownRequested()) return false;
  try {
    await execFileShutdownAware(file, args, timeoutMs);
    return true;
  } catch {
    return false;
  }
}
