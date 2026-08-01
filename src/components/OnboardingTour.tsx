import {
  BarChart3,
  ClipboardCheck,
  Inbox,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Search,
  Sparkles,
  Tag,
  type LucideIcon,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Button } from './ui/button'

const OPEN_MOBILE_NAV_EVENT = 'stayspot:open-mobile-nav'
const PAD = 8

type TourStep = {
  title: string
  body: string
  ctaLabel: string
  ctaTo: string
  icon: LucideIcon
  target: string
}

type Rect = { top: number; left: number; width: number; height: number }

function storageKey(userId: string) {
  return `stayspot.onboarding.v1.${userId}`
}

function stepsForRole(role: string): TourStep[] {
  switch (role.toUpperCase()) {
    case 'ADVERTISER':
      return [
        {
          title: 'Publish your first ad',
          body: 'Share room details, photos, and rent so the right seekers can find you.',
          ctaLabel: 'Create an ad',
          ctaTo: '/advertiser/publish',
          icon: PlusCircle,
          target: 'nav-publish',
        },
        {
          title: 'Wait for a quick review',
          body: 'New ads go through a short check. Track status anytime under My Ads.',
          ctaLabel: 'Open My Ads',
          ctaTo: '/advertiser/ads',
          icon: LayoutDashboard,
          target: 'nav-ads',
        },
        {
          title: 'Reply to interested seekers',
          body: 'When someone unlocks contact or sends a message, it lands in your Inbox.',
          ctaLabel: 'Go to Inbox',
          ctaTo: '/inbox',
          icon: Inbox,
          target: 'nav-inbox',
        },
        {
          title: 'Plans and boosts',
          body: 'Upgrade when you are ready for more visibility and featured placement.',
          ctaLabel: 'View plans',
          ctaTo: '/pricing',
          icon: Tag,
          target: 'nav-pricing',
        },
      ]
    case 'ADMIN':
      return [
        {
          title: 'Analytics overview',
          body: 'See marketplace health at a glance — listings, users, and activity.',
          ctaLabel: 'Open analytics',
          ctaTo: '/admin/analytics',
          icon: BarChart3,
          target: 'nav-analytics',
        },
        {
          title: 'Ad Postings queue',
          body: 'Approve or reject new ads so only trustworthy listings go live.',
          ctaLabel: 'Review postings',
          ctaTo: '/admin/postings',
          icon: ClipboardCheck,
          target: 'nav-postings',
        },
      ]
    default:
      return [
        {
          title: 'Browse rooms near you',
          body: 'Filter by city, budget, and amenities to find a boarding that fits.',
          ctaLabel: 'Start browsing',
          ctaTo: '/browse',
          icon: Search,
          target: 'nav-browse',
        },
        {
          title: 'Unlock contact safely',
          body: 'Reveal verified landlord details when a listing looks right — no spam, no guesswork.',
          ctaLabel: 'Browse listings',
          ctaTo: '/browse',
          icon: KeyRound,
          target: 'nav-browse',
        },
        {
          title: 'Send an inquiry',
          body: 'Ask questions or request a viewing. Conversations stay in your Inbox.',
          ctaLabel: 'Open Inbox',
          ctaTo: '/inbox',
          icon: MessageSquare,
          target: 'nav-inbox',
        },
        {
          title: 'Optional Premium',
          body: 'Unlock more contacts and perks when you are ready — free browsing always works.',
          ctaLabel: 'See Premium',
          ctaTo: '/seeker/premium',
          icon: Sparkles,
          target: 'nav-premium',
        },
      ]
  }
}

function findVisibleTourTarget(tourId: string): HTMLElement | null {
  const nodes = document.querySelectorAll<HTMLElement>(`[data-tour="${tourId}"]`)
  for (const el of nodes) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return el
  }
  return null
}

function measure(tourId: string): Rect | null {
  const el = findVisibleTourTarget(tourId)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  }
}

export function OnboardingTour() {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)

  const steps = useMemo(
    () => (user ? stepsForRole(user.role) : []),
    [user],
  )

  useEffect(() => {
    if (loading || !user) {
      setOpen(false)
      return
    }
    try {
      const done = localStorage.getItem(storageKey(user.id))
      if (!done) {
        setStepIndex(0)
        setOpen(true)
      } else {
        setOpen(false)
      }
    } catch {
      setOpen(false)
    }
  }, [loading, user])

  const refreshRect = useCallback(() => {
    if (!open || steps.length === 0) {
      setRect(null)
      return
    }
    const step = steps[stepIndex]
    if (!step) {
      setRect(null)
      return
    }
    const next = measure(step.target)
    if (!next && window.matchMedia('(max-width: 767px)').matches) {
      window.dispatchEvent(new Event(OPEN_MOBILE_NAV_EVENT))
      window.setTimeout(() => {
        setRect(measure(step.target))
      }, 280)
      return
    }
    setRect(next)
  }, [open, stepIndex, steps])

  useEffect(() => {
    if (!open) return
    refreshRect()
    const onReposition = () => refreshRect()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, refreshRect])

  useEffect(() => {
    if (!open || !rect) return
    const el = findVisibleTourTarget(steps[stepIndex]?.target ?? '')
    if (!el) return
    el.classList.add('ring-2', 'ring-accent', 'relative', 'z-[70]')
    return () => {
      el.classList.remove('ring-2', 'ring-accent', 'relative', 'z-[70]')
    }
  }, [open, rect, stepIndex, steps])

  function complete() {
    if (!user) return
    try {
      localStorage.setItem(storageKey(user.id), '1')
    } catch {
      /* ignore quota */
    }
    setOpen(false)
  }

  if (!open || !user || steps.length === 0) return null

  const step = steps[stepIndex]
  const Icon = step.icon
  const isLast = stepIndex >= steps.length - 1
  const tipStyle = tipPosition(rect)

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {rect ? (
        <>
          <div
            className="pointer-events-none absolute rounded-xl ring-2 ring-accent"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              boxShadow: '0 0 0 9999px rgba(19, 42, 34, 0.45)',
            }}
            aria-hidden
          />
          {/* Clickable dim regions — hole stays interactive for the nav target */}
          <button
            type="button"
            className="absolute left-0 right-0 top-0 bg-transparent"
            style={{ height: Math.max(0, rect.top) }}
            aria-label="Dismiss tutorial"
            onClick={complete}
          />
          <button
            type="button"
            className="absolute left-0 right-0 bottom-0 bg-transparent"
            style={{ top: rect.top + rect.height }}
            aria-label="Dismiss tutorial"
            onClick={complete}
          />
          <button
            type="button"
            className="absolute left-0 bg-transparent"
            style={{
              top: rect.top,
              width: Math.max(0, rect.left),
              height: rect.height,
            }}
            aria-label="Dismiss tutorial"
            onClick={complete}
          />
          <button
            type="button"
            className="absolute right-0 bg-transparent"
            style={{
              top: rect.top,
              left: rect.left + rect.width,
              height: rect.height,
            }}
            aria-label="Dismiss tutorial"
            onClick={complete}
          />
        </>
      ) : (
        <button
          type="button"
          className="absolute inset-0 bg-ink/45"
          aria-label="Dismiss tutorial"
          onClick={complete}
        />
      )}

      <div
        className="glass-panel absolute z-[80] w-[min(100%-2rem,22rem)] rounded-2xl border border-[var(--color-glass-border)] p-5 shadow-md"
        style={tipStyle}
      >
        <div className="mb-3 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-ink ring-1 ring-accent/30">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Welcome · step {stepIndex + 1} of {steps.length}
            </p>
            <h2
              id="onboarding-title"
              className="mt-1 font-display text-lg font-semibold text-ink"
            >
              {step.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
          </div>
        </div>

        <div className="mb-4 flex gap-1.5" aria-hidden>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= stepIndex ? 'bg-accent' : 'bg-[var(--color-line)]'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={complete}>
            Skip
          </Button>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link to={step.ctaTo} onClick={isLast ? complete : undefined}>
              <Button type="button" variant="outline" size="sm">
                {step.ctaLabel}
              </Button>
            </Link>
            {isLast ? (
              <Button type="button" size="sm" onClick={complete}>
                Done
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => setStepIndex((i) => i + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function tipPosition(rect: Rect | null): CSSProperties {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const tipW = Math.min(vw - 32, 352)
  const tipH = 220

  if (!rect) {
    return {
      left: Math.max(16, (vw - tipW) / 2),
      bottom: 24,
      top: 'auto',
    }
  }

  let top = rect.top + rect.height + 12
  const left = Math.min(Math.max(16, rect.left), vw - tipW - 16)

  if (top + tipH > vh - 16) {
    top = Math.max(16, rect.top - tipH - 12)
  }
  if (top < 16) {
    top = Math.max(16, Math.min(rect.top + rect.height + 12, vh - tipH - 16))
  }

  return { top, left, bottom: 'auto' }
}
