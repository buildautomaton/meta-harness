import type { HttpRegistry, HttpRoute, HttpWebSocket } from '@/types/http/registry.js';
import { normalizeHttpPath } from '@plugins/transport/http/http-path.js';

export function createHttpRegistry(): HttpRegistry {
  const routes: HttpRoute[] = [];
  const websockets: HttpWebSocket[] = [];
  return {
    addRoute(route) {
      routes.push({ ...route, path: normalizeHttpPath(route.path) });
    },
    addWebSocket(ws) {
      websockets.push({ ...ws, path: normalizeHttpPath(ws.path) });
    },
    routes: () => routes,
    websockets: () => websockets,
  };
}
