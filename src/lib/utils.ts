import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLkr(amount: number) {
  return amount === 0 ? 'Free' : `Rs. ${amount.toLocaleString('en-LK')}`
}
