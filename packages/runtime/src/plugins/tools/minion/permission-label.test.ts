import { describe, expect, it } from 'vitest';
import { humanizeOptionLabel, permissionOptionsFromParams } from './permission-label.js';
import { permissionResultFromDecision } from './permission-result.js';
import { coordinatorNotice, coordinatorRequest } from './coordinator-request.js';

describe('permission labels', () => {
  it('humanizes slugs and keeps agent-provided names', () => {
    expect(humanizeOptionLabel('allow-always')).toBe('Allow all');
    expect(humanizeOptionLabel('allow-all')).toBe('Allow all');
    expect(humanizeOptionLabel('allow-once')).toBe('Allow once');
    expect(humanizeOptionLabel('reject')).toBe('Reject');
    expect(humanizeOptionLabel('allow-always', 'allow_always', 'Allow always')).toBe('Allow always');
  });

  it('uses the options the minion offered', () => {
    const options = permissionOptionsFromParams({
      options: [
        { optionId: 'allow-once' },
        { optionId: 'allow-always', kind: 'allow_always' },
        { optionId: 'reject' },
      ],
    });
    expect(options).toEqual([
      { optionId: 'allow-once', label: 'Allow once' },
      { optionId: 'allow-always', label: 'Allow all' },
      { optionId: 'reject', label: 'Reject' },
    ]);
    const ask = coordinatorRequest('m1', 'r1', 'permission', 'ls', { options }, 'session/request_permission');
    expect(coordinatorNotice(ask)).toBe('Permission needed: ls Options: Allow once, Allow all, Reject');
  });

  it('maps human-readable choices back to the minion optionId', () => {
    const params = {
      options: [
        { optionId: 'allow-once' },
        { optionId: 'allow-always' },
        { optionId: 'reject' },
      ],
    };
    expect(permissionResultFromDecision({ outcome: 'Allow all' }, params)).toEqual({
      outcome: { outcome: 'selected', optionId: 'allow-always' },
    });
    expect(permissionResultFromDecision({ outcome: 'Reject' }, params)).toEqual({
      outcome: { outcome: 'denied' },
    });
  });
});
