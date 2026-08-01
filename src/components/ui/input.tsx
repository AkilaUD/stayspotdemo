import {
  Children,
  forwardRef,
  isValidElement,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '../../lib/utils'

const fieldClass =
  'flex w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-2 text-sm text-ink shadow-sm backdrop-blur-md transition placeholder:text-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-warning aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-warning/30'

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <div className="grid gap-1">
    <input
      ref={ref}
      aria-invalid={error ? true : undefined}
      className={cn(fieldClass, 'h-10', className)}
      {...props}
    />
    {error && (
      <p className="text-xs font-medium text-warning" role="alert">
        {error}
      </p>
    )}
  </div>
))
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <div className="grid gap-1">
    <textarea
      ref={ref}
      aria-invalid={error ? true : undefined}
      className={cn(fieldClass, 'min-h-[88px]', className)}
      {...props}
    />
    {error && (
      <p className="text-xs font-medium text-warning" role="alert">
        {error}
      </p>
    )}
  </div>
))
Textarea.displayName = 'Textarea'

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
>(({ className, children, error, ...props }, ref) => (
  <div className="grid gap-1">
    <select
      ref={ref}
      aria-invalid={error ? true : undefined}
      className={cn(fieldClass, 'h-10', className)}
      {...props}
    >
      {children}
    </select>
    {error && (
      <p className="text-xs font-medium text-warning" role="alert">
        {error}
      </p>
    )}
  </div>
))
Select.displayName = 'Select'

export function Label({
  className,
  required,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  const nodes = Children.toArray(children)
  const text: ReactNode[] = []
  const controls: ReactNode[] = []
  for (const node of nodes) {
    if (typeof node === 'string' || typeof node === 'number') text.push(node)
    else if (isValidElement(node)) controls.push(node)
    else text.push(node)
  }

  return (
    <label
      className={cn('grid gap-1.5 text-sm font-medium text-ink', className)}
      {...props}
    >
      {text.length > 0 && (
        <span>
          {text}
          {required && (
            <span className="ml-0.5 text-accent" aria-hidden>
              *
            </span>
          )}
        </span>
      )}
      {controls}
    </label>
  )
}
