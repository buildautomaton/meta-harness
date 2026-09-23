# Custom plugins

You can add your own plugins beside the built-in ones. The runtime only needs to know the kind; your plugin owns the behavior.

A tiny tools plugin that answers `ping`:

```ts
const ping: RuntimePlugin = {
  name: 'my-tools',
  kind: 'tools',
  implementation: {
    listTools: () => [{ name: 'ping', description: 'Health check', inputSchema: { type: 'object' } }],
    callTool: async (name) => ({
      content: [{ type: 'text', text: name === 'ping' ? 'ok' : 'unknown' }],
    }),
  },
};
```

You can also wrap a built-in and add hooks:

```ts
cursorHarnessPlugin({ hooks: { onSessionUpdate: console.error } })
```

Packages can introduce new kinds (for example `work` and `artifact` in product-director). The runtime still indexes them; only the plugin that uses the kind needs to know its shape.

The handle gives you `start`, `stop`, and `engine`. `start` opens the connection; it does not send prompts by itself.
