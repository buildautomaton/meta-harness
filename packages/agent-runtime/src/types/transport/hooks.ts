/** Notifications a transport plugin may send to the host. */
export type TransportHooks = {
  onStart?: (info: { cwd: string }) => void;
  onStop?: () => void;
};
