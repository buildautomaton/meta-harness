import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from './cn.js';
import { promptTextareaClass } from './prompt-classes.js';

export const PromptField = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(promptTextareaClass, 'min-h-[72px]', className)} {...props} />
  ),
);
PromptField.displayName = 'PromptField';
