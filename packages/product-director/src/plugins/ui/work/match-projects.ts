export type ProjectPick = { name: string; create?: boolean };

export function matchProjects(projects: string[], query: string): ProjectPick[] {
  const named = projects.filter((name) => name.trim());
  const q = query.trim();
  const filtered = q ? named.filter((name) => name.toLowerCase().includes(q.toLowerCase())) : named;
  const options: ProjectPick[] = filtered.map((name) => ({ name }));
  const exact = named.some((name) => name.toLowerCase() === q.toLowerCase());
  if (q && !exact) options.push({ name: q, create: true });
  return options;
}

export function resolveProjectPick(projects: string[], query: string): string | undefined {
  const options = matchProjects(projects, query);
  const q = query.trim().toLowerCase();
  const exact = options.find((option) => !option.create && option.name.toLowerCase() === q);
  if (exact) return exact.name;
  const created = options.find((option) => option.create);
  return created?.name ?? options[0]?.name;
}
