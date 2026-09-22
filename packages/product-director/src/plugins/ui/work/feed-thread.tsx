import { useState } from 'react';
import { WorkCard } from './work-card.js';
import { FeedThreadToggle } from './feed-thread-toggle.js';
import type { WorkArtifact } from './types.js';

const hairlineBelow =
  "relative before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-px before:origin-bottom before:scale-y-50 before:bg-foreground/65 before:content-['']";

export function FeedThread({ artifacts }: { artifacts: WorkArtifact[] }) {
  const [open, setOpen] = useState(false);
  const latest = artifacts[artifacts.length - 1]!;
  const earlier = artifacts.slice(0, -1);
  if (!earlier.length) return <WorkCard artifact={latest} />;
  return (
    <div>
      {open
        ? earlier.map((artifact) => (
            <div key={artifact.id} className={hairlineBelow}>
              <WorkCard artifact={artifact} />
            </div>
          ))
        : null}
      <div className={hairlineBelow}>
        <FeedThreadToggle count={earlier.length} open={open} onToggle={() => setOpen((value) => !value)} />
      </div>
      <WorkCard artifact={latest} />
    </div>
  );
}
