import {
  UI_BANNER_CHANGE_DESCRIPTION,
  UI_BANNER_DESCRIPTION,
  UI_BANNER_TEXT_DESCRIPTION,
  UI_FILENAME_DESCRIPTION,
  UI_HTML_DESCRIPTION,
  UI_PAGES_DESCRIPTION,
  UI_TITLE_DESCRIPTION,
} from './ui-copy.js';

export const UI_BANNER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['change', 'text'],
  description: UI_BANNER_DESCRIPTION,
  properties: {
    change: {
      type: 'string',
      enum: ['added', 'modified', 'removed'],
      description: UI_BANNER_CHANGE_DESCRIPTION,
    },
    text: { type: 'string', description: UI_BANNER_TEXT_DESCRIPTION },
  },
};

export const UI_PAGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['filename', 'title', 'html', 'banner'],
  properties: {
    filename: { type: 'string', description: UI_FILENAME_DESCRIPTION },
    title: { type: 'string', description: UI_TITLE_DESCRIPTION },
    html: { type: 'string', description: UI_HTML_DESCRIPTION },
    banner: UI_BANNER_SCHEMA,
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
