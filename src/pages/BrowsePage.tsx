import { motion } from 'framer-motion'
import {
  BedDouble,
  ChevronDown,
  MapPin,
  Phone,
  Search,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  fetchListings,
  unlockListingContact,
  type PublicListing,
} from '../api'
import { useAuth } from '../AuthContext'
import { Seo } from '../components/Seo'
import { Badge } from '../components/ui/badge'
import { Button, buttonVariants } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  Alert,
  EmptyState,
  PageHeader,
  Skeleton,
} from '../components/ui/feedback'
import { Input, Select } from '../components/ui/input'
import { MotionStagger } from '../components/ui/motion'
import { ListingCover } from '../components/ui/safe-image'
import {
  loginWithNext,
  TrustStrip,
} from '../components/ui/conversion'
import { PresenceStrip } from '../components/ui/presence'
import { illustrations } from '../assets/illustrations'
import { staggerItem } from '../lib/motion'
import { cn, formatLkr } from '../lib/utils'

const DISTRICTS = [
  'All districts',
  'Colombo',
  'Gampaha',
  'Kandy',
  'Galle',
  'Matara',
  'Kurunegala',
] as const

function ListingCard({
  listing,
  userRole,
}: {
  listing: PublicListing
  userRole: string | null
}) {
  const [phone, setPhone] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const canUnlock = userRole === 'SEEKER' || userRole === 'ADMIN'
  const unlocked = phone !== null

  async function reveal() {
    setBusy(true)
    setErr(null)
    try {
      const detail = await unlockListingContact(listing.id)
      setPhone(detail.contactPhone)
      setAddress(detail.locationDescription)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unlock failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div variants={staggerItem} className="h-full">
      <Card className="flex h-full flex-col overflow-hidden transition hover:border-accent/40 hover:shadow-[0_12px_36px_rgba(232,177,104,0.15)] hover:ring-1 hover:ring-accent/20">
        <ListingCover
          imageUrls={listing.imageUrls}
          alt={listing.title}
          overlay="glass"
          className="min-h-[11rem]"
        />
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={listing.adType === 'LEASE' ? 'info' : 'default'}>
              {listing.adType}
            </Badge>
            <Badge variant="verified">Reviewed</Badge>
            <span className="font-mono text-xs text-muted">{listing.publicCode}</span>
            {listing.isBoosted && (
              <Badge variant="accent" className="gap-1">
                <Sparkles className="h-3 w-3" aria-hidden />
                Boosted {listing.boostScope === 'ISLAND' ? 'island-wide' : 'district'}
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl leading-snug">
            <Link
              to={`/listings/${listing.id}`}
              className="text-ink no-underline hover:text-accent-text"
            >
              {listing.title}
            </Link>
          </CardTitle>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {listing.city}, {listing.district}
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 pt-3">
          <p className="font-display text-2xl font-bold tabular-nums text-ink">
            {formatLkr(listing.priceLkrMonth)}
            <span className="ml-1 text-sm font-medium text-muted">/month</span>
            {listing.discountPercent > 0 && (
              <Badge variant="accent" className="ml-2 align-middle">
                -{listing.discountPercent}%
              </Badge>
            )}
          </p>
          <TrustStrip dense className="opacity-90" />
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <BedDouble className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {listing.bedrooms} bed · {listing.bathrooms} bath
            {listing.furniture ? ` · ${listing.furniture}` : ''}
          </p>
          <p className="line-clamp-3 text-sm text-muted">{listing.description}</p>
          {err && <Alert variant="error">{err}</Alert>}
          {unlocked && (
            <div className="glass-panel-dense rounded-xl p-3 text-sm">
              <p className="flex items-start gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-semibold text-ink">Phone</span> {phone}
                </span>
              </p>
              <p className="mt-1.5 pl-5">
                <span className="font-semibold text-ink">Address</span> {address}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="mt-auto flex-wrap gap-2">
          <Link
            to={`/listings/${listing.id}`}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'bg-accent text-on-accent hover:brightness-105',
            )}
          >
            View details
          </Link>
          {!userRole && (
            <Link
              to={loginWithNext(`/listings/${listing.id}`)}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              Sign in to unlock
            </Link>
          )}
          {userRole === 'ADVERTISER' && (
            <p className="w-full text-sm text-muted">
              Switch to a seeker account to unlock renter contact.
            </p>
          )}
          {canUnlock && !unlocked && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              loading={busy}
              onClick={() => void reveal()}
            >
              {busy ? 'Unlocking…' : 'Reveal contact'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

/** Discovery / search experience (formerly `/`). */
export function BrowsePage() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const initialDistrict = params.get('district') || 'All districts'
  const initialQ = params.get('q') || ''

  const [q, setQ] = useState(initialQ)
  const [district, setDistrict] = useState(
    DISTRICTS.includes(initialDistrict as (typeof DISTRICTS)[number])
      ? initialDistrict
      : 'All districts',
  )
  const [adType, setAdType] = useState('')
  const [submittedQ, setSubmittedQ] = useState(initialQ)
  const [listings, setListings] = useState<PublicListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const d = params.get('district')
    if (d && DISTRICTS.includes(d as (typeof DISTRICTS)[number])) {
      setDistrict(d)
    }
    const qParam = params.get('q')
    if (qParam != null) {
      setQ(qParam)
      setSubmittedQ(qParam)
    }
  }, [params])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const items = await fetchListings({
          q: submittedQ || undefined,
          district: district === 'All districts' ? undefined : district,
          adType: adType || undefined,
        })
        if (!cancelled) setListings(items)
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load listings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [submittedQ, district, adType])

  const rails = useMemo(() => {
    const boosted = listings.filter((l) => l.isBoosted)
    const nearCampus = listings.filter((l) =>
      /moratuwa|katubedda|bambalapitiya|colombo/i.test(
        `${l.city} ${l.district} ${l.title} ${l.description}`,
      ),
    )
    const discounted = listings.filter((l) => l.discountPercent > 0)
    return [
      {
        id: 'boosted',
        title: 'Boosted places',
        items: boosted,
      },
      { id: 'all', title: 'Approved places', items: listings },
      {
        id: 'campus',
        title: 'Near campuses & city corridors',
        items: nearCampus.length ? nearCampus : listings.slice(0, 2),
      },
      {
        id: 'deals',
        title: 'With discount',
        items: discounted,
      },
    ].filter((r) => r.items.length > 0)
  }, [listings])

  function onSearch(e: FormEvent) {
    e.preventDefault()
    setSubmittedQ(q.trim())
  }

  const filterFields = (
    <>
      <label className="grid gap-1.5 text-sm font-medium text-ink">
        District
        <Select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          aria-label="District"
        >
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Type
        <Select
          value={adType}
          onChange={(e) => setAdType(e.target.value)}
          aria-label="Ad type"
        >
          <option value="">Rent or lease</option>
          <option value="RENT">Rent</option>
          <option value="LEASE">Lease</option>
        </Select>
      </label>
    </>
  )

  return (
    <div>
      <Seo
        title="Browse boarding places | StaySpot"
        description="Search reviewed StaySpot boarding listings across Sri Lanka by district, campus corridor, and rent."
      />
      <PageHeader
        eyebrow="Reviewed boarding across Sri Lanka"
        title="Find a place you can trust."
        description="Browse approved StaySpot listings. Phone and exact address stay hidden until you sign in as a seeker and reveal contact."
      />
      <PresenceStrip
        className="mb-6"
        liveCount={listings.length || null}
      />

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        {/* Desktop collapsible glass filter sidebar */}
        <aside className="mb-6 hidden lg:block">
          <div className="glass-panel sticky top-20 rounded-2xl p-4">
            <button
              type="button"
              className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-ink"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-expanded={sidebarOpen}
            >
              Filters
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition',
                  sidebarOpen ? 'rotate-180' : '',
                )}
                aria-hidden
              />
            </button>
            {sidebarOpen && (
              <form className="grid gap-3" onSubmit={onSearch}>
                <label className="grid gap-1.5 text-sm font-medium text-ink">
                  Search
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden
                    />
                    <Input
                      type="search"
                      className="pl-9"
                      placeholder="City, campus…"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      aria-label="Search listings"
                    />
                  </div>
                </label>
                {filterFields}
                <Button type="submit" className="w-full">
                  Explore
                </Button>
              </form>
            )}
          </div>
        </aside>

        <div>
          {/* Mobile top form */}
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel mb-6 grid gap-3 rounded-2xl p-4 lg:hidden"
            onSubmit={onSearch}
          >
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              Search
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <Input
                  type="search"
                  className="pl-9"
                  placeholder="Search city, campus, or title…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Search listings"
                />
              </div>
            </label>
            <Button type="submit" className="w-full">
              Explore
            </Button>
            <button
              type="button"
              className="flex items-center justify-between text-sm font-semibold text-ink"
              onClick={() => setMoreFiltersOpen((v) => !v)}
              aria-expanded={moreFiltersOpen}
            >
              More filters
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition',
                  moreFiltersOpen ? 'rotate-180' : '',
                )}
                aria-hidden
              />
            </button>
            {moreFiltersOpen && (
              <div className="grid gap-3 sm:grid-cols-2">{filterFields}</div>
            )}
          </motion.form>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}. Start the API on port 5080.
            </Alert>
          )}

          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <EmptyState
              icon={Search}
              title="Nothing matched — try a nearby corridor"
              description="Clear filters or jump to a busy district. You’re not stuck in an empty room."
              illustration={illustrations.emptyBrowse}
              suggestions={[
                { label: 'Colombo', to: '/browse?district=Colombo' },
                { label: 'Kandy', to: '/browse?district=Kandy' },
                { label: 'Gampaha', to: '/browse?district=Gampaha' },
                { label: 'All districts', to: '/browse' },
              ]}
              action={
                <Link
                  to="/browse"
                  className={cn(
                    buttonVariants({ variant: 'primary' }),
                    'bg-accent text-on-accent hover:brightness-105',
                  )}
                >
                  Reset & browse
                </Link>
              }
            />
          )}

          {rails.map((rail) => (
            <section key={rail.id} className="mb-12">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-ink">
                  {rail.title}
                </h2>
                <Badge variant="default">{rail.items.length}</Badge>
              </div>
              <MotionStagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {rail.items.map((listing) => (
                  <ListingCard
                    key={`${rail.id}-${listing.id}`}
                    listing={listing}
                    userRole={user?.role ?? null}
                  />
                ))}
              </MotionStagger>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

/** @deprecated Use BrowsePage — kept for any stale imports */
export { BrowsePage as HomePage }
