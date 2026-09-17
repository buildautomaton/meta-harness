import {
  HTTP_DEFAULT_PORT,
  MCP_DEFAULT_PATH,
  normalizeHttpPath,
  type SessionBackendKind,
  type TransportKind,
} from '@buildautomaton/agent-runtime';
import { CLI_VERSION } from './version.js';

export type ParsedCli = {
  cwd: string;
  sessionsDir?: string;
  backend: SessionBackendKind;
  transport: TransportKind;
  remoteUrl?: string;
  mcpPort: number;
  mcpPath: string;
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
  return {
    cwd: strFlag(flags.cwd) ?? process.cwd(),
    sessionsDir: strFlag(flags['sessions-dir']),
    backend,
    transport: parseTransport(flags.transport),
    remoteUrl: strFlag(flags['remote-url']),
    mcpPort: parsePort(flags.port),
    mcpPath: normalizeHttpPath(strFlag(flags['mcp-path']) ?? MCP_DEFAULT_PATH),
    verbose: flags.verbose === true,
  };
}

function parseTransport(value: string | true | undefined): TransportKind {
  if (value === 'remote') return 'remote';
  if (value === 'stdio') return 'stdio';
  return 'http';
}

function printHelp(): void {
  process.stdout.write(`local-cli ${CLI_VERSION}
Launch a local HTTP server (MCP tools + work API) or MCP over stdio, or register remotely.

  --cwd <path>            Working directory for spawned minions
  --sessions-dir <path>   Disk session directory
  --backend <disk|stream> Session store (default: disk)
  --transport <http|stdio|remote>
  --port <n>              HTTP port (default: ${HTTP_DEFAULT_PORT})
  --mcp-path <path>       MCP tools URL path (default: ${MCP_DEFAULT_PATH})
  --remote-url <url>      Control-plane URL when --transport remote
  --verbose
`);
}

function parsePort(value: string | true | undefined): number {
  if (value === undefined) return HTTP_DEFAULT_PORT;
  const n = typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    console.error('Invalid --port (expected an integer 1-65535).');
    process.exit(1);
  }
  return n;
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
