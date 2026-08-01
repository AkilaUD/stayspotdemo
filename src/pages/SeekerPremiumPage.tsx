import { Bookmark, CalendarClock, Search, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  createSavedSearch,
  deleteSavedSearch,
  fetchSavedSearches,
  fetchSeekerSubscription,
  fetchViewingRequests,
  type SavedSearch,
  type SeekerSubscription,
  type ViewingRequest,
} from '../api'
import { illustrations } from '../assets/illustrations'
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
  EmptyState,
  PageHeader,
  Skeleton,
} from '../components/ui/feedback'
import { Input, Label } from '../components/ui/input'
import { MotionFade } from '../components/ui/motion'
import { cn } from '../lib/utils'

export function SeekerPremiumPage() {
  const { user, loading } = useAuth()
  const [sub, setSub] = useState<SeekerSubscription | null>(null)
  const [searches, setSearches] = useState<SavedSearch[]>([])
  const [viewings, setViewings] = useState<ViewingRequest[]>([])
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('')
  const [busy, setBusy] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  async function reload() {
    const [s, saved, views] = await Promise.all([
      fetchSeekerSubscription(),
      fetchSavedSearches(),
      fetchViewingRequests(),
    ])
    setSub(s)
    setSearches(saved)
    setViewings(views)
  }

  useEffect(() => {
    if (user?.role !== 'SEEKER') return
    let cancelled = false
    ;(async () => {
      try {
        setPageLoading(true)
        await reload()
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load premium')
      } finally {
        if (!cancelled) setPageLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'SEEKER') return <Navigate to="/" replace />

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await createSavedSearch({
        name,
        query: query || undefined,
        district: district || undefined,
      })
      setName('')
      setQuery('')
      setDistrict('')
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save search')
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(id: string) {
    setError(null)
    try {
      await deleteSavedSearch(id)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <MotionFade>
      <PageHeader
        eyebrow="Seeker Premium"
        title="Saved searches & viewing requests"
        description="Plus and Pro unlock alerts tools and viewing slots. Free seekers can still browse and unlock contact after login."
      />

      {sub && (
        <Alert variant="info" className="mb-6">
          Current: <strong>{sub.planName}</strong> ({sub.status}) · saved{' '}
          {sub.savedSearchesUsed}/{sub.savedSearchLimit} · viewings{' '}
          {sub.viewingRequestsUsed}/{sub.viewingRequestQuota}
          {!sub.isPremium && (
            <>
              {' '}
              ·{' '}
              <Link to="/pricing" className="font-semibold text-accent">
                Upgrade to Plus
              </Link>
            </>
          )}
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {pageLoading && (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      )}

      {!pageLoading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-accent" aria-hidden />
                Saved searches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {!sub?.isPremium ? (
                <p className="text-sm text-muted">
                  Free plan cannot create saved searches.{' '}
                  <Link to="/pricing" className="font-semibold text-accent">
                    Upgrade with PayHere
                  </Link>
                </p>
              ) : (
                <form
                  className="grid gap-3 glass-panel-dense rounded-xl p-4"
                  onSubmit={(e) => void onCreate(e)}
                >
                  <Label required>
                    Name
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={120}
                      placeholder="Near campus under 40k"
                    />
                  </Label>
                  <Label>
                    Keywords
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="shared, AC"
                    />
                  </Label>
                  <Label>
                    District
                    <Input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Colombo"
                    />
                  </Label>
                  <Button type="submit" loading={busy} className="w-fit">
                    {busy ? 'Saving…' : 'Save search'}
                  </Button>
                </form>
              )}

              {searches.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Save a search when you’re ready"
                  description="Pin a district or campus filter on Plus/Pro — we’ll keep it warm for next time."
                  illustration={illustrations.emptySaved}
                  suggestions={[
                    { label: 'Browse listings', to: '/browse' },
                    { label: 'See Plus', to: '/pricing' },
                  ]}
                />
              ) : (
                <ul className="space-y-3">
                  {searches.map((s) => (
                    <li
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-3 glass-panel-dense rounded-xl p-3"
                    >
                      <div>
                        <p className="font-semibold text-ink">{s.name}</p>
                        <p className="text-sm text-muted">
                          {[s.district, s.query, s.adType]
                            .filter(Boolean)
                            .join(' · ') || 'Any filters'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/browse?${new URLSearchParams({
                            ...(s.query ? { q: s.query } : {}),
                            ...(s.district ? { district: s.district } : {}),
                            ...(s.adType ? { adType: s.adType } : {}),
                          }).toString()}`}
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                          )}
                        >
                          Run
                        </Link>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void onDelete(s.id)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-accent" aria-hidden />
                Your viewing requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewings.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No viewing slots booked yet"
                  description="When a room feels right, request a viewing from the listing — we’ll keep the trail here."
                  illustration={illustrations.emptyViewings}
                  suggestions={[{ label: 'Browse rooms', to: '/browse' }]}
                  action={
                    <Link
                      to="/browse"
                      className={cn(
                        buttonVariants({ variant: 'primary' }),
                        'bg-accent text-[#132A22] hover:brightness-105',
                      )}
                    >
                      Browse listings
                    </Link>
                  }
                />
              ) : (
                <ul className="space-y-3">
                  {viewings.map((v) => (
                    <li
                      key={v.id}
                      className="flex flex-wrap items-center justify-between gap-3 glass-panel-dense rounded-xl p-3"
                    >
                      <div>
                        <p className="font-semibold text-ink">{v.listingTitle}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                          <code className="rounded bg-surface px-1.5 py-0.5 text-xs ring-1 ring-line">
                            {v.listingPublicCode}
                          </code>
                          <Badge variant="info">{v.status}</Badge>
                          <span>
                            {new Date(v.preferredAtUtc).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/listings/${v.listingId}`}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                        )}
                      >
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </MotionFade>
  )
}
