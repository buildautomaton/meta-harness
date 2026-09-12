#!/usr/bin/env node
import { parseCli } from './parse-cli.js';
import { runCli } from './run-cli.js';

async function main(argv = process.argv): Promise<void> {
  await runCli(parseCli(argv));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
