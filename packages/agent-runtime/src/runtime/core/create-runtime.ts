import { applyPlugins } from './plugin-apply.js';
import { mergeToolRegistries } from '@runtime/tools/merge-registries.js';
import type { ToolContext, ToolRegistry, ToolsImplementation } from '@/types/tools/implementation.js';
import type { SessionBackend, SessionBackendWrap } from '@runtime/session/types.js';
import { bindHandle } from './bind-handle.js';
import { buildClientHostHooks } from './build-client-host.js';
import { createAcpEngine } from '@runtime/acp/engine/create-acp-engine.js';
import { createNotifierHub } from '@runtime/notify/hub.js';
import { RUNTIME_VERSION } from './version.js';
import type { RuntimeHandle, RuntimeOptions } from './runtime-types.js';

function defaultLog(line: string): void {
  process.stderr.write(`${line}\n`);
}

function wrapBackend(base: SessionBackend, wraps: SessionBackendWrap[]): SessionBackend {
  return wraps.reduce((current, wrap) => wrap(current), base);
}

function toolsFrom(impls: ToolsImplementation[], ctx: ToolContext): ToolRegistry {
  return mergeToolRegistries(
    impls.map((impl) => ({
      listTools: () => impl.listTools(ctx),
      callTool: (name, args, extras) => impl.callTool(name, args, ctx, extras),
      instructions: impl.instructions ? () => impl.instructions!() : undefined,
      prompts: impl.prompts ? () => impl.prompts!() : undefined,
    })),
  );
}

/** Compose plugins into a runtime. Requires a session plugin and a transport plugin. */
export async function createRuntime(options: RuntimeOptions): Promise<RuntimeHandle> {
  const log = options.log ?? defaultLog;
  const slots = applyPlugins(options.plugins ?? [], { log, cwd: options.cwd });
  if (!slots.backend) throw new Error('createRuntime requires a session plugin');
  if (!slots.transport) throw new Error('createRuntime requires a transport plugin');
  const backend = wrapBackend(slots.backend, slots.backendWraps);
  const engine = await createAcpEngine({
    log,
    isShutdownRequested: options.isShutdownRequested,
    clientHostHooks: await buildClientHostHooks({
      backend,
      harnessHooks: slots.harnessHooks,
      harnessHost: slots.harnessHost,
    }),
    clientInfo: { name: 'meta-harness', version: RUNTIME_VERSION },
  });
  for (const harness of slots.harnesses) engine.registerHarness(harness);
  const notifier = createNotifierHub();
  const tools = toolsFrom(slots.tools, {
    cwd: options.cwd,
    engine,
    backend,
    sessionHooks: slots.sessionHooks,
    toolsHooks: slots.toolsHooks,
    notifier,
  });
  return bindHandle({
    cwd: options.cwd,
    engine,
    transport: slots.transport,
    tools,
    transportHooks: slots.transportHooks,
    notifier,
  });
}
