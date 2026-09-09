import { spawn, type ChildProcess } from 'node:child_process';
import { installedAgentAuthProcessEnv } from '../installed-agent-auth-env.js';
import { createStderrCapture } from '../agent-stderr-capture.js';
import type { AcpClientOptions } from '../acp-client.js';

export type SdkStdioChild = ChildProcess & {
  stdin: NodeJS.WritableStream;
  stdout: NodeJS.ReadableStream;
  stderr: NodeJS.ReadableStream;
};

export function spawnSdkStdioProcess(options: {
  command: string[];
  cwd: string;
  onAgentSubprocessExit?: AcpClientOptions['onAgentSubprocessExit'];
}) {
  const isWindows = process.platform === 'win32';
  const child = spawn(options.command[0], options.command.slice(1), {
    cwd: options.cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: installedAgentAuthProcessEnv(process.env),
    shell: isWindows,
  }) as SdkStdioChild;

  const stderrCapture = createStderrCapture(child);
  child.once('close', (code, signal) => {
    options.onAgentSubprocessExit?.({ code, signal });
  });

  return { child, stderrCapture };
}
