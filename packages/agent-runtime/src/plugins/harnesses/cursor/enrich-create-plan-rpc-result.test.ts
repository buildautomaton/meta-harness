import * as fs from 'node:fs';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { enrichCreatePlanRpcResult } from './enrich-create-plan-rpc-result.js';
import { cleanupSessionPlans } from './cleanup-session-plans.js';
import { getSessionPlansDir } from '../../../runtime/core/util/session-plans-paths.js';

const SESSION = `plan-test-${Date.now()}`;

afterEach(() => {
  cleanupSessionPlans(SESSION);
});

describe('enrichCreatePlanRpcResult', () => {
  it('writes planUri when accepted with plan markdown', () => {
    const result = enrichCreatePlanRpcResult(
      { outcome: { outcome: 'accepted', plan: '# Edited\n' } },
      { toolCallId: 'call_1' },
      SESSION,
    );
    const outcome = (result as { outcome: { outcome: string; planUri?: string } }).outcome;
    expect(outcome.outcome).toBe('accepted');
    expect(outcome.planUri?.startsWith('file://')).toBe(true);
    const dir = getSessionPlansDir(SESSION);
    expect(fs.existsSync(dir)).toBe(true);
    const files = fs.readdirSync(dir);
    expect(files.some((f) => f.endsWith('.md'))).toBe(true);
  });

  it('accepts without planUri when plan was not edited', () => {
    const result = enrichCreatePlanRpcResult(
      { outcome: { outcome: 'accepted' } },
      { toolCallId: 'call_1' },
      SESSION,
    );
    expect(result).toEqual({ outcome: { outcome: 'accepted' } });
  });

  it('writes planUri from pending params when accept omits plan markdown', () => {
    const result = enrichCreatePlanRpcResult(
      { outcome: { outcome: 'accepted' } },
      { toolCallId: 'call_2', plan: '# Original\n' },
      SESSION,
    );
    const outcome = (result as { outcome: { outcome: string; planUri?: string } }).outcome;
    expect(outcome.outcome).toBe('accepted');
    expect(outcome.planUri?.startsWith('file://')).toBe(true);
  });
});

describe('cleanupSessionPlans', () => {
  it('removes the session plans directory', () => {
    const dir = getSessionPlansDir(SESSION);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'x.md'), 'hi', 'utf8');
    cleanupSessionPlans(SESSION);
    expect(fs.existsSync(dir)).toBe(false);
  });
});
