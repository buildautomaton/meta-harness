export function matchEndpoint<T extends { path: string }>(
  endpoints: readonly T[],
  pathname: string,
): T | undefined {
  const hits = endpoints.filter((e) => pathname === e.path || pathname.startsWith(`${e.path}/`));
  return [...hits].sort((a, b) => b.path.length - a.path.length)[0];
}
