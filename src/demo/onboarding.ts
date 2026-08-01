import { USER_IDS } from './fixtures'

const FORCE_TOUR_KEY = 'stayspot.demo.forceTour'

export function storageKey(userId: string) {
  return `stayspot.onboarding.v1.${userId}`
}

/** Seeded demo personas start with tours complete so role switch never auto-opens. */
export function markSeedToursDone() {
  try {
    for (const id of [USER_IDS.seeker, USER_IDS.advertiser, USER_IDS.admin]) {
      localStorage.setItem(storageKey(id), '1')
    }
  } catch {
    /* ignore quota */
  }
}

/** Clear done flag and arm a one-shot replay for this user on next hydrate. */
export function requestTourReplay(userId: string) {
  try {
    localStorage.removeItem(storageKey(userId))
    sessionStorage.setItem(FORCE_TOUR_KEY, userId)
  } catch {
    /* ignore */
  }
}

/** Returns true once if this load should open the tour for userId. */
export function consumeTourReplay(userId: string): boolean {
  try {
    const forced = sessionStorage.getItem(FORCE_TOUR_KEY)
    if (forced === userId) {
      sessionStorage.removeItem(FORCE_TOUR_KEY)
      return true
    }
  } catch {
    /* ignore */
  }
  return false
}

export function markTourDone(userId: string) {
  try {
    localStorage.setItem(storageKey(userId), '1')
  } catch {
    /* ignore quota */
  }
}
