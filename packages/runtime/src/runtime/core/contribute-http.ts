import type { PluginSlots } from './plugin-slots.js';
import type { LogFn } from '@/types/log.js';
import type { SessionImplementation } from '@/types/session/implementation.js';

export function contributeHttp(
  slots: PluginSlots,
  ctx: { cwd: string; log: LogFn; backend?: SessionImplementation },
): void {
  const http = slots.http;
  if (!http) return;
  for (const plugin of slots.plugins) {
    if (!plugin.contributeHttp) continue;
    const mount = endpointFor(slots, plugin.name);
    plugin.contributeHttp(http, {
      cwd: ctx.cwd,
      log: ctx.log,
      extras: slots.extras,
      pluginName: plugin.name,
      backend: ctx.backend,
      ...mount,
    });
  }
}

function endpointFor(slots: PluginSlots, name: string) {
  const hit = slots.httpEndpoints.find((e) => e.plugin === name);
  return {
    mount: hit?.path ? normalizeMount(hit.path) : undefined,
    routes: hit?.routes,
  };
}

function normalizeMount(path: string): string {
  const trimmed = path.trim();
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}
