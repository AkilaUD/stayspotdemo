export const SUPPORT_EMAIL = 'hello@stayspot.local'
export const SUPPORT_WHATSAPP = '94771234567'

export function formatLkr(amount: number) {
  return amount === 0 ? 'Free' : `Rs. ${amount.toLocaleString('en-LK')}`
}

export const DISTRICT_CHIPS = [
  { label: 'Colombo', district: 'Colombo' },
  { label: 'Moratuwa / Katubedda', district: 'Colombo' },
  { label: 'Kandy', district: 'Kandy' },
  { label: 'Galle', district: 'Galle' },
  { label: 'Gampaha', district: 'Gampaha' },
  { label: 'Malabe corridor', district: 'Colombo' },
] as const
