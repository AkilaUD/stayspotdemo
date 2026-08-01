import { illustrations } from '../assets/illustrations'

export const DEMO_STORE_KEY = 'stayspot_demo_store'
export const DEMO_PASSWORD = 'Password123!'

export const USER_IDS = {
  admin: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  seeker: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  advertiser: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
} as const

const img = {
  a: illustrations.coverPlaceholder,
  b: illustrations.howRenterBrowse,
  c: illustrations.howLandlordAccount,
  d: illustrations.featureTrust,
  e: illustrations.heroBoarding,
  f: illustrations.emptyBrowse,
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString()
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString()
}

export type DemoUser = {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  displayName: string
  initials: string
  role: 'SEEKER' | 'ADVERTISER' | 'ADMIN'
}

export type DemoListing = {
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
  boostEndsAtUtc: string | null
  imageUrls: string[]
  status: string
  advertiserId: string
  contactPhone: string
  locationDescription: string
  createdAtUtc: string
  submittedAtUtc: string | null
  rejectionReasonCode: string | null
  rejectionNote: string | null
  rentedAtUtc: string | null
  archiveReason: string | null
}

export type DemoReview = {
  id: string
  listingId: string
  seekerId: string
  seekerDisplayName: string
  rating: number
  body: string
  status: string
  createdAtUtc: string
}

export type DemoInquiry = {
  id: string
  listingId: string
  seekerId: string
  advertiserId: string
  message: string
  status: string
  replyMessage: string | null
  repliedAtUtc: string | null
  createdAtUtc: string
  whatsAppOpenCount: number
}

export type DemoSavedSearch = {
  id: string
  seekerId: string
  name: string
  query: string | null
  district: string | null
  adType: string | null
  minPriceLkr: number | null
  maxPriceLkr: number | null
  createdAtUtc: string
}

export type DemoViewing = {
  id: string
  listingId: string
  seekerId: string
  preferredAtUtc: string
  note: string | null
  status: string
  createdAtUtc: string
}

export type DemoUnlock = {
  listingId: string
  seekerId: string
  createdAtUtc: string
}

export type DemoAdvertiserSub = {
  userId: string
  planCode: string
  status: string
  boostCreditsDistrict: number
  boostCreditsIsland: number
  boostsFrozen: boolean
  currentPeriodEndUtc: string
  graceUntilUtc: string | null
}

export type DemoSeekerSub = {
  userId: string
  planCode: string
  status: string
  currentPeriodEndUtc: string
  graceUntilUtc: string | null
}

export type DemoPayment = {
  paymentId: string
  orderId: string
  userId: string
  amountLkr: number
  currency: string
  purpose: string
  planCode: string | null
  boostSku: string | null
  status: string
  createdAtUtc: string
}

export type DemoState = {
  users: DemoUser[]
  listings: DemoListing[]
  reviews: DemoReview[]
  inquiries: DemoInquiry[]
  savedSearches: DemoSavedSearch[]
  viewings: DemoViewing[]
  unlocks: DemoUnlock[]
  advertiserSubs: DemoAdvertiserSub[]
  seekerSubs: DemoSeekerSub[]
  payments: DemoPayment[]
}

export const ADVERTISER_PLANS = [
  {
    code: 'starter',
    name: 'Starter',
    priceLkrMonth: 0,
    listingSlots: 1,
    boostCreditsDistrict: 0,
    boostCreditsIsland: 0,
    bestFor: 'Try the platform',
    isFree: true,
  },
  {
    code: 'growth',
    name: 'Growth',
    priceLkrMonth: 1490,
    listingSlots: 3,
    boostCreditsDistrict: 1,
    boostCreditsIsland: 0,
    bestFor: 'Small landlords',
    isFree: false,
  },
  {
    code: 'pro',
    name: 'Pro',
    priceLkrMonth: 2990,
    listingSlots: 8,
    boostCreditsDistrict: 2,
    boostCreditsIsland: 1,
    bestFor: 'Serious operators',
    isFree: false,
  },
  {
    code: 'house',
    name: 'House',
    priceLkrMonth: 5990,
    listingSlots: 20,
    boostCreditsDistrict: 5,
    boostCreditsIsland: 3,
    bestFor: 'Multi-room houses',
    isFree: false,
  },
]

export const SEEKER_PLANS = [
  {
    code: 'seeker_free',
    name: 'Free',
    priceLkrMonth: 0,
    savedSearchLimit: 0,
    viewingRequestQuota: 0,
    earlyUnlock: false,
    bestFor: 'Browse and unlock contact',
    isFree: true,
  },
  {
    code: 'seeker_plus',
    name: 'Plus',
    priceLkrMonth: 490,
    savedSearchLimit: 10,
    viewingRequestQuota: 5,
    earlyUnlock: false,
    bestFor: 'Saved searches and viewing slots',
    isFree: false,
  },
  {
    code: 'seeker_pro',
    name: 'Pro',
    priceLkrMonth: 990,
    savedSearchLimit: 50,
    viewingRequestQuota: 15,
    earlyUnlock: true,
    bestFor: 'Early unlock + more viewing slots',
    isFree: false,
  },
]

export function createSeedState(): DemoState {
  const advertiserId = USER_IDS.advertiser
  const seekerId = USER_IDS.seeker

  const listings: DemoListing[] = [
    {
      id: '11111111-1111-1111-1111-111111111101',
      publicCode: 'STAY-1102-LK',
      title: 'Sunny single room near UoM',
      adType: 'RENT',
      priceLkrMonth: 22000,
      discountPercent: 10,
      city: 'Moratuwa',
      district: 'Colombo',
      description:
        'Bright single room walking distance to University of Moratuwa / Katubedda. Meals optional. Ideal for students.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 'Street',
      furniture: 'Semi-furnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: daysAgo(12),
      isBoosted: true,
      boostScope: 'DISTRICT',
      boostEndsAtUtc: daysFromNow(5),
      imageUrls: [img.e, img.b],
      status: 'APPROVED',
      advertiserId,
      contactPhone: '+94771234501',
      locationDescription: 'Near Katubedda junction, 8 min walk to UoM main gate',
      createdAtUtc: daysAgo(20),
      submittedAtUtc: daysAgo(18),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111102',
      publicCode: 'STAY-2201-LK',
      title: 'Shared flat near Bambalapitiya',
      adType: 'RENT',
      priceLkrMonth: 35000,
      discountPercent: 0,
      city: 'Bambalapitiya',
      district: 'Colombo',
      description:
        'Shared flat on Galle Road corridor. AC bedroom, Wi‑Fi, friendly housemates. Close to offices and sea breeze.',
      bedrooms: 2,
      bathrooms: 1,
      parking: 'None',
      furniture: 'Furnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: daysAgo(8),
      isBoosted: true,
      boostScope: 'ISLAND',
      boostEndsAtUtc: daysFromNow(10),
      imageUrls: [img.c, img.d, img.a],
      status: 'APPROVED',
      advertiserId,
      contactPhone: '+94771234502',
      locationDescription: 'Lane off Galle Road, Bambalapitiya',
      createdAtUtc: daysAgo(15),
      submittedAtUtc: daysAgo(14),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111104',
      publicCode: 'STAY-4401-LK',
      title: 'Quiet annex in Kandy city',
      adType: 'LEASE',
      priceLkrMonth: 28000,
      discountPercent: 5,
      city: 'Kandy',
      district: 'Kandy',
      description:
        'Self-contained annex near Peradeniya road. Suitable for professionals on lease terms.',
      bedrooms: 1,
      bathrooms: 1,
      parking: '1 car',
      furniture: 'Unfurnished',
      rentTimeTerm: '6 months',
      approvedAtUtc: daysAgo(5),
      isBoosted: false,
      boostScope: null,
      boostEndsAtUtc: null,
      imageUrls: [img.f],
      status: 'APPROVED',
      advertiserId,
      contactPhone: '+94771234504',
      locationDescription: 'Ampitiya side, 15 min to Kandy lake',
      createdAtUtc: daysAgo(10),
      submittedAtUtc: daysAgo(9),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111105',
      publicCode: 'STAY-5501-LK',
      title: 'Ladies boarding — Nugegoda',
      adType: 'RENT',
      priceLkrMonth: 18000,
      discountPercent: 0,
      city: 'Nugegoda',
      district: 'Colombo',
      description:
        'Ladies-only boarding with shared kitchen. Safe street, short bus ride to Colombo campuses.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 'None',
      furniture: 'Furnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: daysAgo(3),
      isBoosted: false,
      boostScope: null,
      boostEndsAtUtc: null,
      imageUrls: [img.b, img.a],
      status: 'APPROVED',
      advertiserId,
      contactPhone: '+94771234505',
      locationDescription: 'Near High Level Road, Nugegoda',
      createdAtUtc: daysAgo(7),
      submittedAtUtc: daysAgo(6),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111106',
      publicCode: 'STAY-6601-LK',
      title: 'Studio loft — Colombo 05',
      adType: 'RENT',
      priceLkrMonth: 45000,
      discountPercent: 15,
      city: 'Havelock Town',
      district: 'Colombo',
      description:
        'Compact studio with kitchenette. Modern finishes, ideal for a single professional.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 'Motorcycle',
      furniture: 'Fully furnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: daysAgo(2),
      isBoosted: false,
      boostScope: null,
      boostEndsAtUtc: null,
      imageUrls: [img.d],
      status: 'APPROVED',
      advertiserId,
      contactPhone: '+94771234506',
      locationDescription: 'Havelock Town, near shopping lanes',
      createdAtUtc: daysAgo(4),
      submittedAtUtc: daysAgo(4),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111107',
      publicCode: 'STAY-7701-LK',
      title: 'Twin share near Dehiwala',
      adType: 'RENT',
      priceLkrMonth: 16000,
      discountPercent: 0,
      city: 'Dehiwala',
      district: 'Colombo',
      description: 'Twin-share room, meals available on request. Quiet household.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 'Street',
      furniture: 'Semi-furnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: daysAgo(1),
      isBoosted: false,
      boostScope: null,
      boostEndsAtUtc: null,
      imageUrls: [img.c],
      status: 'APPROVED',
      advertiserId,
      contactPhone: '+94771234507',
      locationDescription: 'Hill Street area, Dehiwala',
      createdAtUtc: daysAgo(3),
      submittedAtUtc: daysAgo(2),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111103',
      publicCode: 'STAY-3300-LK',
      title: 'New listing pending review',
      adType: 'RENT',
      priceLkrMonth: 25000,
      discountPercent: 0,
      city: 'Rajagiriya',
      district: 'Colombo',
      description: 'Freshly painted room with attached bath. Awaiting admin approval.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 'None',
      furniture: 'Semi-furnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: null,
      isBoosted: false,
      boostScope: null,
      boostEndsAtUtc: null,
      imageUrls: [img.a],
      status: 'PENDING',
      advertiserId,
      contactPhone: '+94771234503',
      locationDescription: 'Rajagiriya, near playground',
      createdAtUtc: daysAgo(1),
      submittedAtUtc: daysAgo(1),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111108',
      publicCode: 'STAY-8800-LK',
      title: 'Rejected sample — unclear photos',
      adType: 'RENT',
      priceLkrMonth: 20000,
      discountPercent: 0,
      city: 'Maharagama',
      district: 'Colombo',
      description: 'Sample rejected listing for demo moderation states.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 'None',
      furniture: 'Unfurnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: null,
      isBoosted: false,
      boostScope: null,
      boostEndsAtUtc: null,
      imageUrls: [img.f],
      status: 'REJECTED',
      advertiserId,
      contactPhone: '+94771234508',
      locationDescription: 'Maharagama town',
      createdAtUtc: daysAgo(25),
      submittedAtUtc: daysAgo(24),
      rejectionReasonCode: 'UNCLEAR_PHOTOS',
      rejectionNote: 'Please upload clearer room photos and a street view.',
      rentedAtUtc: null,
      archiveReason: null,
    },
    {
      id: '11111111-1111-1111-1111-111111111109',
      publicCode: 'STAY-9900-LK',
      title: 'Already rented — archived',
      adType: 'RENT',
      priceLkrMonth: 30000,
      discountPercent: 0,
      city: 'Wellawatte',
      district: 'Colombo',
      description: 'Archived after mark-rented for My Ads demo.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 'None',
      furniture: 'Furnished',
      rentTimeTerm: 'Monthly',
      approvedAtUtc: daysAgo(40),
      isBoosted: false,
      boostScope: null,
      boostEndsAtUtc: null,
      imageUrls: [img.e],
      status: 'ARCHIVED',
      advertiserId,
      contactPhone: '+94771234509',
      locationDescription: 'Wellawatte beach side',
      createdAtUtc: daysAgo(50),
      submittedAtUtc: daysAgo(48),
      rejectionReasonCode: null,
      rejectionNote: null,
      rentedAtUtc: daysAgo(2),
      archiveReason: 'RENTED',
    },
  ]

  return {
    users: [
      {
        id: USER_IDS.admin,
        email: 'admin@stayspot.local',
        password: DEMO_PASSWORD,
        firstName: 'Ada',
        lastName: 'Admin',
        displayName: 'Ada Admin',
        initials: 'AA',
        role: 'ADMIN',
      },
      {
        id: USER_IDS.seeker,
        email: 'demo.seeker@stayspot.local',
        password: DEMO_PASSWORD,
        firstName: 'Saman',
        lastName: 'Seeker',
        displayName: 'Saman Seeker',
        initials: 'SS',
        role: 'SEEKER',
      },
      {
        id: USER_IDS.advertiser,
        email: 'demo.advertiser@stayspot.local',
        password: DEMO_PASSWORD,
        firstName: 'Latha',
        lastName: 'Landlord',
        displayName: 'Latha Landlord',
        initials: 'LL',
        role: 'ADVERTISER',
      },
    ],
    listings,
    reviews: [
      {
        id: 'r-001',
        listingId: listings[0].id,
        seekerId,
        seekerDisplayName: 'Saman Seeker',
        rating: 5,
        body: 'Clean room, landlord responded quickly on WhatsApp. Felt safe walking to campus.',
        status: 'PUBLISHED',
        createdAtUtc: daysAgo(4),
      },
      {
        id: 'r-002',
        listingId: listings[1].id,
        seekerId,
        seekerDisplayName: 'Saman Seeker',
        rating: 4,
        body: 'Great location near Bambalapitiya. Shared kitchen is tidy.',
        status: 'PUBLISHED',
        createdAtUtc: daysAgo(2),
      },
      {
        id: 'r-003',
        listingId: listings[0].id,
        seekerId,
        seekerDisplayName: 'Saman Seeker',
        rating: 2,
        body: 'Noise from the street was worse than expected.',
        status: 'PENDING',
        createdAtUtc: daysAgo(1),
      },
    ],
    inquiries: [
      {
        id: 'inq-001',
        listingId: listings[0].id,
        seekerId,
        advertiserId,
        message: 'Hi — is the room still available for August? Can I visit this weekend?',
        status: 'OPEN',
        replyMessage: null,
        repliedAtUtc: null,
        createdAtUtc: daysAgo(1),
        whatsAppOpenCount: 0,
      },
      {
        id: 'inq-002',
        listingId: listings[1].id,
        seekerId,
        advertiserId,
        message: 'Interested in the shared flat. Are utilities included?',
        status: 'REPLIED',
        replyMessage:
          'Yes — water and Wi‑Fi included. Electricity billed separately. Happy to chat on WhatsApp.',
        repliedAtUtc: daysAgo(0.5),
        createdAtUtc: daysAgo(2),
        whatsAppOpenCount: 1,
      },
    ],
    savedSearches: [
      {
        id: 'ss-001',
        seekerId,
        name: 'Colombo under 30k',
        query: 'boarding',
        district: 'Colombo',
        adType: 'RENT',
        minPriceLkr: null,
        maxPriceLkr: 30000,
        createdAtUtc: daysAgo(6),
      },
      {
        id: 'ss-002',
        seekerId,
        name: 'Near Moratuwa campus',
        query: 'UoM',
        district: 'Colombo',
        adType: null,
        minPriceLkr: 15000,
        maxPriceLkr: 25000,
        createdAtUtc: daysAgo(3),
      },
    ],
    viewings: [
      {
        id: 'vw-001',
        listingId: listings[0].id,
        seekerId,
        preferredAtUtc: daysFromNow(2),
        note: 'Prefer Saturday morning',
        status: 'REQUESTED',
        createdAtUtc: daysAgo(1),
      },
      {
        id: 'vw-002',
        listingId: listings[1].id,
        seekerId,
        preferredAtUtc: daysAgo(5),
        note: null,
        status: 'ACCEPTED',
        createdAtUtc: daysAgo(8),
      },
    ],
    unlocks: [
      {
        listingId: listings[1].id,
        seekerId,
        createdAtUtc: daysAgo(3),
      },
    ],
    advertiserSubs: [
      {
        userId: advertiserId,
        planCode: 'growth',
        status: 'ACTIVE',
        boostCreditsDistrict: 1,
        boostCreditsIsland: 0,
        boostsFrozen: false,
        currentPeriodEndUtc: daysFromNow(22),
        graceUntilUtc: null,
      },
    ],
    seekerSubs: [
      {
        userId: seekerId,
        planCode: 'seeker_plus',
        status: 'ACTIVE',
        currentPeriodEndUtc: daysFromNow(18),
        graceUntilUtc: null,
      },
    ],
    payments: [
      {
        paymentId: 'pay-demo-open',
        orderId: 'ORD-DEMO-OPEN',
        userId: advertiserId,
        amountLkr: 2990,
        currency: 'LKR',
        purpose: 'subscription',
        planCode: 'pro',
        boostSku: null,
        status: 'PENDING',
        createdAtUtc: daysAgo(0.1),
      },
      {
        paymentId: 'pay-demo-done',
        orderId: 'ORD-DEMO-DONE',
        userId: advertiserId,
        amountLkr: 1490,
        currency: 'LKR',
        purpose: 'subscription',
        planCode: 'growth',
        boostSku: null,
        status: 'PAID',
        createdAtUtc: daysAgo(20),
      },
    ],
  }
}
