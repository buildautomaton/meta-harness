export function clientSupportsElicitation(params: Record<string, unknown>): boolean {
  const caps = params.capabilities;
  return Boolean(caps && typeof caps === 'object' && 'elicitation' in caps);
}
