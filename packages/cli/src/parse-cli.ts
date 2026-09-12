import type { SessionBackendKind, TransportKind } from '@buildautomaton/agent-runtime';
import { CLI_VERSION } from './version.js';

export type ParsedCli = {
  cwd: string;
  sessionsDir?: string;
  backend: SessionBackendKind;
  transport: TransportKind;
  remoteUrl?: string;
  verbose: boolean;
};

export function parseCli(argv: string[]): ParsedCli {
  const args = argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  if (args.includes('--version') || args.includes('-v')) {
    process.stdout.write(`${CLI_VERSION}\n`);
    process.exit(0);
  }
  const flags = readFlags(args);
  const backend = flags.backend === 'stream' ? 'stream' : 'disk';
  const transport = flags.transport === 'remote' ? 'remote' : 'mcp';
  return {
    cwd: strFlag(flags.cwd) ?? process.cwd(),
    sessionsDir: strFlag(flags['sessions-dir']),
    backend,
    transport,
    remoteUrl: strFlag(flags['remote-url']),
    verbose: flags.verbose === true,
  };
}

function printHelp(): void {
  process.stdout.write(`meta-harness ${CLI_VERSION}
Launch a local MCP server (launch_subagent, get_session) or register remotely.

  --cwd <path>            Working directory for launched subagents
  --sessions-dir <path>   Disk session directory
  --backend <disk|stream> Session store (default: disk)
  --transport <mcp|remote>
  --remote-url <url>      Control-plane URL when --transport remote
  --verbose
`);
}

function strFlag(value: string | true | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function readFlags(args: string[]): Record<string, string | true> {
  const out: Record<string, string | true> = {};
  for (let i = 0; i < args.length; i++) {
    const token = args[i]!;
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}
