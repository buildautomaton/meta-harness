import { useEffect, useMemo, useState } from 'react';
import { collectProjects, mergeProjects, normalizeProjectName } from './project-name.js';
import type { WorkArtifact, WorkItem } from './types.js';

export function useProjects(items: WorkItem[], artifacts: WorkArtifact[]) {
  const [project, setProject] = useState('');
  const [extra, setExtra] = useState<string[]>([]);
  const collected = useMemo(() => collectProjects(items, artifacts), [items, artifacts]);
  const projects = useMemo(() => mergeProjects(collected, extra), [collected, extra]);
  useEffect(() => {
    if (!projects.includes(project)) setProject(projects[0] ?? '');
  }, [projects, project]);
  useEffect(() => {
    setExtra((current) => current.filter((name) => !collected.includes(name)));
  }, [collected]);
  const addProject = (name: string) => {
    const next = normalizeProjectName(name);
    if (!next) return;
    if (!projects.includes(next)) setExtra((current) => [...current, next]);
    setProject(next);
  };
  const remember = (from: string, to: string) => {
    setExtra((current) => {
      const next = current.filter((name) => name !== from && name !== to);
      return to && !collected.includes(to) ? [...next, to] : next;
    });
    setProject(to);
  };
  return { project, setProject, projects, addProject, remember };
}
