import type { Server } from 'node:http';

export function listenLocalhost(server: Server, port: number, host: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const onError = (err: Error) => reject(err);
    server.once('error', onError);
    server.listen(port, host, () => {
      server.off('error', onError);
      const addr = server.address();
      if (addr && typeof addr === 'object') resolve(addr.port);
      else reject(new Error('MCP HTTP server failed to bind'));
    });
  });
}

export function waitForClose(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.once('close', () => resolve());
  });
}

export function closeServer(server: Server | undefined): Promise<void> {
  if (!server) return Promise.resolve();
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}
