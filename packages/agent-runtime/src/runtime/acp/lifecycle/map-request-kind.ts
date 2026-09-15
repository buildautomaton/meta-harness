/** Map vendor ACP request methods to normalized runtime kinds. */
export function mapRequestKind(
  method: string,
): 'plan' | 'permission' | 'question' | 'todos' | 'task' {
  if (method === 'cursor/create_plan') return 'plan';
  if (method === 'cursor/update_todos') return 'todos';
  if (method === 'cursor/task') return 'task';
  if (method === 'session/request_permission') return 'permission';
  return 'question';
}
