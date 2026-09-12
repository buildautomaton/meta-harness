/** Config data for a harness plugin (not methods). */
export type HarnessOptions = {
  type: string;
  displayName: string;
  defaultCommand: readonly string[];
  authErrorHints: readonly RegExp[];
  installDetectCommand?: string;
  installAlternateDetectCommands?: readonly string[];
  installTokenEnvVar?: string;
};
