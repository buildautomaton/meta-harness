import type { SessionConfigOption } from '@agentclientprotocol/sdk';

export function configOptionsForPermission(
  getActive: (() => unknown[] | null) | undefined,
  established: SessionConfigOption[] | null | undefined,
): SessionConfigOption[] | null | undefined {
  const mem = getActive?.();
  if (Array.isArray(mem) && mem.length > 0) return mem as SessionConfigOption[];
  return established ?? undefined;
}
