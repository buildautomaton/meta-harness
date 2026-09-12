import { describe, expect, it } from 'vitest';
import { enrichAcpPermissionRpcResultFromRequestParams } from './enrich-acp-permission-rpc-result.js';

describe('enrichAcpPermissionRpcResultFromRequestParams', () => {
  it('adds _meta.permissionOptionKind from request options by optionId', () => {
    const result = {
      outcome: { outcome: 'selected' as const, optionId: 'opt-a' },
    };
    const params = {
      options: [
        { optionId: 'opt-a', name: 'Allow once', kind: 'allow_once' },
        { optionId: 'opt-b', name: 'Allow always', kind: 'allow_always' },
      ],
    };
    const out = enrichAcpPermissionRpcResultFromRequestParams(result, params) as {
      outcome: { optionId: string; _meta?: { permissionOptionKind?: string } };
    };
    expect(out.outcome._meta?.permissionOptionKind).toBe('allow_once');
  });

  it('matches numeric option ids in params', () => {
    const result = { outcome: { outcome: 'selected' as const, optionId: '2' } };
    const params = { options: [{ optionId: 2, name: 'Always', kind: 'allow_always' }] };
    const out = enrichAcpPermissionRpcResultFromRequestParams(result, params) as {
      outcome: { _meta?: { permissionOptionKind?: string } };
    };
    expect(out.outcome._meta?.permissionOptionKind).toBe('allow_always');
  });

  it('does not override when _meta.permissionOptionKind is already set', () => {
    const result = {
      outcome: {
        outcome: 'selected' as const,
        optionId: 'opt-a',
        _meta: { permissionOptionKind: 'allow_always' },
      },
    };
    const params = {
      options: [{ optionId: 'opt-a', name: 'Allow once', kind: 'allow_once' }],
    };
    const out = enrichAcpPermissionRpcResultFromRequestParams(result, params) as {
      outcome: { _meta?: { permissionOptionKind?: string } };
    };
    expect(out.outcome._meta?.permissionOptionKind).toBe('allow_always');
  });

  it('matches option id from id alias on option object', () => {
    const result = { outcome: { outcome: 'selected' as const, optionId: 'x1' } };
    const params = { options: [{ id: 'x1', name: 'Allow always', kind: 'allow_always' }] };
    const out = enrichAcpPermissionRpcResultFromRequestParams(result, params) as {
      outcome: { _meta?: { permissionOptionKind?: string } };
    };
    expect(out.outcome._meta?.permissionOptionKind).toBe('allow_always');
  });
});
