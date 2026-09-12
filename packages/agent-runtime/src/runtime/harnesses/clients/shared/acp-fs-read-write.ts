/**
 * In-process ACP fs/read_text_file + fs/write_text_file helpers (SDK handler shape and Cursor RPC).
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { editSnippetToUnifiedDiff } from '../../../core/util/unified-diff.js';
import { resolveSafePathUnderCwd, toDisplayPathRelativeToCwd } from '../../../core/util/safe-path.js';
import type { AcpSessionContext } from '../acp-session-context.js';

export function sliceFileContentForAcp(content: string, line?: number | null, limit?: number | null): string {
  if (line == null && limit == null) return content;
  const lines = content.split('\n');
  const start = line != null && line > 0 ? line - 1 : 0;
  const end = limit != null && limit > 0 ? start + limit : lines.length;
  return lines.slice(start, end).join('\n');
}

export function acpReadTextFileInProcess(
  ctx: AcpSessionContext,
  filePath: string,
  line?: number | null,
  limit?: number | null,
): { content: string } {
  const resolvedPath = resolveSafePathUnderCwd(ctx.cwd, filePath);
  if (!resolvedPath) throw new Error('Invalid or disallowed path');
  try {
    let content = readFileSync(resolvedPath, 'utf8');
    content = sliceFileContentForAcp(content, line, limit);
    return { content };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return { content: '' };
    throw e;
  }
}

export function acpWriteTextFileInProcess(ctx: AcpSessionContext, filePath: string, newText: string): Record<string, never> {
  const resolvedPath = resolveSafePathUnderCwd(ctx.cwd, filePath);
  if (!resolvedPath) throw new Error('Invalid or disallowed path');
  let oldText = '';
  try {
    oldText = readFileSync(resolvedPath, 'utf8');
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  }
  mkdirSync(dirname(resolvedPath), { recursive: true });
  writeFileSync(resolvedPath, newText, 'utf8');
  const displayPath = toDisplayPathRelativeToCwd(ctx.cwd, resolvedPath);
  const patchContent = editSnippetToUnifiedDiff({ path: displayPath, oldText, newText });
  ctx.onFileChange?.({ path: displayPath, oldText, newText, patchContent });
  return {};
}
