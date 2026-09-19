/**
 * Maps ACP / bridge wire kinds to short labels for user-facing CLI logs.
 */
const SESSION_UPDATE_KIND_LABELS: Record<string, string> = {
  tool_call: 'Tool call',
  tool_call_update: 'Tool call status',
  agent_message_chunk: 'Agent message chunk',
  update: 'Session update',
};

/**
 * Human-readable label for a session update kind (avoids raw snake_case wire names in logs).
 */
export function formatSessionUpdateKindForLog(kind: string): string {
  const known = SESSION_UPDATE_KIND_LABELS[kind];
  if (known) return known;
  return kind
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
