/**
 * Utility function for merging Tailwind CSS class names
 *
 * Combines multiple class names and handles conditional classes.
 * Later classes override earlier ones for conflicting utilities.
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((x) => typeof x === 'string' && x.length > 0)
    .join(' ')
    .trim();
}
