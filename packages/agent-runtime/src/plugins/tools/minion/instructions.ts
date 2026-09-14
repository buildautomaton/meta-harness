/** Injected into MCP clients when a tools plugin provides `instructions()`. */
export const MINION_INSTRUCTIONS = `You have Meta Harness minion tools. They replace Cursor's builtin Task/subagent/explore tools.

When you would call Task or launch a subagent, call spawn_minion instead. spawn_minion waits until the worker finishes and streams progress on that same tool call — same shape as Task, but it uses this workspace and harness. NEVER use Task, subagent, explore, or launch-agent while this server is connected.

Workflow:
1. get_minion_context once if you need harness ids (cursor-cli, claude-code, …).
2. spawn_minion with harness + a complete prompt. It blocks and returns the agent message transcript.
3. For several minions in parallel, call spawn_minion multiple times in one turn (each call waits on its own).
4. If a call returns needsUser, ask the human, resolve_minion_request, then await_minion (also blocking with live progress). Do not poll get_minion in a loop.
5. Read messages via the returned transcript or get_minion_transcript — never by opening session JSON/JSONL files.`;

export const MINION_PROMPT_NAME = 'coordinate-with-minions';

export const MINION_PROMPT = {
  name: MINION_PROMPT_NAME,
  title: 'Coordinate with minions (not Task/subagents)',
  description: 'Use spawn_minion instead of Task. It waits for the minion and streams progress.',
  text: MINION_INSTRUCTIONS,
};
