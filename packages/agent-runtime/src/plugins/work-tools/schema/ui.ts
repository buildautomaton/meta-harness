import {
  UI_CHANGED_DESCRIPTION,
  UI_FILENAME_DESCRIPTION,
  UI_HTML_DESCRIPTION,
  UI_PAGES_DESCRIPTION,
  UI_TITLE_DESCRIPTION,
} from './ui-copy.js';

export const UI_PAGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['filename', 'title', 'html'],
  properties: {
    filename: { type: 'string', description: UI_FILENAME_DESCRIPTION },
    title: { type: 'string', description: UI_TITLE_DESCRIPTION },
    html: { type: 'string', description: UI_HTML_DESCRIPTION },
    whatChanged: { type: 'string', description: UI_CHANGED_DESCRIPTION },
  },
};

export const UI_ARTIFACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['pages'],
  properties: {
    pages: { type: 'array', minItems: 1, description: UI_PAGES_DESCRIPTION, items: UI_PAGE_SCHEMA },
  },
};
