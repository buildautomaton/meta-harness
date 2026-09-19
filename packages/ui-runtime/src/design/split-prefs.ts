export function readPref(key: string): number | undefined {
  try {
    const value = localStorage.getItem(key);
    if (!value) return undefined;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function writePref(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Ignore quota / private-mode failures.
  }
}
