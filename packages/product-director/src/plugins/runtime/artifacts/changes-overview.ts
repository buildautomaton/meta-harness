import { artifactPlugin } from './define.js';
import { mdFile } from './md-file.js';
import { changesOverviewMarkdown } from '@plugins/runtime/work/artifacts/changes-overview-pages.js';
import { CHANGES_OVERVIEW_ARTIFACT_SCHEMA } from '@plugins/runtime/work-tools/schema/changes-overview.js';
import { parseChangesOverview } from '@plugins/runtime/work-tools/parse-changes-overview.js';
import type { ChangesOverviewArtifactInput } from '@/types/work/changes-overview.js';

export const changesOverviewArtifactPlugin = () =>
  artifactPlugin('artifact-changes-overview', {
    key: 'changesOverview',
    description:
      'changesOverview: summary table of significant files/folders, grouped by related change sets (added/modified/removed).',
    instructions:
      'Include changesOverview for every code change: group related paths, mark each added/modified/removed, and give each group a 1–2 line significance blurb. Still pass ui/api/dataModel/algorithm when those surfaces changed.',
    schema: CHANGES_OVERVIEW_ARTIFACT_SCHEMA,
    parse: parseChangesOverview,
    buildFiles: (payload) =>
      mdFile('changes-overview', changesOverviewMarkdown(payload as ChangesOverviewArtifactInput)),
  });
