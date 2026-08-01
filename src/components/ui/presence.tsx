import { Lock, MapPin, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { usePrefersReducedMotion } from '../../lib/motion'

export type PresenceItem = {
  icon?: LucideIcon
  label: string
}

const DEFAULT_ITEMS: PresenceItem[] = [
  {
    icon: Users,
    label: 'Students, workers & landlords across Sri Lanka',
  },
  {
    icon: Lock,
    label: 'Contact stays private until you unlock',
  },
  {
    icon: MapPin,
    label: 'Reviewed boarding by district & campus',
  },
]

export function PresenceStrip({
  items = DEFAULT_ITEMS,
  liveCount,
  className,
  ambient,
}: {
  items?: PresenceItem[]
  liveCount?: number | null
  className?: string
  ambient?: boolean
}) {
  const reduce = usePrefersReducedMotion()
  const lines =
    typeof liveCount === 'number' && liveCount > 0
      ? [
          {
            icon: MapPin,
            label: `${liveCount} reviewed rooms ready to explore`,
          },
          ...items.slice(1),
        ]
      : items

  return (
    <div
      className={cn(
        'glass-panel flex flex-col gap-2 rounded-2xl px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2',
        ambient && !reduce && 'presence-ambient',
        className,
      )}
      role="note"
    >
      {lines.map(({ icon: Icon, label }) => (
        <p
          key={label}
          className="inline-flex items-center gap-2 text-sm text-ink/90"
        >
          {Icon ? (
            <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          ) : null}
          <span>{label}</span>
        </p>
      ))}
    </div>
  )
}

export function PlaceChipRow({
  chips,
  className,
}: {
  chips: readonly { label: string; to: string }[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {chips.map((c) => (
        <Link
          key={c.label}
          to={c.to}
          className="rounded-full bg-accent/15 px-3.5 py-1.5 text-sm font-semibold text-ink ring-1 ring-accent/35 no-underline transition hover:bg-accent/25"
        >
          {c.label}
        </Link>
      ))}
    </div>
  )
}
