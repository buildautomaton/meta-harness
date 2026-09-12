import type { TransportImplementation } from '../../types/transport/implementation.js';

export type HostTransport = { id: string } & TransportImplementation;
