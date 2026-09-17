import { CheckCircle2 } from 'lucide-react';
import { Column } from '../../design/column.js';
import { WorkFeedList } from './feed-list.js';

export function CompletedView() {
  return (
    <Column title="Completed" icon={CheckCircle2}>
      <WorkFeedList />
    </Column>
  );
}
