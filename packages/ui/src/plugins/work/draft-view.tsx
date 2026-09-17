import { PenLine } from 'lucide-react';
import { Column } from '../../design/column.js';
import { WorkComposer } from './composer.js';
import { DraftList } from './draft-list.js';

export function DraftView() {
  return (
    <Column title="Draft work" icon={PenLine} toolbar={<WorkComposer />}>
      <DraftList />
    </Column>
  );
}
