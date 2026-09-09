export const claudeCodeAuthErrorHints: readonly RegExp[] = [
  /ANTHROPIC_API_KEY/i,
  /not authenticated/i,
  /authentication failed/i,
  /claude\s+login/i,
  /please run.*claude.*login/i,
];
