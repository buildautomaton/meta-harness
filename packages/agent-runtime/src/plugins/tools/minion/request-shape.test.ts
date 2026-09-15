import { describe, expect, it } from 'vitest';
import { minionRequestKind, requestOptions, summarizeMinionRequest, unwrapAgentRequest } from './request-shape.js';

describe('unwrapAgentRequest', () => {
  it('reads nested ACP request payloads', () => {
    const rec = unwrapAgentRequest({
      requestId: 'r1',
      kind: 'permission',
      payload: {
        method: 'session/request_permission',
        params: {
          toolCall: { title: 'npm test' },
          options: [{ optionId: 'allow-once', name: 'Allow once' }],
        },
      },
    });
    expect(rec).toMatchObject({
      requestId: 'r1',
      method: 'session/request_permission',
      kind: 'permission',
    });
    expect(summarizeMinionRequest(rec.method, rec.params)).toBe('npm test');
    expect(requestOptions(rec.params)).toEqual([{ optionId: 'allow-once', label: 'Allow once' }]);
    expect(minionRequestKind(rec.kind, rec.method)).toBe('permission');
    expect(unwrapAgentRequest({ requestId: 7, payload: { method: 'session/request_permission', params: {} } }).requestId).toBe(
      '7',
    );
  });
});
