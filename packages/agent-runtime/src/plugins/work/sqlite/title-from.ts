export function titleFromPrompt(prompt: string): string {
  const line = prompt.trim().split('\n')[0] ?? 'Follow-up';
  return line.length > 72 ? `${line.slice(0, 69).trim()}…` : line || 'Follow-up';
}
