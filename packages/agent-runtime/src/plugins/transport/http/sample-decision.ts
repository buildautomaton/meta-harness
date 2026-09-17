import type { MinionAsk } from '@/types/notify.js';

const ASK_USER = /\bask-user\b|\bask_user\b|\bask the (user|human)\b/;
const REJECT = /\breject\b|\bdeny\b/;
const ALLOW_ALL = /allow-all|allow_always|allow-always/;
const ALLOW_ONCE = /allow-once|allow_once|\ballow\b/;

export function decisionFromSample(result: unknown): unknown | undefined {
  const text = sampleText(result);
  if (!text) return undefined;
  const token = text.toLowerCase();
  if (ASK_USER.test(token)) return undefined;
  if (REJECT.test(token)) return { action: 'decline' };
  if (ALLOW_ALL.test(token)) return { action: 'accept', content: { optionId: 'allow-all' } };
  if (ALLOW_ONCE.test(token)) return { action: 'accept', content: { optionId: 'allow-once' } };
  return undefined;
}

export function samplingParams(ask: MinionAsk): Record<string, unknown> {
  const options = (ask.options ?? []).map((opt) => opt.label).join(', ');
  return {
    maxTokens: 80,
    systemPrompt:
      'You are the coordinating agent. Apply your current permission mode from this session. Reply with JSON {"decision":"allow-once"|"allow-all"|"reject"|"ask-user"}.',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `${ask.title}: ${ask.message}${options ? ` Options: ${options}` : ''}`,
        },
      },
    ],
  };
}

function sampleText(result: unknown): string {
  if (typeof result === 'string') return result;
  const rec = asRecord(result);
  if (!rec) return '';
  const content = rec.content;
  if (typeof content === 'string') return content;
  const nested = asRecord(content);
  if (typeof nested?.text === 'string') return nested.text;
  if (Array.isArray(content)) {
    return content.map((part) => asRecord(part)?.text).filter((text) => typeof text === 'string').join('');
  }
  return typeof rec.text === 'string' ? rec.text : '';
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}
