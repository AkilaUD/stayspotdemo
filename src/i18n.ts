/** Lightweight i18n scaffold (EN default; SI/TA stubs for Phase 3 copy). */

export type Locale = 'en' | 'si' | 'ta'

const strings = {
  en: {
    brand: 'StaySpot',
    signIn: 'Sign in',
    createAccount: 'Create account',
    emptyListings: 'No listings match these filters yet.',
    emptyInbox: 'No inquiries yet.',
  },
  si: {
    brand: 'StaySpot',
    signIn: 'පිවිසෙන්න',
    createAccount: 'ගිණුමක් සාදන්න',
    emptyListings: 'මෙම පෙරහන් සඳහා දැන්වීම් නැත.',
    emptyInbox: 'විමසුම් නැත.',
  },
  ta: {
    brand: 'StaySpot',
    signIn: 'உள்நுழை',
    createAccount: 'கணக்கு உருவாக்கு',
    emptyListings: 'இந்த வடிப்பான்களுக்கு விளம்பரங்கள் இல்லை.',
    emptyInbox: 'விசாரணைகள் இல்லை.',
  },
} as const

export type StringKey = keyof typeof strings.en

let current: Locale = 'en'

export function setLocale(locale: Locale) {
  current = locale
  try {
    localStorage.setItem('stayspot_locale', locale)
  } catch {
    /* ignore */
  }
}

export function getLocale(): Locale {
  return current
}

export function t(key: StringKey): string {
  return strings[current][key] ?? strings.en[key]
}

export function initLocaleFromStorage() {
  try {
    const saved = localStorage.getItem('stayspot_locale') as Locale | null
    if (saved && saved in strings) current = saved
  } catch {
    /* ignore */
  }
}
