export const ASSET_ITEM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['filename', 'mimeType', 'base64'],
  properties: {
    filename: {
      type: 'string',
      description: 'Simple filename with no path, e.g. logo.svg or avatar.png. HTML should reference this name.',
    },
    mimeType: { type: 'string', description: 'MIME type, e.g. image/svg+xml or image/png' },
    base64: { type: 'string', description: 'Raw base64 of the file bytes (no data: prefix)' },
  },
};

export const ASSETS_SCHEMA = {
  type: 'array',
  description:
    'Icons and images used in UI HTML. Reference filename from src or CSS url(). Inlined as data URIs. You may also POST { sessionId, filename, mimeType, base64 } to HTTP /api/assets.',
  items: ASSET_ITEM_SCHEMA,
};
