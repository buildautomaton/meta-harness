import { createHash } from 'node:crypto';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

export function wsAcceptKey(key: string): string {
  return createHash('sha1').update(key + GUID).digest('base64');
}
