/**
 * Flatten SDK `session/update` notification to the bridge shape (top-level `sessionUpdate`).
 */

export function flattenSdkSessionNotificationParams(params: {
  sessionId: string;
  update: Record<string, unknown>;
}): Record<string, unknown> {
  return { sessionId: params.sessionId, ...params.update };
}
