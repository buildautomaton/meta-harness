/** Auth-error hint lookup. Hints live on each registered agent harness. */
export function localAgentErrorSuggestsAuth(
  hints: readonly RegExp[] | undefined | null,
  errorText: string | undefined | null,
): boolean {
  if (!hints?.length || errorText == null || !String(errorText).trim()) return false;
  return hints.some((re) => re.test(String(errorText)));
}
