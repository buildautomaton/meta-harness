import type { ServerResponse } from 'node:http';

export function writeSseMessage(res: ServerResponse, payload: unknown): void {
  res.write(`event: message\ndata: ${JSON.stringify(payload)}\n\n`);
}

export function writeSseComment(res: ServerResponse, comment: string): void {
  res.write(`: ${comment}\n\n`);
}
