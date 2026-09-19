export function clientSupportsElicitation(params: Record<string, unknown>): boolean {
  return hasCapability(params, 'elicitation');
}

export function clientSupportsSampling(params: Record<string, unknown>): boolean {
  return hasCapability(params, 'sampling');
}

function hasCapability(params: Record<string, unknown>, name: string): boolean {
  const caps = params.capabilities;
  return Boolean(caps && typeof caps === 'object' && name in caps);
}
