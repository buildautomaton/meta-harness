/** Turn any thrown value into a readable string (avoids "[object Object]"). */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err != null && typeof err === 'object' && 'message' in err)
    return String((err as { message: unknown }).message);
  if (typeof err === 'string') return err;
  if (err != null && typeof err === 'object') return JSON.stringify(err);
  return String(err);
}
