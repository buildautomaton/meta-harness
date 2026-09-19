import type { IncomingMessage, ServerResponse } from 'node:http';

export type HttpHandlerContext = {
  pathname: string;
  mount: string;
};

export type HttpRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  ctx: HttpHandlerContext,
) => Promise<void> | void;

export type HttpRoute = {
  path: string;
  handler: HttpRequestHandler;
};

export type HttpWebSocket = {
  path: string;
  subscribe?: (broadcast: (payload: unknown) => void) => () => void;
  onMessage?: (payload: unknown) => void | Promise<void>;
};

export type HttpRegistry = {
  addRoute(route: HttpRoute): void;
  addWebSocket(ws: HttpWebSocket): void;
  routes(): readonly HttpRoute[];
  websockets(): readonly HttpWebSocket[];
};
