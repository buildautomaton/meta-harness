export const cursorAuthErrorHints: readonly RegExp[] = [
  /cursor_login/i,
  /authenticate.*cursor/i,
  /not logged in.*cursor/i,
  /run:\s*agent\s+login/i,
];
