import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

const STEPS = [
  { id: 'reviewed', label: 'Reviewed' },
  { id: 'unlocked', label: 'Contact unlocked' },
  { id: 'whatsapp', label: 'WhatsApp' },
] as const

export type InquiryStep = (typeof STEPS)[number]['id']

/**
 * Presentational inquiry progress: Reviewed → Contact unlocked → WhatsApp.
 * Pass the current completed step; earlier steps render as done.
 */
export function InquiryStatusStepper({
  current,
  className,
}: {
  current: InquiryStep
  className?: string
}) {
  const idx = STEPS.findIndex((s) => s.id === current)

  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-2 text-xs font-semibold',
        className,
      )}
      aria-label="Inquiry status"
    >
      {STEPS.map((step, i) => {
        const done = i <= idx
        const active = i === idx
        return (
          <li key={step.id} className="flex items-center gap-2">
            {i > 0 && (
              <span
                className={cn(
                  'hidden h-px w-4 sm:block',
                  done ? 'bg-success/60' : 'bg-line',
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1',
                done
                  ? 'bg-success/15 text-[#1a5c38] ring-success/40 dark:text-success'
                  : 'bg-[color-mix(in_srgb,var(--color-ink)_8%,transparent)] text-muted ring-[var(--color-line)]',
                active && 'text-ink ring-accent/60',
              )}
            >
              {done && <Check className="h-3 w-3" aria-hidden />}
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
