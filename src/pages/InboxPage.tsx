import { Inbox, MessageCircle } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  fetchInquiries,
  openInquiryWhatsApp,
  replyInquiry,
  type Inquiry,
} from '../api'
import { illustrations } from '../assets/illustrations'
import { useAuth } from '../AuthContext'
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
import {
  InquiryStatusStepper,
  type InquiryStep,
} from '../components/ui/inquiry-status-stepper'
import { Label, Textarea } from '../components/ui/input'
import { MotionFade } from '../components/ui/motion'
import { cn } from '../lib/utils'

/** Map Inquiry DTO → stepper step using only real fields. */
function inquiryStep(item: Inquiry): InquiryStep {
  if (item.whatsAppOpenCount > 0) return 'whatsapp'
  if (item.replyMessage || item.repliedAtUtc) return 'unlocked'
  return 'reviewed'
}

export function InboxPage() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState<Inquiry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)
  const [listLoading, setListLoading] = useState(true)

  const isAdvertiser = user?.role === 'ADVERTISER'
  const isSeeker = user?.role === 'SEEKER'

  async function reload() {
    setItems(await fetchInquiries())
  }

  useEffect(() => {
    if (!isAdvertiser && !isSeeker) return
    let cancelled = false
    ;(async () => {
      try {
        setListLoading(true)
        await reload()
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load inquiries')
      } finally {
        if (!cancelled) setListLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id, isAdvertiser, isSeeker])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!isAdvertiser && !isSeeker) return <Navigate to="/" replace />

  async function onReply(e: FormEvent, id: string) {
    e.preventDefault()
    const message = (replyDrafts[id] ?? '').trim()
    if (!message) return
    setBusyId(id)
    setError(null)
    try {
      await replyInquiry(id, message)
      setReplyDrafts((prev) => ({ ...prev, [id]: '' }))
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reply failed')
    } finally {
      setBusyId(null)
    }
  }

  async function onWhatsApp(id: string) {
    setBusyId(id)
    setError(null)
    try {
      const link = await openInquiryWhatsApp(id)
      window.open(link.url, '_blank', 'noopener,noreferrer')
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'WhatsApp link failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <MotionFade>
      <PageHeader
        eyebrow={isAdvertiser ? 'Advertiser' : 'Seeker'}
        title={isAdvertiser ? 'Inquiry inbox' : 'My inquiries'}
        description={
          isAdvertiser
            ? 'Leads land here before WhatsApp. Reply in-app, then open a rate-limited WhatsApp handoff.'
            : 'Messages you sent to landlords. Open WhatsApp after the inquiry is logged (5 opens / 24h).'
        }
      />

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {listLoading && (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      )}

      {!listLoading && items.length === 0 && (
        <EmptyState
          icon={Inbox}
          title={
            isAdvertiser
              ? 'Your inbox is waiting for the first hello'
              : 'No conversations yet — that’s okay'
          }
          description={
            isAdvertiser
              ? 'Live, reviewed ads attract inquiries. Publish or boost so seekers can find you.'
              : 'Browse a room you like, unlock contact, then send a short inquiry. We’ll keep the trail here.'
          }
          illustration={illustrations.emptyInbox}
          suggestions={
            isAdvertiser
              ? [
                  { label: 'Create an Ad', to: '/advertiser/publish' },
                  { label: 'Plans & boosts', to: '/pricing' },
                ]
              : [
                  { label: 'Browse Colombo', to: '/browse?district=Colombo' },
                  { label: 'All listings', to: '/browse' },
                ]
          }
          action={
            isAdvertiser ? (
              <Link
                to="/advertiser/publish"
                className={cn(
                  buttonVariants({ variant: 'primary' }),
                  'bg-accent text-on-accent hover:brightness-105',
                )}
              >
                Create an Ad
              </Link>
            ) : (
              <Link
                to="/browse"
                className={cn(
                  buttonVariants({ variant: 'primary' }),
                  'bg-accent text-on-accent hover:brightness-105',
                )}
              >
                Browse listings
              </Link>
            )
          }
        />
      )}

      <ul className="grid gap-4">
        {items.map((item) => (
          <li key={item.id}>
            <Card>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div className="min-w-0">
                  <CardTitle className="text-lg">{item.listingTitle}</CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                    <code className="rounded bg-base px-1.5 py-0.5 text-xs ring-1 ring-line">
                      {item.listingPublicCode}
                    </code>
                    <span>
                      {item.listingCity}, {item.listingDistrict}
                    </span>
                    <Badge variant="info">{item.status}</Badge>
                  </div>
                  <InquiryStatusStepper
                    current={inquiryStep(item)}
                    className="mt-3"
                  />
                </div>
                <Link
                  to={`/listings/${item.listingId}`}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                  )}
                >
                  Listing
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {isAdvertiser && (
                  <p className="text-sm text-muted">
                    From {item.seekerDisplayName || 'Seeker'}
                  </p>
                )}
                <p className="glass-panel-dense rounded-xl p-3 text-sm text-ink">
                  {item.message}
                </p>
                {item.replyMessage && (
                  <Alert variant="success">
                    <strong>Reply:</strong> {item.replyMessage}
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    loading={busyId === item.id}
                    onClick={() => void onWhatsApp(item.id)}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    {busyId === item.id ? 'Opening…' : 'Chat on WhatsApp'}
                  </Button>
                  <span className="text-sm tabular-nums text-muted">
                    WA opens: {item.whatsAppOpenCount}
                  </span>
                </div>
                {isAdvertiser && (
                  <form
                    className="grid gap-3 border-t border-[var(--color-glass-border)] pt-4"
                    onSubmit={(e) => void onReply(e, item.id)}
                  >
                    <Label required>
                      Reply
                      <Textarea
                        rows={2}
                        value={replyDrafts[item.id] ?? ''}
                        onChange={(e) =>
                          setReplyDrafts((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        placeholder="Thanks — evenings work for a viewing."
                        maxLength={2000}
                        required
                      />
                    </Label>
                    <Button
                      type="submit"
                      className="w-fit"
                      loading={busyId === item.id}
                    >
                      Send reply
                    </Button>
                  </form>
                )}
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </MotionFade>
  )
}
