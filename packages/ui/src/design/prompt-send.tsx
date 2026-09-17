import { ArrowUp } from 'lucide-react';
import { Button } from './button.js';

export function PromptSendButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="icon"
      disabled={disabled}
      onClick={onClick}
      title="Send"
      aria-label="Send"
      className="h-9 w-9 rounded-full"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
