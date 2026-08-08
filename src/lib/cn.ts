/**
 * Join conditional class names into a single string.
 *
 * Deliberately dependency-free: the design system keeps variant classes in
 * mutually-exclusive groups (see `src/components/ui/Button.tsx`), so a merge
 * strategy like `tailwind-merge` is never needed to resolve conflicts.
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };

  inputs.forEach(walk);
  return out.join(' ');
}
