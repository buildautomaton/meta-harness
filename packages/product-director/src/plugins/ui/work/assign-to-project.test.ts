import { describe, expect, it, vi } from 'vitest';
import { assignToProject } from './assign-to-project.js';
import type { WorkClient } from './types.js';

describe('assignToProject', () => {
  it('patches work or artifact with a normalized name', async () => {
    const client = {
      updateWork: vi.fn().mockResolvedValue({}),
      updateArtifact: vi.fn().mockResolvedValue({}),
    } as unknown as WorkClient;
    expect(await assignToProject(client, { workId: 'w1' }, '  Studio  ')).toBe('Studio');
    expect(client.updateWork).toHaveBeenCalledWith('w1', { project: 'Studio' });
    expect(await assignToProject(client, { artifactId: 'a1' }, 'Hiring')).toBe('Hiring');
    expect(client.updateArtifact).toHaveBeenCalledWith('a1', { project: 'Hiring' });
    expect(await assignToProject(client, {}, 'Hiring')).toBeNull();
    expect(await assignToProject(client, { workId: 'w1' }, 'No project')).toBeNull();
  });
});
