# HTTP

The HTTP plugin (`httpTransportPlugin`, `kind: 'http'`) starts **one** shared server. Other plugins mount routes and websockets onto it. This is separate from the `transport` kind (stdio / remote).

Default tools path is `/mcp`. Extra mounts come from `endpoints`:

```ts
httpTransportPlugin({
  options: {
    host: '127.0.0.1',
    port: 3333,
    endpoints: [
      { kind: 'tools', path: '/mcp' },
      { plugin: 'session-disk', path: '/api' },
      { plugin: 'work-sqlite', path: '/api' },
    ],
  },
});
```

`directorHttpEndpoints()` in product-director sets up the work and session mounts the CLI uses.

This is the default path in `coreSet()`. Use [transports](./transports.md) when you want stdio or a remote control plane instead.
