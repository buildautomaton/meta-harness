import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getSessionPlansDir } from '../../../runtime/core/util/session-plans-paths.js';

function sanitizePlanFileBase(toolCallId: string): string {
  const t = toolCallId.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 120);
  return t || 'plan';
}

/** Write edited plan markdown and return a file:// planUri for cursor/create_plan. */
export function writeCreatePlanFile(params: {
  acpSessionId: string;
  toolCallId: string;
  planMarkdown: string;
}): string {
  const dir = getSessionPlansDir(params.acpSessionId);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${sanitizePlanFileBase(params.toolCallId)}.md`);
  fs.writeFileSync(filePath, params.planMarkdown, 'utf8');
  return pathToFileURL(filePath).href;
}
