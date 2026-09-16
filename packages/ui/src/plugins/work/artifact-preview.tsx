import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../design/tabs.js';
import type { ArtifactFile } from './types.js';

export function ArtifactPreview({ files }: { files: ArtifactFile[] }) {
  const html = files.filter((f) => f.path.endsWith('.html'));
  const rest = files.filter((f) => !f.path.endsWith('.html'));
  const tabs = [...html, ...rest];
  const [tab, setTab] = useState(tabs[0]?.path ?? '');
  useEffect(() => setTab(tabs[0]?.path ?? ''), [files]);
  if (tabs.length === 0) return null;
  return (
    <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1">
      <TabsList>
        {tabs.map((file) => (
          <TabsTrigger key={file.path} value={file.path}>
            {file.path}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((file) => (
        <TabsContent key={file.path} value={file.path} className="p-0">
          {file.path.endsWith('.html') ? (
            <iframe title={file.path} className="h-full min-h-[24rem] w-full bg-white" srcDoc={file.content} />
          ) : (
            <pre className="whitespace-pre-wrap p-4 text-sm text-muted-foreground">{file.content}</pre>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
