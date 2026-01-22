import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseMoney(value: string | number | undefined): number {
  if (!value) return 0;
  const str = value.toString();
  // Remove dots (thousands separator) and replace comma with dot (decimal) if needed, 
  // though the current app seems to use standard number inputs or simple strings.
  // Based on user's regex: .replace(/\./g, '')
  return parseInt(str.replace(/\./g, '')) || 0;
}
