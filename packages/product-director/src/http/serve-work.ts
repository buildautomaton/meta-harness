import * as http from 'node:http';
import {
  createHttpRegistry,
  createMcpSseHub,
  handleHttpRequest,
} from '@buildautomaton/agent-runtime';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { contributeWorkHttp } from '../plugins/work/http/contribute.js';

export function serveWork(work: WorkImplementation) {
  const registry = createHttpRegistry();
  contributeWorkHttp(registry, {
    cwd: '/tmp',
    log: () => {},
    extras: { work },
    pluginName: 'work',
  });
  const sse = createMcpSseHub();
  const server = http.createServer((req, res) => {
    void handleHttpRequest(req, res, {
      path: '/mcp',
      routes: registry.routes(),
      tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
      initialized: { value: false },
      log: () => {},
      sse,
    });
  });
  return { server, sse };
}
