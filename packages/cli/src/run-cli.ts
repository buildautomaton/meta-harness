import { coreSet, MCP_DEFAULT_HOST, runRuntime, type RuntimeOptions } from '@buildautomaton/agent-runtime';
import type { ParsedCli } from './parse-cli.js';
import { createLog, writeInfo } from './log.js';
import { CLI_VERSION } from './version.js';

export function formatCliStartup(parsed: ParsedCli): string {
  const remote = parsed.remoteUrl ? ` remoteUrl=${parsed.remoteUrl}` : '';
  const mcp =
    parsed.transport === 'mcp'
      ? ` url=http://${MCP_DEFAULT_HOST}:${parsed.mcpPort}${parsed.mcpPath}`
      : '';
  return `[CLI] Starting meta-harness ${CLI_VERSION} transport=${parsed.transport} cwd=${parsed.cwd} backend=${parsed.backend}${mcp}${remote}`;
}

export function runtimeOptionsFromCli(parsed: ParsedCli): RuntimeOptions {
  const log = createLog(parsed.verbose);
  return {
    cwd: parsed.cwd,
    log,
    plugins: coreSet({
      options: {
        cwd: parsed.cwd,
        sessionsDir: parsed.sessionsDir,
        backend: parsed.backend,
        transport: parsed.transport,
        remoteUrl: parsed.remoteUrl,
        mcpPort: parsed.mcpPort,
        mcpPath: parsed.mcpPath,
      },
      runtime: { cwd: parsed.cwd, log },
    }),
  };
}

export async function runCli(parsed: ParsedCli): Promise<void> {
  if (parsed.transport === 'remote' && !parsed.remoteUrl) {
    console.error('Missing --remote-url for --transport remote.');
    process.exit(1);
  }
  writeInfo(formatCliStartup(parsed));
  await runRuntime(runtimeOptionsFromCli(parsed));
}
