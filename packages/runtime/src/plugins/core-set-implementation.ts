import type { HarnessImplementation } from '@/types/harness/implementation.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { RemoteTransportImplementation } from '@/types/transport/options.js';
import type { ToolsImplementation } from '@/types/tools/implementation.js';
import type { FileStore } from '@/types/file-store/implementation.js';
import type { SqlStore } from '@/types/sql-store/implementation.js';

export type CoreSetImplementation = {
  harness?: Partial<HarnessImplementation>;
  session?: Partial<SessionImplementation>;
  transport?: RemoteTransportImplementation;
  tools?: Partial<ToolsImplementation>;
  fileStore?: Partial<FileStore>;
  sqlStore?: Partial<SqlStore>;
};
