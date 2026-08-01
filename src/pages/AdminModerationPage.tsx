import { Check, ClipboardCheck, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  approveListing,
  fetchAdminListings,
  rejectListing,
  type AdminListing,
} from '../api'
import { illustrations } from '../assets/illustrations'
import { useAuth } from '../AuthContext'
import { Badge, statusBadgeVariant } from '../components/ui/badge'
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
import { Label, Select, Textarea } from '../components/ui/input'
import { MotionFade } from '../components/ui/motion'
import { SafeImage } from '../components/ui/safe-image'
import { fadeIn, softTransition } from '../lib/motion'
import { cn, formatLkr } from '../lib/utils'

const REASON_CODES = [
  'PHOTOS_QUALITY',
  'LOCATION_MISMATCH',
  'PRICE_SUSPECT',
  'CONTACT_INVALID',
  'POLICY_CONTENT',
  'DUPLICATE',
  'OTHER',
] as const

export function AdminModerationPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<AdminListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [rejectFor, setRejectFor] = useState<string | null>(null)
  const [reasonCode, setReasonCode] = useState<string>('PHOTOS_QUALITY')
  const [note, setNote] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setItems(await fetchAdminListings('PENDING'))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return
    void load()
  }, [user])

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') {
    return (
      <div>
        <Alert variant="error" className="mb-4">
          Admin moderation is restricted.
        </Alert>
        <Link to="/browse" className={cn(buttonVariants({ variant: 'outline' }))}>
          Home
        </Link>
      </div>
    )
  }

  async function onApprove(id: string) {
    setBusyId(id)
    setError(null)
    try {
      await approveListing(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Approve failed')
    } finally {
      setBusyId(null)
    }
  }

  async function onReject(id: string) {
    setBusyId(id)
    setError(null)
    try {
      await rejectListing(id, reasonCode, note)
      setItems((prev) => prev.filter((x) => x.id !== id))
      setRejectFor(null)
      setNote('')
      setReasonCode('PHOTOS_QUALITY')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reject failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <MotionFade>
      <PageHeader
        eyebrow="Admin console"
        title="Ad Postings"
        description="Review pending boarding places. Approve to publish publicly (still no guest contact). Reject with a reason for My Ads."
        actions={
          <Link
            to="/admin/analytics"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Analytics
          </Link>
        }
      />

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      )}
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}
      {!loading && items.length === 0 && (
        <EmptyState
          icon={ClipboardCheck}
          title="Queue is clear"
          description="No pending listings in the moderation queue."
          illustration={illustrations.emptyModeration}
        />
      )}

      <motion.div
        className="grid gap-5"
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={softTransition}
      >
        {items.map((item) => (
          <Card key={item.id} dense>
            <CardHeader className="gap-1 p-4 pb-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <code className="rounded bg-surface px-1.5 py-0.5 text-xs ring-1 ring-line">
                  {item.publicCode}
                </code>
                <Badge variant={item.adType === 'LEASE' ? 'info' : 'default'}>
                  {item.adType}
                </Badge>
                <Badge variant={statusBadgeVariant(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <p className="text-sm tabular-nums text-muted">
                {item.city}, {item.district} · {formatLkr(item.priceLkrMonth)}/mo
              </p>
              <p className="text-sm text-muted">
                By {item.advertiserDisplayName} ({item.advertiserEmail})
              </p>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <p className="text-sm leading-relaxed text-ink">{item.description}</p>
              <p className="text-sm text-muted">
                {item.bedrooms} bed · {item.bathrooms} bath · {item.contactPhone}
              </p>
              <p className="text-sm text-muted">{item.locationDescription}</p>
              {item.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.imageUrls.map((url) => (
                    <SafeImage
                      key={url}
                      src={url}
                      alt=""
                      className="h-20 w-28 rounded-lg object-cover ring-1 ring-line"
                      fallback={
                        <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-surface text-xs text-muted ring-1 ring-line">
                          Broken
                        </div>
                      }
                    />
                  ))}
                </div>
              )}

              {rejectFor === item.id && (
                <div className="grid gap-3 glass-panel-dense rounded-xl p-3">
                  <Label>
                    Reason code
                    <Select
                      value={reasonCode}
                      onChange={(e) => setReasonCode(e.target.value)}
                    >
                      {REASON_CODES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Note {reasonCode === 'OTHER' ? '(min 20 chars)' : '(optional)'}
                    <Textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Explain what the advertiser should fix"
                    />
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      loading={busyId === item.id}
                      onClick={() => void onReject(item.id)}
                    >
                      <X className="h-4 w-4" aria-hidden />
                      Confirm reject
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRejectFor(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {rejectFor !== item.id && (
              <CardFooter className="gap-2 p-4 pt-0">
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  loading={busyId === item.id}
                  onClick={() => void onApprove(item.id)}
                >
                  <Check className="h-4 w-4" aria-hidden />
                  {busyId === item.id ? 'Working…' : 'Approve'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busyId === item.id}
                  onClick={() => {
                    setRejectFor(item.id)
                    setReasonCode('PHOTOS_QUALITY')
                    setNote('')
                  }}
                >
                  <X className="h-4 w-4" aria-hidden />
                  Reject
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </motion.div>
    </MotionFade>
  )
}
