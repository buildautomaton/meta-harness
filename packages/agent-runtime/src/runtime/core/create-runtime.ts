import { applyPlugins } from './plugin-apply.js';
import { mergeToolRegistries } from '../tools/merge-registries.js';
import type { ToolContext, ToolRegistry, ToolsImplementation } from '../../types/tools/implementation.js';
import type { SessionBackend, SessionBackendWrap } from '../session/types.js';
import { bindHandle } from './bind-handle.js';
import { createRuntimeManager } from './create-manager.js';
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
      callTool: (name, args) => impl.callTool(name, args, ctx),
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
  const manager = await createRuntimeManager({
    log,
    backend,
    harnessHooks: slots.harnessHooks,
    harnessHost: slots.harnessHost,
    isShutdownRequested: options.isShutdownRequested,
  });
  for (const harness of slots.harnesses) manager.registerHarness(harness);
  const tools = toolsFrom(slots.tools, {
    cwd: options.cwd,
    manager,
    backend,
    sessionHooks: slots.sessionHooks,
    toolsHooks: slots.toolsHooks,
  });
  return bindHandle({
    cwd: options.cwd,
    manager,
    transport: slots.transport,
    tools,
    transportHooks: slots.transportHooks,
  });
}
