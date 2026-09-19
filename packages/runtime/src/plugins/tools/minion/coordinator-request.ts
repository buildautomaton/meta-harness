import type { MinionAsk, MinionPendingRequest } from '@/types/notify.js';
import { AUTH_OPTIONS, permissionOptionsFromParams, type PermissionOptionView } from './permission-label.js';

const TITLES = {
  permission: 'Permission needed',
  auth: 'Authentication needed',
  question: 'Input needed',
} as const;

export function coordinatorRequest(
  minionId: string,
  requestId: string,
  kind: MinionPendingRequest['kind'],
  summary: string,
  params: Record<string, unknown>,
  method: string,
): MinionAsk {
  const options =
    kind === 'auth' && permissionOptionsFromParams(params).length === 0
      ? AUTH_OPTIONS
      : permissionOptionsFromParams(params);
  const title = TITLES[kind];
  const message = summary.trim() || title;
  return { minionId, requestId, kind, method, title, message, options };
}

export function coordinatorNotice(req: Pick<MinionAsk, 'title' | 'message' | 'options'>): string {
  const options = (req.options ?? []).map((opt) => opt.label).join(', ');
  const base = `${req.title}: ${req.message}`;
  return options ? `${base} Options: ${options}` : base;
}

export function authCoordinatorRequest(minionId: string, harness: string): MinionAsk {
  return coordinatorRequest(
    minionId,
    `auth:${minionId}`,
    'auth',
    `${harness} needs a provider login or API token`,
    {},
    'auth',
  );
}

export type { PermissionOptionView };
