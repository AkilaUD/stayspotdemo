import { AlertCircle, CheckCircle2, Info, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, softTransition, usePrefersReducedMotion } from '../../lib/motion'
import { cn } from '../../lib/utils'
import { SafeImage } from './safe-image'

const styles = {
  error: {
    wrap: 'border-warning/40 bg-warning/10 text-warning',
    Icon: AlertCircle,
  },
  success: {
    wrap: 'border-success/40 bg-success/10 text-teal dark:text-success',
    Icon: CheckCircle2,
  },
  info: {
    wrap: 'border-[var(--color-line)] bg-[var(--color-glass-surface)] text-ink backdrop-blur-md',
    Icon: Info,
  },
} as const

export function Alert({
  variant = 'info',
  className,
  children,
}: {
  variant?: keyof typeof styles
  className?: string
  children: React.ReactNode
}) {
  const { wrap, Icon } = styles[variant]
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm',
        wrap,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  illustration,
  suggestions,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  illustration?: string
  suggestions?: { label: string; to: string }[]
}) {
  const reduceMotion = usePrefersReducedMotion()
  return (
    <motion.div
      variants={fadeUp}
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      transition={softTransition}
      className="relative overflow-hidden rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] text-center shadow-[var(--glass-shadow)]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--warm-wash),transparent_65%)]"
        aria-hidden
      />
      {illustration ? (
        <div className="relative aspect-[21/9] max-h-48 w-full overflow-hidden sm:max-h-56">
          <SafeImage
            src={illustration}
            alt=""
            width={640}
            height={280}
            loading="lazy"
            className="h-full w-full object-cover"
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-accent/10 text-accent-text">
                <Icon className="h-10 w-10" aria-hidden />
              </div>
            }
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--color-glass-surface)] via-transparent to-transparent"
            aria-hidden
          />
        </div>
      ) : (
        <div className="relative flex justify-center pt-10">
          <div className="rounded-2xl bg-accent/15 p-4 text-accent-text ring-1 ring-accent/30">
            <Icon className="h-7 w-7" aria-hidden />
          </div>
        </div>
      )}
      <div className="relative px-6 pb-10 pt-5">
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        {description && (
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
        {suggestions && suggestions.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <Link
                key={s.to + s.label}
                to={s.to}
                className="rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-accent/30 no-underline hover:bg-accent/25"
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </motion.div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('glass-skeleton rounded-lg', className)} aria-hidden />
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-text">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm font-medium text-ink sm:text-[1rem]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
