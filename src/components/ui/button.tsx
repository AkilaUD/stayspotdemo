import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-[#132A22] shadow-[0_0_0_0_rgba(232,177,104,0)] hover:brightness-105 hover:shadow-[0_0_24px_rgba(232,177,104,0.45)]',
        secondary:
          'border border-[var(--color-line)] bg-[var(--color-glass-surface)] text-ink backdrop-blur-md hover:border-accent/60',
        outline:
          'border border-[var(--color-line)] bg-transparent text-ink hover:bg-[var(--color-glass-surface)] hover:border-accent/50',
        ghost: 'bg-transparent text-ink hover:bg-[var(--color-glass-surface)]',
        link: 'bg-transparent p-0 font-semibold text-accent underline-offset-4 hover:underline',
        destructive:
          'bg-warning text-white shadow-sm hover:brightness-110',
        success: 'bg-success text-[#132A22] shadow-sm hover:brightness-105',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-5',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, disabled, children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'

export { buttonVariants }
