import { describe, expect, it, vi } from 'vitest';
import { dispatchAcpSessionUpdate } from './dispatch-session-update.js';

describe('dispatchAcpSessionUpdate', () => {
  it('persists available_commands_update without forwarding (like config_option_update)', () => {
    const onSessionUpdate = vi.fn();
    const onAcpAvailableCommandsUpdated = vi.fn();
    const cmds = [{ name: 'web', description: 'Search' }];
    dispatchAcpSessionUpdate({
      flatPayload: { sessionUpdate: 'available_commands_update', availableCommands: cmds },
      onAcpAvailableCommandsUpdated,
      onSessionUpdate,
      suppressLoadReplay: () => false,
    });
    expect(onAcpAvailableCommandsUpdated).toHaveBeenCalledWith(cmds);
    expect(onSessionUpdate).not.toHaveBeenCalled();
  });

  it('still suppresses ordinary updates during load replay', () => {
    const onSessionUpdate = vi.fn();
    dispatchAcpSessionUpdate({
      flatPayload: { sessionUpdate: 'agent_message_chunk', content: { text: 'hi' } },
      onSessionUpdate,
      suppressLoadReplay: () => true,
    });
    expect(onSessionUpdate).not.toHaveBeenCalled();
  });
});
