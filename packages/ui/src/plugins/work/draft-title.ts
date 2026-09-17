export function titleFromPrompt(prompt: string): string {
  const line = prompt.trim().split('\n')[0]?.trim() || 'Draft';
  return line.length > 80 ? `${line.slice(0, 77)}...` : line;
}
