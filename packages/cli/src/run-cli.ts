import { coreSet, runRuntime, type RuntimeOptions } from '@buildautomaton/agent-runtime';
import type { ParsedCli } from './parse-cli.js';
import { createLog } from './log.js';

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
  await runRuntime(runtimeOptionsFromCli(parsed));
}
