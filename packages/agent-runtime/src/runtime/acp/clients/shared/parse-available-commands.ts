/** Normalize ACP `availableCommands` / `available_commands` list from a session update payload. */
export function parseAvailableCommandsList(raw: unknown): unknown[] | null {
  if (!Array.isArray(raw)) return null;
  return raw;
}

export function availableCommandsFromSessionUpdatePayload(
  flatPayload: Record<string, unknown>,
): unknown[] | null {
  return parseAvailableCommandsList(flatPayload.availableCommands ?? flatPayload.available_commands);
}
