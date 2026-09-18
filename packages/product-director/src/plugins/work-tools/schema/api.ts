export const API_ROUTES_DESCRIPTION =
  'Every HTTP route that was added, modified, or removed. Use the real paths and methods from this app, not sample /api/example routes.';

export const API_ROUTE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['method', 'path', 'change', 'description'],
  properties: {
    method: {
      type: 'string',
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'WEBSOCKET'],
      description: 'HTTP method or WEBSOCKET',
    },
    path: { type: 'string', description: 'Real route path from this app, e.g. /api/checkout/sessions' },
    change: { type: 'string', enum: ['added', 'modified', 'removed'], description: 'How this route changed' },
    description: {
      type: 'string',
      description: 'What this route does in this product, and what changed versus before',
    },
  },
};

export const API_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['routes'],
  properties: {
    routes: { type: 'array', minItems: 1, description: API_ROUTES_DESCRIPTION, items: API_ROUTE_SCHEMA },
  },
};
