import type { HarnessImplementation } from '../types/harness/implementation.js';
import type { SessionImplementation } from '../types/session/implementation.js';
import type { RemoteTransportImplementation } from '../types/transport/options.js';
import type { ToolsImplementation } from '../types/tools/implementation.js';

export type CoreSetImplementation = {
  harness?: Partial<HarnessImplementation>;
  session?: Partial<SessionImplementation>;
  transport?: RemoteTransportImplementation;
  tools?: Partial<ToolsImplementation>;
};
