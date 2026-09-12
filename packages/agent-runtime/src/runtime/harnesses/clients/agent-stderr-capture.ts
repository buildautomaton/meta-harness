import type { ChildProcess } from 'node:child_process';
import { formatStderrForTerminal } from './format-stderr-for-terminal.js';

/** Bounded buffer for merging into PromptResult / auth heuristics (not the full Codex dump). */
const STDERR_CAPTURE_MAX = 4_000;

export function createStderrCapture(_child: ChildProcess): {
  append: (chunk: Buffer) => void;
  getText: () => string;
} {
  const chunks: Buffer[] = [];
  let total = 0;
  return {
    append(chunk: Buffer) {
      const forTerminal = formatStderrForTerminal(chunk.toString('utf8'));
      if (forTerminal) {
        try {
          process.stderr.write(forTerminal);
        } catch {
          /* ignore */
        }
      }
      if (!forTerminal || total >= STDERR_CAPTURE_MAX) return;
      const buf = Buffer.from(forTerminal, 'utf8');
      const n = Math.min(buf.length, STDERR_CAPTURE_MAX - total);
      if (n <= 0) return;
      chunks.push(n === buf.length ? buf : buf.subarray(0, n));
      total += n;
    },
    getText() {
      return Buffer.concat(chunks).toString('utf8').trim();
    },
  };
}

/** JSON-RPC 2.0 error object (plain object) or `Error`. */
export function formatJsonRpcStyleError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err != null && typeof err === 'object') {
    const o = err as Record<string, unknown>;
    const msg = typeof o.message === 'string' ? o.message : null;
    const code = o.code != null ? String(o.code) : '';
    if (msg) return code ? `[${code}] ${msg}` : msg;
  }
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function mergeErrorWithStderr(primary: string | undefined, stderrText: string): string {
  const s = stderrText.trim();
  const p = (primary ?? '').trim();
  if (!s) return p;
  if (!p) return s;
  if (p.includes(s) || s.includes(p)) return p.length >= s.length ? p : s;
  return `${p}\n${s}`;
}
