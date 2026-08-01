import { Link } from 'react-router-dom'
import { BadgeCheck, Lock, ShieldOff } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'

const DEFAULT_TRUST = [
  { icon: BadgeCheck, label: 'Reviewed ads' },
  { icon: Lock, label: 'Contact gated' },
  { icon: ShieldOff, label: 'No rent escrow' },
] as const

export function TrustStrip({
  className,
  dense,
}: {
  className?: string
  dense?: boolean
}) {
  return (
    <ul
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1 text-muted',
        dense ? 'text-[11px]' : 'text-xs',
        className,
      )}
      aria-label="StaySpot trust cues"
    >
      {DEFAULT_TRUST.map(({ icon: Icon, label }, i) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <span className="mr-1.5 text-[var(--color-line)]" aria-hidden>
              ·
            </span>
          )}
          <Icon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}

type NextStepAction = {
  label: string
  to?: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
}

export function NextStepPanel({
  title,
  body,
  primary,
  secondary,
  className,
}: {
  title: string
  body: string
  primary: NextStepAction
  secondary?: NextStepAction
  className?: string
}) {
  function renderAction(action: NextStepAction, isPrimary: boolean) {
    const useAccent = isPrimary && action.variant !== 'outline'
    const btn = (
      <Button
        type="button"
        variant={useAccent ? 'primary' : 'outline'}
        size="sm"
        onClick={action.onClick}
        className={
          useAccent
            ? 'bg-accent text-[#132A22] hover:brightness-105'
            : undefined
        }
      >
        {action.label}
      </Button>
    )
    if (action.to) {
      return (
        <Link to={action.to} className="no-underline">
          {btn}
        </Link>
      )
    }
    return btn
  }

  return (
    <div
      className={cn(
        'glass-panel rounded-2xl border border-accent/30 p-4 ring-1 ring-accent/20',
        className,
      )}
      role="status"
    >
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {renderAction(primary, true)}
        {secondary ? renderAction(secondary, false) : null}
      </div>
    </div>
  )
}

/** Allow only same-app absolute paths (no protocol / open redirect). */
export function safeNextPath(raw: string | null | undefined, fallback: string): string {
  if (!raw) return fallback
  const t = raw.trim()
  if (!t.startsWith('/') || t.startsWith('//') || t.includes('://')) return fallback
  return t
}

export function loginWithNext(path: string) {
  return `/login?next=${encodeURIComponent(path)}`
}
