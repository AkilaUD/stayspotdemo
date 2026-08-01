import { CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { fetchPayment, sandboxCompletePayment } from '../api'
import { useAuth } from '../AuthContext'
import { Badge } from '../components/ui/badge'
import { Button, buttonVariants } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Alert, PageHeader, Skeleton } from '../components/ui/feedback'
import { MotionFade } from '../components/ui/motion'
import { cn, formatLkr } from '../lib/utils'

export function BillingSandboxPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | null>(null)
  const [planCode, setPlanCode] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!orderId || !user) return
    let cancelled = false
    async function load() {
      try {
        const payment = await fetchPayment(orderId!)
        if (!cancelled) {
          setAmount(payment.amountLkr)
          setPlanCode(payment.planCode)
          setStatus(payment.status)
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Payment not found')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [orderId, user])

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADVERTISER') {
    return (
      <div>
        <Alert variant="error">Checkout is for advertisers.</Alert>
      </div>
    )
  }

  async function pay() {
    if (!orderId) return
    setBusy(true)
    setError(null)
    try {
      await sandboxCompletePayment(orderId)
      navigate(`/billing/return?order_id=${orderId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <MotionFade className="mx-auto max-w-lg">
      <PageHeader
        eyebrow="PayHere sandbox"
        title="Confirm payment"
        description="Development mock of the PayHere checkout. Completing this posts an idempotent paid notification and activates your plan."
      />

      {amount == null && !error && (
        <Skeleton className="mb-6 h-40 w-full rounded-2xl" />
      )}

      {amount != null && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" aria-hidden />
              Order summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted">Order</span>
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs ring-1 ring-line">
                {orderId}
              </code>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted">Amount</span>
              <span className="font-semibold tabular-nums text-ink">
                {formatLkr(amount)}
              </span>
            </div>
            {planCode && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">Plan</span>
                <span className="font-medium text-ink">{planCode}</span>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <span className="text-muted">Status</span>
              <Badge variant={status === 'paid' ? 'success' : 'warning'}>
                {status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          loading={busy}
          disabled={status === 'paid'}
          onClick={() => void pay()}
        >
          {busy
            ? 'Processing…'
            : status === 'paid'
              ? 'Already paid'
              : 'Pay now (sandbox)'}
        </Button>
        <Link
          to={`/billing/cancel?order_id=${orderId}`}
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          Cancel
        </Link>
      </div>
    </MotionFade>
  )
}
