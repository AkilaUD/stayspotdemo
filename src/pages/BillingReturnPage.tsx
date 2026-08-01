import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchAdvertiserSubscription, fetchPayment } from '../api'
import { illustrations } from '../assets/illustrations'
import { useAuth } from '../AuthContext'
import { buttonVariants } from '../components/ui/button'
import {
  Card,
  CardContent,
} from '../components/ui/card'
import { Alert, PageHeader, Skeleton } from '../components/ui/feedback'
import { MotionFade } from '../components/ui/motion'
import { SafeImage } from '../components/ui/safe-image'
import { NextStepPanel } from '../components/ui/conversion'
import { cn } from '../lib/utils'

export function BillingReturnPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order_id')
  const { user } = useAuth()
  const [message, setMessage] = useState('Confirming payment…')
  const [plan, setPlan] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!orderId || !user) {
        setMessage('Missing order or session.')
        setReady(true)
        return
      }
      try {
        const payment = await fetchPayment(orderId)
        if (cancelled) return
        if (payment.status === 'paid') {
          const sub = await fetchAdvertiserSubscription()
          if (cancelled) return
          setPlan(sub.planName)
          setOk(true)
          setMessage(
            `Payment confirmed. You are on ${sub.planName} with ${sub.listingSlots} listing slots.`,
          )
        } else {
          setMessage(
            `Payment status is “${payment.status}”. If you just paid, wait a moment and refresh.`,
          )
        }
      } catch (e) {
        if (!cancelled)
          setMessage(e instanceof Error ? e.message : 'Could not confirm payment')
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [orderId, user])

  return (
    <MotionFade className="mx-auto max-w-lg">
      <PageHeader eyebrow="Billing" title="Payment return" />

      {!ready ? (
        <Skeleton className="mb-6 h-28 w-full rounded-2xl" />
      ) : (
        <>
          <SafeImage
            src={ok ? illustrations.billingSuccess : illustrations.billingCancel}
            alt=""
            width={160}
            height={160}
            className="mx-auto mb-5 h-36 w-36 rounded-2xl object-cover shadow-sm ring-1 ring-line"
            fallback={<></>}
          />
          <Card className="mb-6">
            <CardContent className="flex items-start gap-3 pt-6">
              {ok ? (
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" aria-hidden />
              ) : (
                <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-warning" aria-hidden />
              )}
              <div>
                <p className="text-ink">{message}</p>
                {plan && (
                  <p className="mt-2 text-sm text-muted">Active plan: {plan}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {ready && ok ? (
        <NextStepPanel
          className="mb-4"
          title="You're upgraded"
          body={
            plan
              ? `${plan} is active — publish another ad or boost a live listing.`
              : 'Publish another ad or boost a live listing from My Ads.'
          }
          primary={{ label: 'My Ads · boost', to: '/advertiser/ads' }}
          secondary={{
            label: 'Publish another',
            to: '/advertiser/publish',
          }}
        />
      ) : (
        <div className="flex flex-wrap gap-3">
          <Link
            to="/advertiser/ads"
            className={cn(buttonVariants({ variant: 'primary' }))}
          >
            Go to My Ads
          </Link>
          <Link
            to="/pricing"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            View plans
          </Link>
        </div>
      )}
    </MotionFade>
  )
}

export function BillingCancelPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order_id')

  return (
    <MotionFade className="mx-auto max-w-lg">
      <PageHeader
        eyebrow="Billing"
        title="Checkout cancelled"
        description="No charges were applied. You can restart checkout anytime."
      />

      <SafeImage
        src={illustrations.billingCancel}
        alt=""
        width={160}
        height={160}
        className="mx-auto mb-5 h-36 w-36 rounded-2xl object-cover shadow-sm ring-1 ring-line"
        fallback={<></>}
      />

      <Alert variant="info" className="mb-6">
        {orderId ? (
          <>
            No charges for order{' '}
            <code className="rounded bg-card px-1.5 py-0.5 text-xs ring-1 ring-line">
              {orderId}
            </code>
            .
          </>
        ) : (
          'Checkout was cancelled before payment.'
        )}
      </Alert>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/pricing"
          className={cn(buttonVariants({ variant: 'primary' }))}
        >
          Back to plans
        </Link>
        <Link
          to="/advertiser/ads"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          My Ads
        </Link>
      </div>
    </MotionFade>
  )
}
