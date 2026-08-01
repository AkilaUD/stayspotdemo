import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'relative inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default:
          'border border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] text-ink backdrop-blur-sm',
        success: 'bg-success/20 text-[#1a5c38] ring-1 ring-success/40 dark:text-success',
        warning: 'bg-warning/15 text-warning ring-1 ring-warning/40',
        danger: 'bg-warning/20 text-warning ring-1 ring-warning/50',
        info: 'border border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] text-ink',
        accent: 'bg-accent/20 text-[#8a5a18] ring-1 ring-accent/40 dark:text-accent',
        verified:
          'border border-accent/50 bg-[var(--color-glass-surface)] text-ink backdrop-blur-sm ring-1 ring-accent/25',
        pending:
          'bg-[color-mix(in_srgb,var(--color-ink)_8%,transparent)] text-ink ring-1 ring-[var(--color-line)]',
        live: 'bg-success text-[#132A22]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export function Badge({
  className,
  variant,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}

/** Map listing/ad status → badge variant */
export function statusBadgeVariant(
  status: string,
): NonNullable<VariantProps<typeof badgeVariants>['variant']> {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return 'live'
    case 'PENDING':
      return 'pending'
    case 'REJECTED':
      return 'danger'
    case 'ARCHIVED':
      return 'default'
    default:
      return 'default'
  }
}
