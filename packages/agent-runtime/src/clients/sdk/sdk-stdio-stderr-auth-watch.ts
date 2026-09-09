import { localAgentErrorSuggestsAuth } from '../../auth/local-agent-auth.js';
import { createStderrCapture } from '../agent-stderr-capture.js';
import type { SdkStdioChild } from './spawn-sdk-stdio-process.js';
import type { createSdkStdioInitSettle } from './sdk-stdio-init-settle.js';

export function attachSdkStdioStderrAuthWatch(options: {
  child: SdkStdioChild;
  stderrCapture: ReturnType<typeof createStderrCapture>;
  backendAgentType?: string | null;
  init: ReturnType<typeof createSdkStdioInitSettle>;
  reject: (err: Error) => void;
}): void {
  options.child.stderr?.on('data', (chunk: Buffer) => {
    options.stderrCapture.append(chunk);
    if (options.init.settled) return;
    const stderrText = options.stderrCapture.getText();
    if (
      options.backendAgentType &&
      stderrText.trim() &&
      localAgentErrorSuggestsAuth(options.backendAgentType, stderrText)
    ) {
      options.init.settleReject(options.reject, new Error(stderrText.trim()));
    }
  });
}
