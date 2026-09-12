/**
 * Minimal unified-diff snippet for in-process ACP file writes.
 * Self-contained (no external monorepo deps).
 */
export function editSnippetToUnifiedDiff(params: {
  path: string;
  oldText: string;
  newText: string;
}): string {
  const { path: filePath, oldText, newText } = params;
  if (oldText === newText) return '';
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const body: string[] = [
    `--- a/${filePath}`,
    `+++ b/${filePath}`,
    `@@ -1,${oldLines.length} +1,${newLines.length} @@`,
  ];
  for (const line of oldLines) body.push(`-${line}`);
  for (const line of newLines) body.push(`+${line}`);
  return body.join('\n') + '\n';
}
