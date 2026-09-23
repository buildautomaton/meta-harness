const KICKERS: Record<string, string> = {
  summary: 'Summary',
  'changes-overview': 'Changes overview',
  api: 'API routes',
  'data-model': 'Data model',
  algorithm: 'Algorithm',
};

export function kickerForPath(path: string): string {
  const base = path.replace(/\.(html|md|json)$/i, '').split(/[/\\]/).pop() ?? path;
  return KICKERS[base] ?? base.replace(/[-_]/g, ' ');
}
