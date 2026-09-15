/** Injected into MCP clients when a tools plugin provides `instructions()`. */
export const MINION_INSTRUCTIONS = `You have Meta Harness minion tools. They replace Cursor's builtin Task/subagent/explore tools.

When you would call Task or launch a subagent, call spawn_minion instead. spawn_minion ALWAYS waits on that tool call until the worker finishes and streams progress on the same call. There is no background mode. NEVER pass background, is_background, or run_in_background. NEVER use Task, subagent, explore, or launch-agent while this server is connected.

Workflow:
1. get_minion_context once if you need harness ids (cursor-cli, claude-code, …).
2. spawn_minion with only harness + a complete prompt (optional model). It stays in-flight until the minion finishes.
3. For several minions in parallel, call spawn_minion multiple times in one turn (each call waits on its own).
4. Permission/auth requests arrive as MCP notifications and elicitation WHILE spawn_minion is still running. Do not wait for other minions to finish. Apply your current permission mode — the same mode that governs your own tools in this session.
   - If that mode would auto-run the action, call resolve_minion_request immediately. Do not ask the human.
   - If that mode would ask the user, leave it for them (elicitation) or ask them the same way you would for your own tools.
5. spawn_minion keeps waiting after you resolve. Use await_minion only if a spawn already returned. Do not poll get_minion.
6. Read messages via the returned transcript or get_minion_transcript — never by opening session JSON/JSONL files.`;

export const MINION_PROMPT_NAME = 'coordinate-with-minions';

export const MINION_PROMPT = {
  name: MINION_PROMPT_NAME,
  title: 'Coordinate with minions (not Task/subagents)',
  description: 'Use spawn_minion instead of Task. It waits until the minion finishes. Never pass background.',
  text: MINION_INSTRUCTIONS,
};
