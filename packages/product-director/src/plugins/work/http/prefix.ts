export function restAfterPrefix(pathname: string, prefix: string): string | null {
  if (pathname === prefix || pathname === `${prefix}/`) return '';
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length + 1);
  return null;
}
