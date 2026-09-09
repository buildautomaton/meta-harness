# Meta Harness agent guidelines

## File size

Keep source files under **100 lines** across all packages in this monorepo.

When a module grows beyond that:

1. Split by responsibility (one function, one handler, or one type group per file).
2. Add a thin compose file that wires methods together.
3. Share mappers and types in small sibling files.

This applies to libraries, CLIs, and utilities unless a generated file is intentionally excluded.
