import { createRuntime } from './create-runtime.js';
import type { RuntimeOptions } from './runtime-types.js';

export async function runRuntime(options: RuntimeOptions): Promise<void> {
  const handle = await createRuntime(options);
  const onStop = () => {
    void handle.stop().then(() => process.exit(0));
  };
  process.on('SIGINT', onStop);
  process.on('SIGTERM', onStop);
  await handle.start();
}
