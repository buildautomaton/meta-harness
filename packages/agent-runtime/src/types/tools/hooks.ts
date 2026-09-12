import type { LaunchAgentParams } from '../session/records.js';

export type PermissionRequest = {
  requestId: string;
  method: string;
  params: Record<string, unknown>;
};

/** Notifications a tools plugin may send to the host. */
export type ToolsHooks = {
  prepareLaunch?: (params: LaunchAgentParams) => Promise<LaunchAgentParams> | LaunchAgentParams;
  resolvePermission?: (request: PermissionRequest) => Promise<unknown> | unknown;
};
