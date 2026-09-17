import { ListTodo } from 'lucide-react';
import { Column } from '../../design/column.js';
import { QueuedList } from './queued-list.js';

export function QueuedView() {
  return (
    <Column title="Queued work" icon={ListTodo}>
      <QueuedList />
    </Column>
  );
}
