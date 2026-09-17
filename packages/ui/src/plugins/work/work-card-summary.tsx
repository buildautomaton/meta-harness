export function WorkCardSummary({ content }: { content: string }) {
  if (!content) return null;
  return <p className="px-4 pb-3 text-[15px] leading-relaxed text-foreground/90">{content}</p>;
}
