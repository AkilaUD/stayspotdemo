import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BedDouble,
  CalendarClock,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  X,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  createInquiry,
  createListingReview,
  createViewingRequest,
  fetchListing,
  fetchListingReviews,
  fetchSeekerSubscription,
  unlockListingContact,
  type ListingDetail,
  type ListingReview,
  type SeekerSubscription,
} from '../api'
import { useAuth } from '../AuthContext'
import { Badge } from '../components/ui/badge'
import { Button, buttonVariants } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  Alert,
  PageHeader,
  Skeleton,
} from '../components/ui/feedback'
import { Input, Label, Select, Textarea } from '../components/ui/input'
import { ListingCover, SafeImage } from '../components/ui/safe-image'
import {
  loginWithNext,
  NextStepPanel,
  TrustStrip,
} from '../components/ui/conversion'
import { cn, formatLkr } from '../lib/utils'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [seekerSub, setSeekerSub] = useState<SeekerSubscription | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [preferredAt, setPreferredAt] = useState('')
  const [viewNote, setViewNote] = useState('')
  const [viewMsg, setViewMsg] = useState<string | null>(null)
  const [inquiryMsg, setInquiryMsg] = useState('')
  const [inquiryOk, setInquiryOk] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ListingReview[]>([])
  const [rating, setRating] = useState(5)
  const [reviewBody, setReviewBody] = useState('')
  const [reviewOk, setReviewOk] = useState<string | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const [detail, published] = await Promise.all([
          fetchListing(id!),
          fetchListingReviews(id!),
        ])
        if (!cancelled) {
          setListing(detail)
          setReviews(published)
        }
        if (user?.role === 'SEEKER') {
          const sub = await fetchSeekerSubscription()
          if (!cancelled) setSeekerSub(sub)
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load listing')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id, user?.id])

  async function reveal() {
    if (!id) return
    setBusy(true)
    setError(null)
    try {
      setListing(await unlockListingContact(id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unlock failed')
    } finally {
      setBusy(false)
    }
  }

  async function sendInquiry(e: FormEvent) {
    e.preventDefault()
    if (!id || !inquiryMsg.trim()) return
    setBusy(true)
    setInquiryOk(null)
    setError(null)
    try {
      const created = await createInquiry({
        listingId: id,
        message: inquiryMsg.trim(),
      })
      setInquiryOk(`Inquiry sent (${created.listingPublicCode}).`)
      setInquiryMsg('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inquiry failed')
    } finally {
      setBusy(false)
    }
  }

  async function sendReview(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setBusy(true)
    setReviewOk(null)
    setError(null)
    try {
      const created = await createListingReview({
        listingId: id,
        rating,
        body: reviewBody.trim(),
      })
      setReviewOk(
        created.status === 'PUBLISHED'
          ? 'Thanks — your review is live.'
          : 'Thanks — low ratings wait for a quick admin check before going public.',
      )
      setReviewBody('')
      setReviews(await fetchListingReviews(id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Review failed')
    } finally {
      setBusy(false)
    }
  }

  async function requestViewing(e: FormEvent) {
    e.preventDefault()
    if (!id || !preferredAt) return
    setBusy(true)
    setViewMsg(null)
    setError(null)
    try {
      const preferredAtUtc = new Date(preferredAt).toISOString()
      await createViewingRequest(id, {
        preferredAtUtc,
        note: viewNote || undefined,
      })
      setViewMsg('Viewing request sent to the advertiser.')
      setViewNote('')
      if (user?.role === 'SEEKER') setSeekerSub(await fetchSeekerSubscription())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viewing request failed')
    } finally {
      setBusy(false)
    }
  }

  if (error && !listing) {
    return (
      <div>
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
        <Link
          to="/browse"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to search
        </Link>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-3/4 max-w-xl" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    )
  }

  const canUnlock = user?.role === 'SEEKER' || user?.role === 'ADMIN'
  const primaryImage =
    listing.imageUrls && listing.imageUrls.length > 0
      ? listing.imageUrls[0]
      : null

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        to="/browse"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted no-underline hover:text-accent-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to search
      </Link>

      <PageHeader
        eyebrow={listing.publicCode}
        title={listing.title}
        description={`${listing.city}, ${listing.district}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={listing.adType === 'LEASE' ? 'info' : 'default'}>
              {listing.adType}
            </Badge>
            <Badge variant="verified">Reviewed</Badge>
            <p className="font-display text-2xl font-bold tabular-nums text-ink">
              {formatLkr(listing.priceLkrMonth)}
              <span className="ml-1 text-sm font-medium text-muted">/month</span>
            </p>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="glass-panel overflow-hidden rounded-2xl">
            <button
              type="button"
              className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
              onClick={() => primaryImage && setLightboxSrc(primaryImage)}
              aria-label="Open gallery image"
              disabled={!primaryImage}
            >
              <ListingCover
                imageUrls={listing.imageUrls}
                alt={listing.title}
                rounded="none"
                overlay="glass"
                className="aspect-[16/9] sm:aspect-[21/9]"
              />
            </button>
            {(listing.imageUrls?.length ?? 0) > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {listing.imageUrls.map((url) => (
                  <button
                    key={url}
                    type="button"
                    className="shrink-0 border-0 bg-transparent p-0"
                    onClick={() => setLightboxSrc(url)}
                    aria-label="Open image"
                  >
                    <SafeImage
                      src={url}
                      alt=""
                      overlay="glass"
                      className="h-16 w-24 rounded-lg ring-1 ring-[var(--color-glass-border)]"
                      fallback={
                        <div className="h-16 w-24 shrink-0 rounded-lg bg-surface ring-1 ring-line" />
                      }
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:row-span-2 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent" aria-hidden />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!user && (
                <Link
                  to={loginWithNext(`/listings/${id}`)}
                  className={cn(
                    buttonVariants({ variant: 'primary' }),
                    'w-full bg-accent text-on-accent hover:brightness-105',
                  )}
                >
                  Sign in to view contact
                </Link>
              )}
              {user?.role === 'ADVERTISER' && (
                <p className="text-sm text-muted">
                  Advertiser accounts cannot unlock renter contact on listings.
                </p>
              )}
              {canUnlock && !listing.contactUnlocked && (
                <Button
                  type="button"
                  loading={busy}
                  className="w-full bg-accent text-on-accent hover:brightness-105"
                  onClick={() => void reveal()}
                >
                  {busy ? 'Unlocking…' : 'Reveal phone & address'}
                </Button>
              )}
              {listing.contactUnlocked && (
                <>
                  <div className="glass-panel-dense rounded-xl p-4 text-sm">
                    <p>
                      <span className="font-semibold text-ink">Phone</span>{' '}
                      {listing.contactPhone}
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold text-ink">Address</span>{' '}
                      {listing.locationDescription}
                    </p>
                  </div>
                  {user?.role === 'SEEKER' && !inquiryOk && (
                    <p className="text-sm text-muted">
                      Next: send an inquiry below — then WhatsApp from Inbox.
                    </p>
                  )}
                </>
              )}
              {error && <Alert variant="error">{error}</Alert>}
            </CardContent>
          </Card>

          {user?.role === 'SEEKER' && (
            <Card
              className={
                listing.contactUnlocked
                  ? 'border-accent/40 ring-1 ring-accent/25'
                  : undefined
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" aria-hidden />
                  Send an inquiry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted">
                  Message the landlord first — then open WhatsApp from{' '}
                  <Link to="/inbox" className="font-semibold text-accent-text">
                    My inquiries
                  </Link>{' '}
                  (rate-limited).
                </p>
                {inquiryOk ? (
                  <NextStepPanel
                    title="Inquiry sent"
                    body="Open Inbox to continue on WhatsApp when you are ready."
                    primary={{ label: 'Open inquiries', to: '/inbox' }}
                    secondary={{ label: 'Keep browsing', to: '/browse' }}
                  />
                ) : (
                  <form
                    className="grid gap-4"
                    onSubmit={(e) => void sendInquiry(e)}
                  >
                    <Label required>
                      Message
                      <Textarea
                        rows={3}
                        required
                        minLength={10}
                        maxLength={2000}
                        value={inquiryMsg}
                        onChange={(e) => setInquiryMsg(e.target.value)}
                        placeholder="Hi — is this still available for next month?"
                      />
                    </Label>
                    <Button
                      type="submit"
                      loading={busy}
                      className="bg-accent text-on-accent hover:brightness-105"
                    >
                      {busy ? 'Sending…' : 'Send inquiry'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {user?.role === 'SEEKER' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-accent" aria-hidden />
                  Request a viewing
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!seekerSub?.isPremium ? (
                  <p className="text-sm text-muted">
                    Viewing slots are a Plus/Pro feature.{' '}
                    <Link to="/pricing" className="font-semibold text-accent-text">
                      Upgrade
                    </Link>
                  </p>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-muted">
                      {seekerSub.viewingRequestsRemaining} of{' '}
                      {seekerSub.viewingRequestQuota} requests left this period.
                    </p>
                    <form
                      className="grid gap-4"
                      onSubmit={(e) => void requestViewing(e)}
                    >
                      <Label required>
                        Preferred date & time
                        <Input
                          type="datetime-local"
                          required
                          value={preferredAt}
                          onChange={(e) => setPreferredAt(e.target.value)}
                        />
                      </Label>
                      <Label>
                        Note (optional)
                        <Input
                          value={viewNote}
                          onChange={(e) => setViewNote(e.target.value)}
                          maxLength={500}
                          placeholder="Weekday evenings preferred"
                        />
                      </Label>
                      <Button type="submit" loading={busy}>
                        {busy ? 'Sending…' : 'Send viewing request'}
                      </Button>
                    </form>
                    {viewMsg && (
                      <Alert variant="success" className="mt-3">
                        {viewMsg}
                      </Alert>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <p className="text-base leading-relaxed text-ink">
                {listing.description}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-accent" aria-hidden />
                  {listing.bedrooms} bed · {listing.bathrooms} bath
                </span>
                {listing.furniture && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 ring-1 ring-line">
                    {listing.furniture}
                  </span>
                )}
                {listing.parking && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 ring-1 ring-line">
                    Parking: {listing.parking}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent" aria-hidden />
                  {listing.city}, {listing.district}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted">
                Neighborhood: boarding near {listing.city} · {listing.district}{' '}
                corridor — unlock when you’re ready to visit.
              </p>
              <TrustStrip dense className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" aria-hidden />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 ? (
                <div className="space-y-4 py-2">
                  <p className="text-sm text-muted">
                    No published reviews yet — StaySpot still protects you with
                    the same marketplace rules.
                  </p>
                  <TrustStrip />
                </div>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((r) => (
                    <li
                      key={r.id}
                      className="glass-panel-dense rounded-xl p-4"
                    >
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge variant="success">{r.rating}/5</Badge>
                        <span className="text-sm text-muted">
                          {r.seekerDisplayName || 'Seeker'} ·{' '}
                          {new Date(r.createdAtUtc).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-ink">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              {user?.role === 'SEEKER' && (
                <form
                  className="grid gap-4 border-t border-[var(--color-glass-border)] pt-4"
                  onSubmit={(e) => void sendReview(e)}
                >
                  <p className="text-sm text-muted">
                    After you inquire or unlock contact, leave a short review.
                    Ratings 3–5 publish immediately; 1–2 need admin moderation.
                  </p>
                  <Label>
                    Rating
                    <Select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label required>
                    Review
                    <Textarea
                      rows={3}
                      required
                      minLength={10}
                      maxLength={1000}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="Honest note for the next renter…"
                    />
                  </Label>
                  <Button type="submit" loading={busy} className="w-fit">
                    {busy ? 'Sending…' : 'Submit review'}
                  </Button>
                  {reviewOk && <Alert variant="success">{reviewOk}</Alert>}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-teal-deep/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={() => setLightboxSrc(null)}
        >
          <div
            className="glass-panel relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-full bg-surface/80 p-2 text-ink ring-1 ring-line"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <SafeImage
              src={lightboxSrc}
              alt={listing.title}
              overlay="glass"
              className="max-h-[85vh] w-full rounded-xl object-contain"
              fallback={
                <div className="flex h-64 w-full items-center justify-center bg-surface text-muted">
                  Image unavailable
                </div>
              }
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
