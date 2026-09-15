import type { SessionLogEntry } from '@/types/session/log.js';
import type { MinionPendingRequest } from '@/types/notify.js';

export function minionProgressSummary(
  log: SessionLogEntry[],
  pending: MinionPendingRequest[] = [],
): string {
  const lines: string[] = [];
  for (const req of pending) {
    lines.push(`Waiting: ${req.title}: ${req.message}`);
  }
  for (const tool of log.filter((row) => row.type === 'tool_call').slice(-8)) {
    lines.push(formatTool(tool));
  }
  const message = lastMessage(log);
  if (message) lines.push(clip(message, 240));
  return lines.join('\n') || 'Minion still running';
}

function formatTool(tool: SessionLogEntry): string {
  const name = tool.title || tool.name || tool.kind || 'tool';
  return tool.status ? `${name} — ${tool.status}` : name;
}

function lastMessage(log: SessionLogEntry[]): string {
  for (let i = log.length - 1; i >= 0; i--) {
    const text = log[i]?.type === 'message' ? log[i]?.text?.trim() : undefined;
    if (text) return text;
  }
  return '';
}

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 3)}...`;
}
