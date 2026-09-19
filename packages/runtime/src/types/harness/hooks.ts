/**
 * Notifications a harness plugin may send to the host.
 * The runtime still forwards session updates and requests.
 */
export type HarnessHooks = {
  onSessionUpdate?: (params: unknown) => void;
  onRequest?: (request: {
    requestId: string;
    method: string;
    params: Record<string, unknown>;
  }) => void;
  onFileChange?: (evt: {
    path: string;
    oldText: string;
    newText: string;
    patchContent: string;
  }) => void;
};
