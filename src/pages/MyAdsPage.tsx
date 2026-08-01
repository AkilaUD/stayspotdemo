import {
  Archive,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  PlusCircle,
  Rocket,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  boostListing,
  downloadListingAgreement,
  fetchAdvertiserListings,
  fetchAdvertiserSubscription,
  markListingRented,
  type AdvertiserListing,
  type AdvertiserListingCounts,
  type AdvertiserSubscription,
} from '../api'
import { illustrations } from '../assets/illustrations'
import { useAuth } from '../AuthContext'
import { Badge, statusBadgeVariant } from '../components/ui/badge'
import { Button, buttonVariants } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import {
  Alert,
  EmptyState,
  PageHeader,
  Skeleton,
} from '../components/ui/feedback'
import { MotionFade } from '../components/ui/motion'
import { SafeImage } from '../components/ui/safe-image'
import { cn, formatLkr } from '../lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function statusLabel(status: string) {
  switch (status) {
    case 'PENDING':
      return 'UNDER REVIEW'
    case 'APPROVED':
      return 'Approved'
    case 'REJECTED':
      return 'Rejected'
    case 'ARCHIVED':
      return 'Rented / archived'
    case 'DRAFT':
      return 'Draft'
    default:
      return status
  }
}

export function MyAdsPage() {
  const { user } = useAuth()
  const [counts, setCounts] = useState<AdvertiserListingCounts | null>(null)
  const [items, setItems] = useState<AdvertiserListing[]>([])
  const [subscription, setSubscription] = useState<AdvertiserSubscription | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [boostBusy, setBoostBusy] = useState<string | null>(null)
  const [rentBusy, setRentBusy] = useState<string | null>(null)

  async function reload() {
    const [data, sub] = await Promise.all([
      fetchAdvertiserListings(),
      fetchAdvertiserSubscription(),
    ])
    setCounts(data.counts)
    setItems(data.items)
    setSubscription(sub)
  }

  useEffect(() => {
    if (!user || user.role !== 'ADVERTISER') return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        await reload()
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load My Ads')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  async function onBoost(id: string, scope: 'DISTRICT' | 'ISLAND') {
    setBoostBusy(`${id}-${scope}`)
    setError(null)
    try {
      await boostListing(id, scope)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Boost failed')
    } finally {
      setBoostBusy(null)
    }
  }

  async function onMarkRented(id: string) {
    if (
      !window.confirm(
        'Mark this listing as rented? It will leave the public feed.',
      )
    )
      return
    setRentBusy(id)
    setError(null)
    try {
      const result = await markListingRented(id)
      await reload()
      await downloadListingAgreement(result.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Mark rented failed')
    } finally {
      setRentBusy(null)
    }
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADVERTISER') {
    return (
      <div>
        <Alert variant="error" className="mb-4">
          My Ads is only available to advertisers.
        </Alert>
        <Link to="/browse" className={cn(buttonVariants({ variant: 'outline' }))}>
          Home
        </Link>
      </div>
    )
  }

  return (
    <MotionFade>
      <PageHeader
        eyebrow="Advertiser console"
        title="My Ads"
        description="Track review status for every boarding place you submitted."
        actions={
          <>
            <Link
              to="/pricing"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Plans
            </Link>
            <Link
              to="/advertiser/publish"
              className={cn(buttonVariants({ variant: 'primary' }))}
            >
              <PlusCircle className="h-4 w-4" aria-hidden />
              Create an Ad
            </Link>
          </>
        }
      />

      {subscription && (
        <Card className="mb-6">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
            <div>
              <p className="font-semibold text-ink">{subscription.planName}</p>
              <p className="text-sm text-muted">
                {subscription.slotsUsed}/{subscription.listingSlots} live+pending
                slots
              </p>
              <p className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-accent/15 px-2.5 py-1 font-semibold text-ink ring-1 ring-accent/30">
                  District boosts: {subscription.boostCreditsDistrict}
                </span>
                <span className="rounded-full bg-accent/15 px-2.5 py-1 font-semibold text-ink ring-1 ring-accent/30">
                  Island boosts: {subscription.boostCreditsIsland}
                </span>
              </p>
            </div>
            {subscription.slotsRemaining <= 1 && (
              <Link
                to="/pricing"
                className={cn(
                  buttonVariants({ variant: 'primary', size: 'sm' }),
                  'bg-accent text-on-accent hover:brightness-105',
                )}
              >
                {subscription.slotsRemaining === 0
                  ? 'Upgrade to publish more'
                  : 'Low on slots — see Growth'}
              </Link>
            )}
            {(subscription.boostCreditsDistrict ?? 0) +
              (subscription.boostCreditsIsland ?? 0) ===
              0 &&
              subscription.slotsRemaining > 1 && (
                <Link
                  to="/pricing"
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  Get boost credits
                </Link>
              )}
          </CardContent>
        </Card>
      )}

      {counts && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Pending',
              value: counts.pending,
              icon: Clock3,
              tone: 'text-amber-700',
            },
            {
              label: 'Approved',
              value: counts.approved,
              icon: CheckCircle2,
              tone: 'text-trust',
            },
            {
              label: 'Rejected',
              value: counts.rejected,
              icon: XCircle,
              tone: 'text-red-700',
            },
            {
              label: 'Total',
              value: counts.total,
              icon: LayoutDashboard,
              tone: 'text-teal',
            },
          ].map((c) => (
            <Card key={c.label} className="hover:shadow-sm">
              <CardContent className="flex items-center gap-3 pt-5">
                <div className={cn('rounded-xl bg-surface p-2 ring-1 ring-line', c.tone)}>
                  <c.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tabular-nums text-ink">
                    {c.value}
                  </p>
                  <p className="text-sm text-muted">{c.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={LayoutDashboard}
          title="Your first boarding place starts here"
          description="Publish a room for review — you’re not alone; landlords across Sri Lanka use the same calm queue."
          illustration={illustrations.emptyAds}
          suggestions={[
            { label: 'See Growth plans', to: '/pricing' },
            { label: 'How review works', to: '/#how-it-works' },
          ]}
          action={
            <Link
              to="/advertiser/publish"
              className={cn(
                buttonVariants({ variant: 'primary' }),
                'bg-accent text-on-accent hover:brightness-105',
              )}
            >
              Publish your first boarding place
            </Link>
          }
        />
      )}

      {items.length > 0 && (
        <div className="glass-panel overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[880px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[var(--color-glass-surface)] backdrop-blur">
              <tr className="border-b border-[var(--color-glass-border)] text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Ad name</th>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Boost</th>
                <th className="px-4 py-3 font-semibold">Close</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ad) => (
                <tr
                  key={ad.id}
                  className="border-b border-[var(--color-glass-border)]/70 align-top last:border-0 hover:bg-[var(--color-glass-surface)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <SafeImage
                        src={ad.imageUrls?.[0]}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded-lg object-cover ring-1 ring-line"
                        fallback={
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-surface text-[10px] text-muted ring-1 ring-line">
                            No photo
                          </div>
                        }
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-ink">{ad.title}</div>
                    {ad.status === 'REJECTED' && (
                      <p className="mt-1 text-xs text-warning">
                        {ad.rejectionReasonCode || ad.rejectionNote
                          ? `${ad.rejectionReasonCode ?? ''}${ad.rejectionNote ? ` — ${ad.rejectionNote}` : ''}`
                          : 'Rejected (reason will appear after admin moderation).'}
                      </p>
                    )}
                    {ad.archiveReason === 'RENTED' && ad.rentedAtUtc && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                        <Archive className="h-3 w-3" aria-hidden />
                        Marked rented {formatDate(ad.rentedAtUtc)}
                      </p>
                    )}
                    {ad.isBoosted && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                        <Rocket className="h-3 w-3" aria-hidden />
                        Active {ad.activeBoostScope} boost
                        {ad.boostEndsAtUtc
                          ? ` until ${formatDate(ad.boostEndsAtUtc)}`
                          : ''}
                      </p>
                    )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-surface px-1.5 py-0.5 text-xs ring-1 ring-line">
                      {ad.publicCode}
                    </code>
                  </td>
                  <td className="px-4 py-3">{ad.adType}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatLkr(ad.priceLkrMonth)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(ad.createdAtUtc)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(ad.status)}>
                      {statusLabel(ad.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {ad.status === 'APPROVED' ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={
                              !!boostBusy ||
                              !!subscription?.boostsFrozen ||
                              (subscription?.boostCreditsDistrict ?? 0) <= 0
                            }
                            loading={boostBusy === `${ad.id}-DISTRICT`}
                            onClick={() => void onBoost(ad.id, 'DISTRICT')}
                          >
                            {boostBusy === `${ad.id}-DISTRICT`
                              ? '…'
                              : 'Boost district'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={
                              !!boostBusy ||
                              !!subscription?.boostsFrozen ||
                              (subscription?.boostCreditsIsland ?? 0) <= 0
                            }
                            loading={boostBusy === `${ad.id}-ISLAND`}
                            onClick={() => void onBoost(ad.id, 'ISLAND')}
                          >
                            {boostBusy === `${ad.id}-ISLAND`
                              ? '…'
                              : 'Boost island-wide'}
                          </Button>
                        </div>
                        <p className="text-[11px] text-muted">
                          Appear higher in local browse
                        </p>
                      </div>
                    ) : ad.status === 'PENDING' ? (
                      <p className="max-w-[11rem] text-[11px] text-muted">
                        After approval you can run a district boost
                      </p>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {ad.status === 'APPROVED' ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={!!rentBusy}
                        loading={rentBusy === ad.id}
                        onClick={() => void onMarkRented(ad.id)}
                      >
                        {rentBusy === ad.id ? '…' : 'Mark rented'}
                      </Button>
                    ) : ad.status === 'ARCHIVED' &&
                      ad.archiveReason === 'RENTED' ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => void downloadListingAgreement(ad.id)}
                      >
                        Agreement
                      </Button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MotionFade>
  )
}
