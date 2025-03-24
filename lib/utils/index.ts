/**
 * Utility functions for UI components
 */

/**
 * Merges class names together
 * @param inputs Class names to merge
 * @returns Merged class names
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
} 