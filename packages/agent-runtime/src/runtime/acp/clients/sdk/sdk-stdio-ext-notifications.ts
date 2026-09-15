/**
 * Default vendor JSON-RPC `extNotification` handler for SDK stdio clients.
 * Harnesses that emit vendor notifications (e.g. Kiro) inject their own via the harness.
 */

export type SdkStdioExtNotificationHandler = (method: string, params: unknown) => Promise<void>;

const noopExtNotification: SdkStdioExtNotificationHandler = async () => {};

/** No-op so unknown vendor notifications never throw (-32601) in the SDK. */
export function createSdkStdioExtNotificationHandler(_options?: {
  onSessionUpdate?: (payload: unknown) => void;
}): SdkStdioExtNotificationHandler {
  return noopExtNotification;
}
