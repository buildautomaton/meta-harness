import type { MinionAsk } from '../../../types/notify.js';

export function elicitationParams(ask: MinionAsk): Record<string, unknown> {
  const message = notice(ask);
  if (ask.kind === 'permission' && ask.options?.length) {
    return schema(message, {
      optionId: {
        type: 'string',
        title: 'Decision',
        enum: ask.options.map((opt) => opt.optionId),
        description: ask.options.map((opt) => opt.label).join(', '),
      },
    }, ['optionId']);
  }
  if (ask.kind === 'auth') {
    return schema(message, {
      token: { type: 'string', title: 'API token', description: 'Provider API key if CLI login is not available.' },
      loggedIn: { type: 'boolean', title: 'Logged in', description: 'True if the user completed CLI login.' },
    });
  }
  return schema(message, {
    response: { type: 'string', title: 'Response' },
  }, ['response']);
}

function notice(ask: MinionAsk): string {
  const options = (ask.options ?? []).map((opt) => opt.label).join(', ');
  const base = `${ask.title}: ${ask.message}`;
  return options ? `${base} Options: ${options}` : base;
}

function schema(
  message: string,
  properties: Record<string, unknown>,
  required: string[] = [],
): Record<string, unknown> {
  return { message, requestedSchema: { type: 'object', properties, required } };
}
