import type { ToolRegistry } from '../../types/tools/implementation.js';

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
    callTool: async (name, args) => {
      for (const reg of registries) {
        const listed = await reg.listTools();
        if (listed.some((t) => t.name === name)) return reg.callTool(name, args);
      }
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
        isError: true,
      };
    },
  };
}
