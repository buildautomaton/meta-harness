import type { SessionImplementation } from '../../types/session/implementation.js';

export type SessionBackend = { id: string } & SessionImplementation;
export type SessionBackendWrap = (base: SessionBackend) => SessionBackend;
