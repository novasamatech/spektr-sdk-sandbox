import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nonNullable<T>(value: T): value is Exclude<NonNullable<T>, void> {
  return value !== null && value !== undefined;
}
