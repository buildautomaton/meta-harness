import type { ToolRegistry } from '@/types/tools/implementation.js';
import type { ToolsPrompt } from '@/types/tools/prompts.js';

export function mergeToolRegistries(registries: ToolRegistry[]): ToolRegistry {
  return {
    listTools: async () => {
      const tools = [];
      const seen = new Set<string>();
      for (const reg of registries) {
        for (const tool of await reg.listTools()) {
          if (seen.has(tool.name)) continue;
          seen.add(tool.name);
          tools.push(tool);
        }
      }
      return tools;
    },
    callTool: async (name, args, extras) => {
      for (const reg of registries) {
        const listed = await reg.listTools();
        if (listed.some((t) => t.name === name)) return reg.callTool(name, args, extras);
      }
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
        isError: true,
      };
    },
    instructions: async () => mergeInstructions(registries),
    prompts: async () => mergePrompts(registries),
  };
}

async function mergeInstructions(registries: ToolRegistry[]): Promise<string | undefined> {
  const parts: string[] = [];
  for (const reg of registries) {
    const text = (await reg.instructions?.())?.trim();
    if (text) parts.push(text);
  }
  return parts.length ? parts.join('\n\n') : undefined;
}

async function mergePrompts(registries: ToolRegistry[]): Promise<ToolsPrompt[]> {
  const out: ToolsPrompt[] = [];
  const seen = new Set<string>();
  for (const reg of registries) {
    for (const prompt of (await reg.prompts?.()) ?? []) {
      if (seen.has(prompt.name)) continue;
      seen.add(prompt.name);
      out.push(prompt);
    }
  }
  return out;
}
