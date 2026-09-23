# Transports

Transport plugins (`kind: 'transport'`) open a channel that is **not** the shared HTTP server. Pick one when you do not want localhost HTTP.

| Plugin | Channel |
| --- | --- |
| `stdioTransportPlugin` | Tools on stdin / stdout |
| `remoteTransportPlugin` | Register with a control plane (`remoteUrl` or a custom adapter) |

```ts
stdioTransportPlugin()

remoteTransportPlugin({
  implementation: createHttpRemoteAdapter('https://control.example'),
})
```

In `coreSet()`:

```ts
coreSet({ options: { cwd, transport: 'stdio' } })
coreSet({ options: { cwd, transport: 'remote', remoteUrl: 'https://control.example' } })
```

For the usual localhost server with `/mcp` and extra API mounts, see [HTTP](./http.md).
