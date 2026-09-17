import { PromptSendButton } from './prompt-send.js';

export function PromptToolbar({
  disabled,
  onSubmit,
}: {
  disabled?: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-end border-t border-border/40 px-1 pb-1 pt-0.5">
      <PromptSendButton disabled={disabled} onClick={onSubmit} />
    </div>
  );
}
