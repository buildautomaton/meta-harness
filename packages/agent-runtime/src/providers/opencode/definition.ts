import type { AgentProvider } from '../types.js';
import { opencodeInstall } from './install.js';

/** Installable; ACP client is not wired yet. */
export const opencodeProvider: AgentProvider = {
  type: 'opencode',
  displayName: 'OpenCode',
  defaultCommand: [],
  authErrorHints: [],
  install: opencodeInstall,
  buildSpawnCommand: (base) => [...base],
};
