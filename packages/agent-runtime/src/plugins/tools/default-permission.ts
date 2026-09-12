export function defaultAllowPermission(params: Record<string, unknown> | undefined): unknown {
  const options = Array.isArray(params?.options) ? params.options : [];
  const first = options.find((item) => item && typeof item === 'object') as
    | { optionId?: string; id?: string }
    | undefined;
  const optionId = first?.optionId ?? first?.id ?? 'allow-once';
  return { outcome: { outcome: 'selected', optionId } };
}
