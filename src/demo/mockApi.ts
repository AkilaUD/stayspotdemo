import { illustrations } from '../assets/illustrations'
import {
  ADVERTISER_PLANS,
  DEMO_PASSWORD,
  SEEKER_PLANS,
  USER_IDS,
  type DemoListing,
  type DemoUser,
} from './fixtures'
import { loadStore, nextId, updateStore } from './store'

export type UserDto = {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  initials: string
  role: string
}

export type AuthResponse = {
  token: string
  user: UserDto
}

export type PublicListing = {
  id: string
  publicCode: string
  title: string
  adType: string
  priceLkrMonth: number
  discountPercent: number
  city: string
  district: string
  description: string
  bedrooms: number
  bathrooms: number
  parking: string
  furniture: string
  rentTimeTerm: string
  approvedAtUtc: string | null
  isBoosted: boolean
  boostScope: string | null
  imageUrls: string[]
}

export type ListingDetail = PublicListing & {
  contactUnlocked: boolean
  contactPhone: string | null
  locationDescription: string | null
}

export type AdvertiserListing = {
  id: string
  publicCode: string
  title: string
  adType: string
  priceLkrMonth: number
  status: string
  imageUrls: string[]
  createdAtUtc: string
  submittedAtUtc: string | null
  rejectionReasonCode: string | null
  rejectionNote: string | null
  isBoosted: boolean
  activeBoostScope: string | null
  boostEndsAtUtc: string | null
  rentedAtUtc: string | null
  archiveReason: string | null
}

export type AdvertiserListingCounts = {
  pending: number
  approved: number
  rejected: number
  total: number
}

export type AdvertiserListingsResponse = {
  counts: AdvertiserListingCounts
  items: AdvertiserListing[]
}

export type ListingReview = {
  id: string
  listingId: string
  listingPublicCode: string
  listingTitle: string
  seekerDisplayName: string
  rating: number
  body: string
  status: string
  createdAtUtc: string
}

export type AdminListing = {
  id: string
  publicCode: string
  title: string
  adType: string
  priceLkrMonth: number
  city: string
  district: string
  description: string
  bedrooms: number
  bathrooms: number
  contactPhone: string
  locationDescription: string
  status: string
  createdAtUtc: string
  submittedAtUtc: string | null
  advertiserEmail: string
  advertiserDisplayName: string
  imageUrls: string[]
}

export type AdminAnalytics = {
  totalAdsPosted: number
  boostedCount: number
  notBoostedCount: number
  totalAdvertisers: number
  totalRegisteredViewers: number
  boostedIslandWide: number
  boostedDistrictWide: number
  pendingAds: number
  approvedAds: number
  rejectedAds: number
  contactUnlocks: number
}

export type Plan = {
  code: string
  name: string
  priceLkrMonth: number
  listingSlots: number
  boostCreditsDistrict: number
  boostCreditsIsland: number
  bestFor: string
  isFree: boolean
}

export type SeekerPlan = {
  code: string
  name: string
  priceLkrMonth: number
  savedSearchLimit: number
  viewingRequestQuota: number
  earlyUnlock: boolean
  bestFor: string
  isFree: boolean
}

export type AdvertiserSubscription = {
  planCode: string
  planName: string
  status: string
  listingSlots: number
  slotsUsed: number
  slotsRemaining: number
  boostCreditsDistrict: number
  boostCreditsIsland: number
  boostsFrozen: boolean
  priceLkrMonth: number
  currentPeriodEndUtc: string
  graceUntilUtc: string | null
}

export type SeekerSubscription = {
  planCode: string
  planName: string
  status: string
  savedSearchLimit: number
  savedSearchesUsed: number
  viewingRequestQuota: number
  viewingRequestsUsed: number
  viewingRequestsRemaining: number
  earlyUnlock: boolean
  isPremium: boolean
  priceLkrMonth: number
  currentPeriodEndUtc: string
  graceUntilUtc: string | null
}

export type SavedSearch = {
  id: string
  name: string
  query: string | null
  district: string | null
  adType: string | null
  minPriceLkr: number | null
  maxPriceLkr: number | null
  createdAtUtc: string
}

export type ViewingRequest = {
  id: string
  listingId: string
  listingTitle: string
  listingPublicCode: string
  preferredAtUtc: string
  note: string | null
  status: string
  createdAtUtc: string
}

export type Inquiry = {
  id: string
  listingId: string
  listingPublicCode: string
  listingTitle: string
  listingCity: string
  listingDistrict: string
  seekerId: string
  seekerDisplayName: string
  advertiserId: string
  message: string
  status: string
  replyMessage: string | null
  repliedAtUtc: string | null
  createdAtUtc: string
  whatsAppOpenCount: number
}

export type WhatsAppLink = {
  url: string
  prefill: string
  opensUsedLast24h: number
  opensRemainingLast24h: number
}

export type CheckoutSession = {
  paymentId: string
  orderId: string
  amountLkr: number
  currency: string
  purpose: string
  planCode: string | null
  boostSku: string | null
  merchantId: string
  checkoutUrl: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
  sandboxMock: boolean
}

function delay(ms = 40): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function toUserDto(u: DemoUser): UserDto {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    displayName: u.displayName,
    initials: u.initials,
    role: u.role,
  }
}

export function tokenForUser(userId: string): string {
  return `demo.${userId}`
}

function userIdFromToken(token: string | null): string | null {
  if (!token?.startsWith('demo.')) return null
  return token.slice('demo.'.length)
}

function currentUser(): DemoUser {
  const id = userIdFromToken(localStorage.getItem('stayspot_token'))
  if (!id) throw new Error('Unauthorized')
  const user = loadStore().users.find((u) => u.id === id)
  if (!user) throw new Error('Unauthorized')
  return user
}

function requireRole(...roles: string[]): DemoUser {
  const user = currentUser()
  if (!roles.includes(user.role)) throw new Error('Forbidden')
  return user
}

function toPublic(l: DemoListing): PublicListing {
  return {
    id: l.id,
    publicCode: l.publicCode,
    title: l.title,
    adType: l.adType,
    priceLkrMonth: l.priceLkrMonth,
    discountPercent: l.discountPercent,
    city: l.city,
    district: l.district,
    description: l.description,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    parking: l.parking,
    furniture: l.furniture,
    rentTimeTerm: l.rentTimeTerm,
    approvedAtUtc: l.approvedAtUtc,
    isBoosted: l.isBoosted,
    boostScope: l.boostScope,
    imageUrls: l.imageUrls,
  }
}

function toDetail(l: DemoListing, unlocked: boolean, asAdmin: boolean): ListingDetail {
  const show = unlocked || asAdmin
  return {
    ...toPublic(l),
    contactUnlocked: show,
    contactPhone: show ? l.contactPhone : null,
    locationDescription: show ? l.locationDescription : null,
  }
}

function toAdvertiserItem(l: DemoListing): AdvertiserListing {
  return {
    id: l.id,
    publicCode: l.publicCode,
    title: l.title,
    adType: l.adType,
    priceLkrMonth: l.priceLkrMonth,
    status: l.status,
    imageUrls: l.imageUrls,
    createdAtUtc: l.createdAtUtc,
    submittedAtUtc: l.submittedAtUtc,
    rejectionReasonCode: l.rejectionReasonCode,
    rejectionNote: l.rejectionNote,
    isBoosted: l.isBoosted,
    activeBoostScope: l.boostScope,
    boostEndsAtUtc: l.boostEndsAtUtc,
    rentedAtUtc: l.rentedAtUtc,
    archiveReason: l.archiveReason,
  }
}

function toAdminItem(l: DemoListing): AdminListing {
  const adv = loadStore().users.find((u) => u.id === l.advertiserId)
  return {
    id: l.id,
    publicCode: l.publicCode,
    title: l.title,
    adType: l.adType,
    priceLkrMonth: l.priceLkrMonth,
    city: l.city,
    district: l.district,
    description: l.description,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    contactPhone: l.contactPhone,
    locationDescription: l.locationDescription,
    status: l.status,
    createdAtUtc: l.createdAtUtc,
    submittedAtUtc: l.submittedAtUtc,
    advertiserEmail: adv?.email ?? 'unknown',
    advertiserDisplayName: adv?.displayName ?? 'Unknown',
    imageUrls: l.imageUrls,
  }
}

function activeListingStatuses(status: string): boolean {
  return status === 'APPROVED' || status === 'PENDING' || status === 'REJECTED'
}

function formStr(form: FormData, key: string, fallback = ''): string {
  const v = form.get(key)
  return typeof v === 'string' ? v : fallback
}

function formNum(form: FormData, key: string, fallback = 0): number {
  const n = Number(formStr(form, key, String(fallback)))
  return Number.isFinite(n) ? n : fallback
}

export async function register(body: {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'SEEKER' | 'ADVERTISER'
}): Promise<AuthResponse> {
  await delay()
  const email = body.email.trim().toLowerCase()
  if (loadStore().users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('Email already registered')
  }
  if (body.password.length < 8) throw new Error('Password must be at least 8 characters')

  const id = nextId('user')
  const displayName = `${body.firstName} ${body.lastName}`.trim()
  const initials = `${body.firstName[0] ?? ''}${body.lastName[0] ?? ''}`.toUpperCase() || '??'
  const user: DemoUser = {
    id,
    email,
    password: body.password,
    firstName: body.firstName,
    lastName: body.lastName,
    displayName,
    initials,
    role: body.role,
  }

  updateStore((s) => {
    s.users.push(user)
    if (body.role === 'ADVERTISER') {
      s.advertiserSubs.push({
        userId: id,
        planCode: 'starter',
        status: 'ACTIVE',
        boostCreditsDistrict: 0,
        boostCreditsIsland: 0,
        boostsFrozen: false,
        currentPeriodEndUtc: new Date(Date.now() + 30 * 86400000).toISOString(),
        graceUntilUtc: null,
      })
    } else {
      s.seekerSubs.push({
        userId: id,
        planCode: 'seeker_free',
        status: 'ACTIVE',
        currentPeriodEndUtc: new Date(Date.now() + 365 * 86400000).toISOString(),
        graceUntilUtc: null,
      })
    }
  })

  return { token: tokenForUser(id), user: toUserDto(user) }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  await delay()
  const user = loadStore().users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  )
  if (!user || user.password !== password) throw new Error('Invalid email or password')
  return { token: tokenForUser(user.id), user: toUserDto(user) }
}

export async function me(): Promise<UserDto> {
  await delay(10)
  return toUserDto(currentUser())
}

export async function advertiserPing(): Promise<{ ok: boolean; message: string }> {
  await delay()
  requireRole('ADVERTISER')
  return { ok: true, message: 'Advertiser demo ping ok' }
}

export async function fetchStatus(): Promise<{
  product: string
  architecture: string
  database: string
  schemas: string[]
}> {
  await delay()
  return {
    product: 'StaySpot Demo',
    architecture: 'static-mock',
    database: 'localStorage',
    schemas: ['auth', 'listings', 'billing', 'comms', 'core'],
  }
}

export async function fetchHealth(): Promise<boolean> {
  await delay()
  return true
}

export async function fetchListings(params?: {
  q?: string
  district?: string
  adType?: string
}): Promise<PublicListing[]> {
  await delay()
  let items = loadStore().listings.filter((l) => l.status === 'APPROVED')
  if (params?.district) {
    const d = params.district.toLowerCase()
    items = items.filter((l) => l.district.toLowerCase() === d)
  }
  if (params?.adType) {
    const a = params.adType.toLowerCase()
    items = items.filter((l) => l.adType.toLowerCase() === a)
  }
  if (params?.q?.trim()) {
    const q = params.q.trim().toLowerCase()
    items = items.filter((l) =>
      `${l.title} ${l.city} ${l.district} ${l.description} ${l.publicCode}`
        .toLowerCase()
        .includes(q),
    )
  }
  items.sort((a, b) => {
    if (a.isBoosted !== b.isBoosted) return a.isBoosted ? -1 : 1
    if (a.boostScope === 'ISLAND' && b.boostScope !== 'ISLAND') return -1
    if (b.boostScope === 'ISLAND' && a.boostScope !== 'ISLAND') return 1
    return (b.approvedAtUtc ?? '').localeCompare(a.approvedAtUtc ?? '')
  })
  return items.map(toPublic)
}

export async function fetchListing(id: string): Promise<ListingDetail> {
  await delay()
  const listing = loadStore().listings.find((l) => l.id === id)
  if (!listing || listing.status !== 'APPROVED') throw new Error('Listing not found')
  let unlocked = false
  let asAdmin = false
  try {
    const user = currentUser()
    asAdmin = user.role === 'ADMIN'
    if (user.role === 'SEEKER' || user.role === 'ADMIN') {
      unlocked = loadStore().unlocks.some(
        (u) => u.listingId === id && u.seekerId === user.id,
      )
    }
  } catch {
    /* guest */
  }
  return toDetail(listing, unlocked, asAdmin)
}

export async function unlockListingContact(id: string): Promise<ListingDetail> {
  await delay()
  const user = requireRole('SEEKER', 'ADMIN')
  const listing = loadStore().listings.find((l) => l.id === id && l.status === 'APPROVED')
  if (!listing) throw new Error('Listing not found')

  if (user.role === 'SEEKER') {
    updateStore((s) => {
      if (!s.unlocks.some((u) => u.listingId === id && u.seekerId === user.id)) {
        s.unlocks.push({
          listingId: id,
          seekerId: user.id,
          createdAtUtc: new Date().toISOString(),
        })
      }
    })
  }
  return toDetail(listing, true, user.role === 'ADMIN')
}

export async function createAdvertiserListing(form: FormData): Promise<AdvertiserListing> {
  await delay()
  const user = requireRole('ADVERTISER')
  const state = loadStore()
  const sub = state.advertiserSubs.find((s) => s.userId === user.id)
  const plan = ADVERTISER_PLANS.find((p) => p.code === (sub?.planCode ?? 'starter'))
  const slots = plan?.listingSlots ?? 1
  const used = state.listings.filter(
    (l) => l.advertiserId === user.id && activeListingStatuses(l.status),
  ).length
  if (used >= slots) {
    throw new Error(
      `Listing slot limit reached (${used}/${slots}). Upgrade your plan to publish more ads.`,
    )
  }

  const files = form.getAll('images').filter((f) => f instanceof File) as File[]
  const imageUrls =
    files.length > 0
      ? files.slice(0, 5).map(() => illustrations.coverPlaceholder)
      : [illustrations.coverPlaceholder]

  const id = nextId('listing')
  const now = new Date().toISOString()
  const code = `STAY-${Math.floor(1000 + Math.random() * 9000)}-LK`
  const listing: DemoListing = {
    id,
    publicCode: code,
    title: formStr(form, 'title', 'Untitled listing'),
    adType: formStr(form, 'adType', 'RENT').toUpperCase(),
    priceLkrMonth: formNum(form, 'priceLkrMonth', 15000),
    discountPercent: formNum(form, 'discountPercent', 0),
    city: formStr(form, 'city', 'Colombo'),
    district: formStr(form, 'district', 'Colombo'),
    description: formStr(form, 'description', ''),
    bedrooms: formNum(form, 'bedrooms', 1),
    bathrooms: formNum(form, 'bathrooms', 1),
    parking: formStr(form, 'parking', 'None'),
    furniture: formStr(form, 'furniture', 'Semi-furnished'),
    rentTimeTerm: formStr(form, 'rentTimeTerm', 'Monthly'),
    approvedAtUtc: null,
    isBoosted: false,
    boostScope: null,
    boostEndsAtUtc: null,
    imageUrls,
    status: 'PENDING',
    advertiserId: user.id,
    contactPhone: formStr(form, 'contactPhone', '+94770000000'),
    locationDescription: formStr(form, 'locationDescription', ''),
    createdAtUtc: now,
    submittedAtUtc: now,
    rejectionReasonCode: null,
    rejectionNote: null,
    rentedAtUtc: null,
    archiveReason: null,
  }

  updateStore((s) => {
    s.listings.unshift(listing)
  })
  return toAdvertiserItem(listing)
}

export async function fetchAdvertiserListings(): Promise<AdvertiserListingsResponse> {
  await delay()
  const user = requireRole('ADVERTISER')
  const items = loadStore().listings.filter((l) => l.advertiserId === user.id)
  const counts = {
    pending: items.filter((l) => l.status === 'PENDING').length,
    approved: items.filter((l) => l.status === 'APPROVED').length,
    rejected: items.filter((l) => l.status === 'REJECTED').length,
    total: items.length,
  }
  return { counts, items: items.map(toAdvertiserItem) }
}

export async function markListingRented(id: string): Promise<{
  id: string
  publicCode: string
  status: string
  rentedAtUtc: string
  agreementUrl: string
}> {
  await delay()
  const user = requireRole('ADVERTISER')
  const existing = loadStore().listings.find((l) => l.id === id && l.advertiserId === user.id)
  if (!existing) throw new Error('Listing not found')
  if (existing.status !== 'APPROVED') throw new Error('Only approved listings can be marked rented')
  const now = new Date().toISOString()
  updateStore((s) => {
    const listing = s.listings.find((l) => l.id === id && l.advertiserId === user.id)
    if (!listing) return
    listing.status = 'ARCHIVED'
    listing.rentedAtUtc = now
    listing.archiveReason = 'RENTED'
    listing.isBoosted = false
    listing.boostScope = null
    listing.boostEndsAtUtc = null
  })
  return {
    id: existing.id,
    publicCode: existing.publicCode,
    status: 'ARCHIVED',
    rentedAtUtc: now,
    agreementUrl: listingAgreementUrl(id),
  }
}

export async function fetchListingReviews(listingId: string): Promise<ListingReview[]> {
  await delay()
  const state = loadStore()
  const listing = state.listings.find((l) => l.id === listingId)
  return state.reviews
    .filter((r) => r.listingId === listingId && r.status === 'PUBLISHED')
    .map((r) => ({
      id: r.id,
      listingId: r.listingId,
      listingPublicCode: listing?.publicCode ?? '',
      listingTitle: listing?.title ?? '',
      seekerDisplayName: r.seekerDisplayName,
      rating: r.rating,
      body: r.body,
      status: r.status,
      createdAtUtc: r.createdAtUtc,
    }))
}

export async function createListingReview(body: {
  listingId: string
  rating: number
  body: string
}): Promise<ListingReview> {
  await delay()
  const user = requireRole('SEEKER')
  const listing = loadStore().listings.find((l) => l.id === body.listingId)
  if (!listing || listing.status !== 'APPROVED') throw new Error('Listing not found')
  const status = body.rating >= 3 ? 'PUBLISHED' : 'PENDING'
  const review = {
    id: nextId('review'),
    listingId: body.listingId,
    seekerId: user.id,
    seekerDisplayName: user.displayName,
    rating: body.rating,
    body: body.body,
    status,
    createdAtUtc: new Date().toISOString(),
  }
  updateStore((s) => {
    s.reviews.unshift(review)
  })
  return {
    id: review.id,
    listingId: review.listingId,
    listingPublicCode: listing.publicCode,
    listingTitle: listing.title,
    seekerDisplayName: review.seekerDisplayName,
    rating: review.rating,
    body: review.body,
    status: review.status,
    createdAtUtc: review.createdAtUtc,
  }
}

export function listingAgreementUrl(listingId: string): string {
  return `#demo-agreement/${listingId}`
}

export async function downloadListingAgreement(listingId: string): Promise<void> {
  await delay()
  currentUser()
  const listing = loadStore().listings.find((l) => l.id === listingId)
  if (!listing) throw new Error('Listing not found')
  const html = `<!doctype html><html><head><title>StaySpot Agreement ${listing.publicCode}</title></head><body style="font-family:system-ui;padding:2rem"><h1>Boarding agreement (demo)</h1><p><strong>${listing.title}</strong> (${listing.publicCode})</p><p>City: ${listing.city}, ${listing.district}</p><p>Monthly rent: LKR ${listing.priceLkrMonth.toLocaleString()}</p><p>This is a static demo agreement document.</p></body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
}

export async function boostListing(
  id: string,
  scope: 'DISTRICT' | 'ISLAND',
): Promise<{ id: string; scope: string; endsAtUtc: string }> {
  await delay()
  const user = requireRole('ADVERTISER')
  const endsAtUtc = new Date(Date.now() + 7 * 86400000).toISOString()
  updateStore((s) => {
    const listing = s.listings.find((l) => l.id === id && l.advertiserId === user.id)
    if (!listing) throw new Error('Listing not found')
    if (listing.status !== 'APPROVED') throw new Error('Only approved listings can be boosted')
    const sub = s.advertiserSubs.find((x) => x.userId === user.id)
    if (!sub || sub.boostsFrozen) throw new Error('Boosts unavailable on current plan')
    if (scope === 'DISTRICT') {
      if (sub.boostCreditsDistrict < 1) throw new Error('No district boost credits left')
      sub.boostCreditsDistrict -= 1
    } else {
      if (sub.boostCreditsIsland < 1) throw new Error('No island boost credits left')
      sub.boostCreditsIsland -= 1
    }
    listing.isBoosted = true
    listing.boostScope = scope
    listing.boostEndsAtUtc = endsAtUtc
  })
  return { id, scope, endsAtUtc }
}

export async function fetchAdminListings(status = 'PENDING'): Promise<AdminListing[]> {
  await delay()
  requireRole('ADMIN')
  return loadStore()
    .listings.filter((l) => l.status === status)
    .map(toAdminItem)
}

export async function approveListing(id: string): Promise<AdminListing> {
  await delay()
  requireRole('ADMIN')
  let listing: DemoListing | null = null
  updateStore((s) => {
    const found = s.listings.find((l) => l.id === id)
    if (!found) throw new Error('Listing not found')
    found.status = 'APPROVED'
    found.approvedAtUtc = new Date().toISOString()
    found.rejectionReasonCode = null
    found.rejectionNote = null
    listing = found
  })
  if (!listing) throw new Error('Listing not found')
  return toAdminItem(listing)
}

export async function rejectListing(
  id: string,
  reasonCode: string,
  note: string,
): Promise<AdminListing> {
  await delay()
  requireRole('ADMIN')
  let listing: DemoListing | null = null
  updateStore((s) => {
    const found = s.listings.find((l) => l.id === id)
    if (!found) throw new Error('Listing not found')
    found.status = 'REJECTED'
    found.rejectionReasonCode = reasonCode
    found.rejectionNote = note || null
    found.approvedAtUtc = null
    listing = found
  })
  if (!listing) throw new Error('Listing not found')
  return toAdminItem(listing)
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  await delay()
  requireRole('ADMIN')
  const s = loadStore()
  const ads = s.listings
  const approved = ads.filter((l) => l.status === 'APPROVED')
  return {
    totalAdsPosted: ads.length,
    boostedCount: approved.filter((l) => l.isBoosted).length,
    notBoostedCount: approved.filter((l) => !l.isBoosted).length,
    totalAdvertisers: s.users.filter((u) => u.role === 'ADVERTISER').length,
    totalRegisteredViewers: s.users.filter((u) => u.role === 'SEEKER').length,
    boostedIslandWide: approved.filter((l) => l.boostScope === 'ISLAND').length,
    boostedDistrictWide: approved.filter((l) => l.boostScope === 'DISTRICT').length,
    pendingAds: ads.filter((l) => l.status === 'PENDING').length,
    approvedAds: approved.length,
    rejectedAds: ads.filter((l) => l.status === 'REJECTED').length,
    contactUnlocks: s.unlocks.length,
  }
}

export async function fetchPlans(): Promise<Plan[]> {
  await delay()
  return ADVERTISER_PLANS.map((p) => ({ ...p }))
}

export async function fetchSeekerPlans(): Promise<SeekerPlan[]> {
  await delay()
  return SEEKER_PLANS.map((p) => ({ ...p }))
}

export async function fetchAdvertiserSubscription(): Promise<AdvertiserSubscription> {
  await delay()
  const user = requireRole('ADVERTISER')
  const s = loadStore()
  const sub = s.advertiserSubs.find((x) => x.userId === user.id)
  if (!sub) throw new Error('No subscription')
  const plan = ADVERTISER_PLANS.find((p) => p.code === sub.planCode) ?? ADVERTISER_PLANS[0]
  const slotsUsed = s.listings.filter(
    (l) => l.advertiserId === user.id && activeListingStatuses(l.status),
  ).length
  return {
    planCode: plan.code,
    planName: plan.name,
    status: sub.status,
    listingSlots: plan.listingSlots,
    slotsUsed,
    slotsRemaining: Math.max(0, plan.listingSlots - slotsUsed),
    boostCreditsDistrict: sub.boostCreditsDistrict,
    boostCreditsIsland: sub.boostCreditsIsland,
    boostsFrozen: sub.boostsFrozen,
    priceLkrMonth: plan.priceLkrMonth,
    currentPeriodEndUtc: sub.currentPeriodEndUtc,
    graceUntilUtc: sub.graceUntilUtc,
  }
}

export async function fetchSeekerSubscription(): Promise<SeekerSubscription> {
  await delay()
  const user = requireRole('SEEKER')
  const s = loadStore()
  const sub = s.seekerSubs.find((x) => x.userId === user.id)
  if (!sub) throw new Error('No subscription')
  const plan = SEEKER_PLANS.find((p) => p.code === sub.planCode) ?? SEEKER_PLANS[0]
  const savedSearchesUsed = s.savedSearches.filter((x) => x.seekerId === user.id).length
  const viewingRequestsUsed = s.viewings.filter(
    (v) => v.seekerId === user.id && v.status === 'REQUESTED',
  ).length
  return {
    planCode: plan.code,
    planName: plan.name,
    status: sub.status,
    savedSearchLimit: plan.savedSearchLimit,
    savedSearchesUsed,
    viewingRequestQuota: plan.viewingRequestQuota,
    viewingRequestsUsed,
    viewingRequestsRemaining: Math.max(0, plan.viewingRequestQuota - viewingRequestsUsed),
    earlyUnlock: plan.earlyUnlock,
    isPremium: !plan.isFree,
    priceLkrMonth: plan.priceLkrMonth,
    currentPeriodEndUtc: sub.currentPeriodEndUtc,
    graceUntilUtc: sub.graceUntilUtc,
  }
}

export async function fetchSavedSearches(): Promise<SavedSearch[]> {
  await delay()
  const user = requireRole('SEEKER')
  return loadStore()
    .savedSearches.filter((s) => s.seekerId === user.id)
    .map(({ id, name, query, district, adType, minPriceLkr, maxPriceLkr, createdAtUtc }) => ({
      id,
      name,
      query,
      district,
      adType,
      minPriceLkr,
      maxPriceLkr,
      createdAtUtc,
    }))
}

export async function createSavedSearch(body: {
  name: string
  query?: string
  district?: string
  adType?: string
  minPriceLkr?: number
  maxPriceLkr?: number
}): Promise<SavedSearch> {
  await delay()
  const user = requireRole('SEEKER')
  const sub = await fetchSeekerSubscription()
  if (sub.savedSearchesUsed >= sub.savedSearchLimit) {
    throw new Error('Saved search limit reached. Upgrade your seeker plan.')
  }
  const item = {
    id: nextId('ss'),
    seekerId: user.id,
    name: body.name,
    query: body.query ?? null,
    district: body.district ?? null,
    adType: body.adType ?? null,
    minPriceLkr: body.minPriceLkr ?? null,
    maxPriceLkr: body.maxPriceLkr ?? null,
    createdAtUtc: new Date().toISOString(),
  }
  updateStore((s) => {
    s.savedSearches.unshift(item)
  })
  return {
    id: item.id,
    name: item.name,
    query: item.query,
    district: item.district,
    adType: item.adType,
    minPriceLkr: item.minPriceLkr,
    maxPriceLkr: item.maxPriceLkr,
    createdAtUtc: item.createdAtUtc,
  }
}

export async function deleteSavedSearch(id: string): Promise<void> {
  await delay()
  const user = requireRole('SEEKER')
  updateStore((s) => {
    s.savedSearches = s.savedSearches.filter((x) => !(x.id === id && x.seekerId === user.id))
  })
}

export async function fetchViewingRequests(): Promise<ViewingRequest[]> {
  await delay()
  const user = requireRole('SEEKER')
  const s = loadStore()
  return s.viewings
    .filter((v) => v.seekerId === user.id)
    .map((v) => {
      const listing = s.listings.find((l) => l.id === v.listingId)
      return {
        id: v.id,
        listingId: v.listingId,
        listingTitle: listing?.title ?? 'Listing',
        listingPublicCode: listing?.publicCode ?? '',
        preferredAtUtc: v.preferredAtUtc,
        note: v.note,
        status: v.status,
        createdAtUtc: v.createdAtUtc,
      }
    })
}

export async function createViewingRequest(
  listingId: string,
  body: { preferredAtUtc: string; note?: string },
): Promise<ViewingRequest> {
  await delay()
  const user = requireRole('SEEKER')
  const sub = await fetchSeekerSubscription()
  if (sub.viewingRequestsRemaining < 1) {
    throw new Error('No viewing request quota left. Upgrade your seeker plan.')
  }
  const listing = loadStore().listings.find((l) => l.id === listingId && l.status === 'APPROVED')
  if (!listing) throw new Error('Listing not found')
  const item = {
    id: nextId('vw'),
    listingId,
    seekerId: user.id,
    preferredAtUtc: body.preferredAtUtc,
    note: body.note ?? null,
    status: 'REQUESTED',
    createdAtUtc: new Date().toISOString(),
  }
  updateStore((s) => {
    s.viewings.unshift(item)
  })
  return {
    id: item.id,
    listingId,
    listingTitle: listing.title,
    listingPublicCode: listing.publicCode,
    preferredAtUtc: item.preferredAtUtc,
    note: item.note,
    status: item.status,
    createdAtUtc: item.createdAtUtc,
  }
}

function mapInquiry(id: string): Inquiry {
  const s = loadStore()
  const inq = s.inquiries.find((i) => i.id === id)
  if (!inq) throw new Error('Inquiry not found')
  const listing = s.listings.find((l) => l.id === inq.listingId)
  const seeker = s.users.find((u) => u.id === inq.seekerId)
  return {
    id: inq.id,
    listingId: inq.listingId,
    listingPublicCode: listing?.publicCode ?? '',
    listingTitle: listing?.title ?? '',
    listingCity: listing?.city ?? '',
    listingDistrict: listing?.district ?? '',
    seekerId: inq.seekerId,
    seekerDisplayName: seeker?.displayName ?? 'Seeker',
    advertiserId: inq.advertiserId,
    message: inq.message,
    status: inq.status,
    replyMessage: inq.replyMessage,
    repliedAtUtc: inq.repliedAtUtc,
    createdAtUtc: inq.createdAtUtc,
    whatsAppOpenCount: inq.whatsAppOpenCount,
  }
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  await delay()
  const user = requireRole('SEEKER', 'ADVERTISER', 'ADMIN')
  const s = loadStore()
  const ids = s.inquiries
    .filter((i) => {
      if (user.role === 'ADMIN') return true
      if (user.role === 'SEEKER') return i.seekerId === user.id
      return i.advertiserId === user.id
    })
    .map((i) => i.id)
  return ids.map(mapInquiry)
}

export async function createInquiry(body: {
  listingId: string
  message: string
}): Promise<Inquiry> {
  await delay()
  const user = requireRole('SEEKER')
  const listing = loadStore().listings.find(
    (l) => l.id === body.listingId && l.status === 'APPROVED',
  )
  if (!listing) throw new Error('Listing not found')
  const id = nextId('inq')
  updateStore((s) => {
    s.inquiries.unshift({
      id,
      listingId: body.listingId,
      seekerId: user.id,
      advertiserId: listing.advertiserId,
      message: body.message,
      status: 'OPEN',
      replyMessage: null,
      repliedAtUtc: null,
      createdAtUtc: new Date().toISOString(),
      whatsAppOpenCount: 0,
    })
  })
  return mapInquiry(id)
}

export async function replyInquiry(id: string, message: string): Promise<Inquiry> {
  await delay()
  const user = requireRole('ADVERTISER')
  updateStore((s) => {
    const inq = s.inquiries.find((i) => i.id === id && i.advertiserId === user.id)
    if (!inq) throw new Error('Inquiry not found')
    inq.replyMessage = message
    inq.repliedAtUtc = new Date().toISOString()
    inq.status = 'REPLIED'
  })
  return mapInquiry(id)
}

export async function openInquiryWhatsApp(id: string): Promise<WhatsAppLink> {
  await delay()
  const user = requireRole('SEEKER', 'ADVERTISER')
  const s = loadStore()
  const inq = s.inquiries.find((i) => i.id === id)
  if (!inq) throw new Error('Inquiry not found')
  if (user.role === 'SEEKER' && inq.seekerId !== user.id) throw new Error('Forbidden')
  if (user.role === 'ADVERTISER' && inq.advertiserId !== user.id) throw new Error('Forbidden')
  if (inq.whatsAppOpenCount >= 5) throw new Error('WhatsApp open limit reached for 24h')

  const listing = s.listings.find((l) => l.id === inq.listingId)
  const phone = (listing?.contactPhone ?? '+94770000000').replace(/\D/g, '')
  const prefill = `Hi — regarding StaySpot ${listing?.publicCode ?? ''}: ${listing?.title ?? ''}`
  updateStore((st) => {
    const row = st.inquiries.find((i) => i.id === id)
    if (row) row.whatsAppOpenCount += 1
  })
  const used = inq.whatsAppOpenCount + 1
  return {
    url: `https://wa.me/${phone}?text=${encodeURIComponent(prefill)}`,
    prefill,
    opensUsedLast24h: used,
    opensRemainingLast24h: Math.max(0, 5 - used),
  }
}

export async function createCheckout(input: {
  planCode?: string
  boostSku?: string
}): Promise<CheckoutSession> {
  await delay()
  const user = requireRole('ADVERTISER', 'SEEKER')
  let amount = 0
  let purpose = 'subscription'
  let planCode = input.planCode ?? null
  const boostSku = input.boostSku ?? null

  if (boostSku) {
    purpose = 'boost'
    amount = boostSku.toLowerCase().includes('island') ? 990 : 490
    planCode = null
  } else if (planCode) {
    if (user.role === 'SEEKER') {
      const plan = SEEKER_PLANS.find((p) => p.code === planCode)
      if (!plan) throw new Error('Unknown seeker plan')
      amount = plan.priceLkrMonth
      purpose = 'seeker_premium'
    } else {
      const plan = ADVERTISER_PLANS.find((p) => p.code === planCode)
      if (!plan) throw new Error('Unknown plan')
      amount = plan.priceLkrMonth
    }
  } else {
    throw new Error('planCode or boostSku required')
  }

  const orderId = `ORD-${Date.now()}`
  const paymentId = nextId('pay')
  updateStore((s) => {
    s.payments.unshift({
      paymentId,
      orderId,
      userId: user.id,
      amountLkr: amount,
      currency: 'LKR',
      purpose,
      planCode,
      boostSku,
      status: 'PENDING',
      createdAtUtc: new Date().toISOString(),
    })
  })

  return {
    paymentId,
    orderId,
    amountLkr: amount,
    currency: 'LKR',
    purpose,
    planCode,
    boostSku,
    merchantId: 'DEMO_MERCHANT',
    checkoutUrl: `/billing/sandbox/${orderId}`,
    returnUrl: '/billing/return',
    cancelUrl: '/billing/cancel',
    notifyUrl: '/demo/notify',
    sandboxMock: true,
  }
}

export async function sandboxCompletePayment(orderId: string): Promise<{
  ok: boolean
  idempotent?: boolean
  planCode?: string
  status?: string
}> {
  await delay()
  const user = requireRole('ADVERTISER', 'SEEKER')
  const s = loadStore()
  const payment = s.payments.find((p) => p.orderId === orderId && p.userId === user.id)
  if (!payment) throw new Error('Payment not found')
  if (payment.status === 'PAID') {
    return { ok: true, idempotent: true, planCode: payment.planCode ?? undefined, status: 'PAID' }
  }

  updateStore((st) => {
    const pay = st.payments.find((p) => p.orderId === orderId)
    if (!pay) return
    pay.status = 'PAID'
    if (pay.purpose === 'subscription' && pay.planCode) {
      const plan = ADVERTISER_PLANS.find((p) => p.code === pay.planCode)
      let sub = st.advertiserSubs.find((x) => x.userId === user.id)
      if (!sub) {
        sub = {
          userId: user.id,
          planCode: pay.planCode,
          status: 'ACTIVE',
          boostCreditsDistrict: plan?.boostCreditsDistrict ?? 0,
          boostCreditsIsland: plan?.boostCreditsIsland ?? 0,
          boostsFrozen: false,
          currentPeriodEndUtc: new Date(Date.now() + 30 * 86400000).toISOString(),
          graceUntilUtc: null,
        }
        st.advertiserSubs.push(sub)
      } else {
        sub.planCode = pay.planCode
        sub.status = 'ACTIVE'
        sub.boostCreditsDistrict = plan?.boostCreditsDistrict ?? 0
        sub.boostCreditsIsland = plan?.boostCreditsIsland ?? 0
        sub.currentPeriodEndUtc = new Date(Date.now() + 30 * 86400000).toISOString()
      }
    }
    if (pay.purpose === 'seeker_premium' && pay.planCode) {
      let sub = st.seekerSubs.find((x) => x.userId === user.id)
      if (!sub) {
        st.seekerSubs.push({
          userId: user.id,
          planCode: pay.planCode,
          status: 'ACTIVE',
          currentPeriodEndUtc: new Date(Date.now() + 30 * 86400000).toISOString(),
          graceUntilUtc: null,
        })
      } else {
        sub.planCode = pay.planCode
        sub.status = 'ACTIVE'
        sub.currentPeriodEndUtc = new Date(Date.now() + 30 * 86400000).toISOString()
      }
    }
    if (pay.purpose === 'boost' && pay.boostSku) {
      const sub = st.advertiserSubs.find((x) => x.userId === user.id)
      if (sub) {
        if (pay.boostSku.toLowerCase().includes('island')) sub.boostCreditsIsland += 1
        else sub.boostCreditsDistrict += 1
      }
    }
  })

  return {
    ok: true,
    planCode: payment.planCode ?? undefined,
    status: 'PAID',
  }
}

export async function fetchPayment(orderId: string): Promise<{
  orderId: string
  amountLkr: number
  purpose: string
  planCode: string | null
  status: string
}> {
  await delay()
  currentUser()
  const payment = loadStore().payments.find((p) => p.orderId === orderId)
  if (!payment) throw new Error('Payment not found')
  return {
    orderId: payment.orderId,
    amountLkr: payment.amountLkr,
    purpose: payment.purpose,
    planCode: payment.planCode,
    status: payment.status,
  }
}

/** Demo helpers used by DemoBar */
export const demoPersonas = [
  {
    id: 'guest',
    label: 'Guest',
    email: null as string | null,
    userId: null as string | null,
  },
  {
    id: 'seeker',
    label: 'Seeker',
    email: 'demo.seeker@stayspot.local',
    userId: USER_IDS.seeker,
  },
  {
    id: 'advertiser',
    label: 'Advertiser',
    email: 'demo.advertiser@stayspot.local',
    userId: USER_IDS.advertiser,
  },
  {
    id: 'admin',
    label: 'Admin',
    email: 'admin@stayspot.local',
    userId: USER_IDS.admin,
  },
] as const

export { DEMO_PASSWORD, USER_IDS }
