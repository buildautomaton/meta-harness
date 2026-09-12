/** Max chars of agent stderr echoed to the bridge TTY per chunk. */
export const STDERR_TERMINAL_CHUNK_MAX = 240;

const SUPPRESS_STDERR_PATTERNS = [
  /codex_core::models_manager/i,
  /failed to refresh available models/i,
  /@zed-industries\/codex-acp/i,
  /npm warn deprecated/i,
  /npm notice/i,
  /fatal: not a git repository/i,
];

/**
 * Truncate / filter agent stderr for the bridge terminal.
 * Drops known noisy Codex/npm dumps so they do not fill the screen.
 */
export function formatStderrForTerminal(text: string, maxChars = STDERR_TERMINAL_CHUNK_MAX): string {
  if (!text) return text;
  if (SUPPRESS_STDERR_PATTERNS.some((re) => re.test(text))) {
    return '';
  }
  const bodyIdx = text.indexOf('; body:');
  if (bodyIdx >= 0) {
    const s = `${text.slice(0, bodyIdx)}; body: [omitted]`;
    return s.length <= maxChars ? `${s}\n` : `${s.slice(0, maxChars)}… [stderr truncated]\n`;
  }
  const trimmed = text.trimStart();
  if (
    text.length > maxChars &&
    (trimmed.startsWith('{') || trimmed.startsWith('"') || trimmed.startsWith('['))
  ) {
    return '';
  }
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}… [stderr truncated]\n`;
}
