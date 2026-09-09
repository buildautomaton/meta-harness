export function writeJsonRpcLine(
  stdin: NodeJS.WritableStream,
  payload: Record<string, unknown>,
  callback?: (err: Error | null | undefined) => void,
): void {
  stdin.write(JSON.stringify(payload) + '\n', callback);
}
