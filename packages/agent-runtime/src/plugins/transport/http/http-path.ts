export const HTTP_DEFAULT_HOST = '127.0.0.1';
export const HTTP_DEFAULT_PORT = 3333;
export const MCP_DEFAULT_PATH = '/mcp';
export const HTTP_DEFAULT_WORK_ROOT = '/api';

export function normalizeHttpPath(path: string): string {
  const trimmed = path.trim() || MCP_DEFAULT_PATH;
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}

export function httpListenUrl(host: string, port: number, path: string): string {
  return `http://${host}:${port}${path}`;
}
