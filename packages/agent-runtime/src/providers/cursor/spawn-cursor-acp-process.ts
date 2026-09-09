import { spawn, type ChildProcess } from 'node:child_process';
import { installedAgentAuthProcessEnv } from '../../clients/installed-agent-auth-env.js';
import { createStderrCapture } from '../../clients/agent-stderr-capture.js';
import type { AcpClientOptions } from '../../clients/acp-client.js';

export type CursorAcpChild = ChildProcess & {
  stdin: NodeJS.WritableStream;
  stdout: NodeJS.ReadableStream;
  stderr: NodeJS.ReadableStream;
};

export function spawnCursorAcpProcess(options: {
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
  }) as CursorAcpChild;

  const stderrCapture = createStderrCapture(child);
  child.stderr?.on('data', (chunk: Buffer) => stderrCapture.append(chunk));
  child.once('close', (code, signal) => {
    options.onAgentSubprocessExit?.({ code, signal });
  });

  return { child, stderrCapture };
}
