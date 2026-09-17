export function encodeStdioMessage(json: string): Buffer {
  const body = Buffer.from(json, 'utf8');
  return Buffer.concat([Buffer.from(`Content-Length: ${body.length}\r\n\r\n`, 'utf8'), body]);
}

export function pullStdioMessage(buffer: Buffer): { message: string; rest: Buffer } | undefined {
  const headerEnd = buffer.indexOf('\r\n\r\n');
  if (headerEnd < 0) return undefined;
  const match = /^Content-Length:\s*(\d+)/i.exec(buffer.subarray(0, headerEnd).toString('utf8'));
  if (!match) return undefined;
  const length = Number(match[1]);
  const start = headerEnd + 4;
  if (buffer.length < start + length) return undefined;
  return {
    message: buffer.subarray(start, start + length).toString('utf8'),
    rest: buffer.subarray(start + length),
  };
}
