export type SdkStdioPermissionPendingEntry = {
  resolve: (result: unknown) => void;
  params: Record<string, unknown>;
};

export function resolvePendingSdkStdioPermissionCancellations(
  pending: Map<string, SdkStdioPermissionPendingEntry>,
): void {
  for (const [id, entry] of [...pending.entries()]) {
    pending.delete(id);
    entry.resolve({ outcome: { outcome: 'cancelled' as const } });
  }
}
