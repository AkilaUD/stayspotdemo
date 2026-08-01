import { motion } from 'framer-motion'
import { Check, Sparkles, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createCheckout,
  fetchAdvertiserSubscription,
  fetchPlans,
  fetchSeekerPlans,
  fetchSeekerSubscription,
  type AdvertiserSubscription,
  type Plan,
  type SeekerPlan,
  type SeekerSubscription,
} from '../api'
import { useAuth } from '../AuthContext'
import { Badge } from '../components/ui/badge'
import { Button, buttonVariants } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Alert, PageHeader } from '../components/ui/feedback'
import { cn, formatLkr } from '../lib/utils'

export function PricingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [audience, setAudience] = useState<'advertiser' | 'seeker'>(
    user?.role === 'SEEKER' ? 'seeker' : 'advertiser',
  )
  const [plans, setPlans] = useState<Plan[]>([])
  const [seekerPlans, setSeekerPlans] = useState<SeekerPlan[]>([])
  const [sub, setSub] = useState<AdvertiserSubscription | null>(null)
  const [seekerSub, setSeekerSub] = useState<SeekerSubscription | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyCode, setBusyCode] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role === 'SEEKER') setAudience('seeker')
    else if (user?.role === 'ADVERTISER') setAudience('advertiser')
  }, [user?.role])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [adv, seek] = await Promise.all([fetchPlans(), fetchSeekerPlans()])
        if (!cancelled) {
          setPlans(adv)
          setSeekerPlans(seek)
        }
        if (user?.role === 'ADVERTISER') {
          const s = await fetchAdvertiserSubscription()
          if (!cancelled) setSub(s)
        }
        if (user?.role === 'SEEKER') {
          const s = await fetchSeekerSubscription()
          if (!cancelled) setSeekerSub(s)
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load plans')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  async function startCheckout(planCode: string) {
    setBusyCode(planCode)
    setError(null)
    try {
      const session = await createCheckout({ planCode })
      navigate(`/billing/sandbox/${session.orderId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed')
    } finally {
      setBusyCode(null)
    }
  }

  const showSeeker = audience === 'seeker'

  return (
    <div>
      <PageHeader
        eyebrow="Plans"
        title={showSeeker ? 'Seeker Premium' : 'Advertiser plans'}
        description={
          showSeeker
            ? 'Plus unlocks saved searches and viewing requests. Pro adds early contact unlock on new ads.'
            : 'Starter is free with 1 live+pending ad. Paid plans unlock more slots and boost credits via PayHere.'
        }
        actions={
          <div className="glass-panel inline-flex rounded-xl p-1">
            <Button
              type="button"
              size="sm"
              variant={!showSeeker ? 'primary' : 'ghost'}
              onClick={() => setAudience('advertiser')}
            >
              Landlords
            </Button>
            <Button
              type="button"
              size="sm"
              variant={showSeeker ? 'primary' : 'ghost'}
              onClick={() => setAudience('seeker')}
            >
              Renters
            </Button>
          </div>
        }
      />

      {!showSeeker && sub && (
        <Alert variant="info" className="mb-6">
          Current: <strong>{sub.planName}</strong> ({sub.status}) ·{' '}
          {sub.slotsUsed}/{sub.listingSlots} slots
          {sub.boostsFrozen ? ' · boosts frozen' : ''}
        </Alert>
      )}
      {showSeeker && seekerSub && (
        <Alert variant="info" className="mb-6">
          Current: <strong>{seekerSub.planName}</strong> ({seekerSub.status})
          {seekerSub.isPremium ? (
            <>
              {' '}
              ·{' '}
              <Link to="/seeker/premium" className="font-semibold text-accent">
                Manage premium
              </Link>
            </>
          ) : null}
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {!showSeeker ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, i) => {
            const isCurrent = sub?.planCode === plan.code
            return (
              <motion.div
                key={plan.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={cn(
                    'flex h-full flex-col',
                    isCurrent &&
                      'border-accent shadow-[0_12px_40px_rgba(232,177,104,0.28)] ring-2 ring-accent backdrop-blur-[28px]',
                    plan.code === 'growth' &&
                      !isCurrent &&
                      'border-accent shadow-[0_12px_40px_rgba(232,177,104,0.22)] ring-2 ring-accent/70 backdrop-blur-[28px]',
                    !plan.isFree &&
                      !isCurrent &&
                      plan.code !== 'growth' &&
                      'border-accent/30',
                  )}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.isFree && <Badge>Free</Badge>}
                      {isCurrent && <Badge variant="success">Current</Badge>}
                      {plan.code === 'growth' && !isCurrent && (
                        <Badge variant="accent">Recommended</Badge>
                      )}
                      {!plan.isFree && !isCurrent && plan.code !== 'growth' && (
                        <Badge variant="accent">
                          <Sparkles className="mr-1 h-3 w-3" aria-hidden />
                          Paid
                        </Badge>
                      )}
                    </div>
                    <p className="font-display text-3xl font-bold tabular-nums text-ink">
                      {formatLkr(plan.priceLkrMonth)}
                      {!plan.isFree && (
                        <span className="ml-1 text-sm font-medium text-muted">
                          /30 days
                        </span>
                      )}
                    </p>
                    <CardDescription>{plan.bestFor}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2.5 text-sm text-ink">
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden />
                        <span>
                          <strong>{plan.listingSlots}</strong> live + pending ads
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden />
                        <span>
                          <strong>{plan.boostCreditsDistrict}</strong> district
                          boost credits
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden />
                        <span>
                          <strong>{plan.boostCreditsIsland}</strong> island boost
                          credits
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    {user?.role === 'ADVERTISER' ? (
                      plan.isFree ? (
                        <Link
                          to="/advertiser/ads"
                          className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'w-full',
                          )}
                        >
                          {isCurrent ? 'Current plan' : 'Free tier'}
                        </Link>
                      ) : (
                        <Button
                          type="button"
                          className={cn(
                            'w-full',
                            plan.code === 'growth' &&
                              'bg-accent text-[#132A22] hover:brightness-105',
                          )}
                          disabled={busyCode === plan.code || isCurrent}
                          loading={busyCode === plan.code}
                          onClick={() => void startCheckout(plan.code)}
                        >
                          {isCurrent
                            ? 'Current plan'
                            : busyCode === plan.code
                              ? 'Starting…'
                              : `Unlock ${plan.listingSlots} slots + ${plan.boostCreditsDistrict + plan.boostCreditsIsland} boosts`}
                        </Button>
                      )
                    ) : (
                      <Link
                        to="/register?role=ADVERTISER"
                        className={cn(
                          buttonVariants({ variant: 'primary' }),
                          'w-full',
                          plan.code === 'growth' &&
                            'bg-accent text-[#132A22] hover:brightness-105',
                        )}
                      >
                        Create advertiser account
                      </Link>
                    )}
                    {!plan.isFree && (
                      <p className="text-center text-xs text-muted">
                        More reach in browse + boost credits for intake weeks
                      </p>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {seekerPlans.map((plan, i) => {
            const isCurrent = seekerSub?.planCode === plan.code
            return (
              <motion.div
                key={plan.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={cn(
                    'flex h-full flex-col',
                    isCurrent &&
                      'border-accent shadow-[0_12px_40px_rgba(232,177,104,0.28)] ring-2 ring-accent backdrop-blur-[28px]',
                    (plan.code === 'plus' || plan.code === 'PLUS') &&
                      !isCurrent &&
                      'border-accent shadow-[0_12px_40px_rgba(232,177,104,0.22)] ring-2 ring-accent/70 backdrop-blur-[28px]',
                    !plan.isFree &&
                      !isCurrent &&
                      plan.code !== 'plus' &&
                      plan.code !== 'PLUS' &&
                      'border-accent/40',
                  )}
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-accent" aria-hidden />
                        {plan.name}
                      </CardTitle>
                      {plan.isFree && <Badge>Free</Badge>}
                      {isCurrent && <Badge variant="success">Current</Badge>}
                      {(plan.code === 'plus' || plan.code === 'PLUS') &&
                        !isCurrent && (
                          <Badge variant="accent">Recommended</Badge>
                        )}
                    </div>
                    <p className="font-display text-3xl font-bold tabular-nums text-ink">
                      {formatLkr(plan.priceLkrMonth)}
                      {!plan.isFree && (
                        <span className="ml-1 text-sm font-medium text-muted">
                          /30 days
                        </span>
                      )}
                    </p>
                    <CardDescription>{plan.bestFor}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2.5 text-sm text-ink">
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden />
                        <span>
                          <strong>{plan.savedSearchLimit}</strong> saved searches
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden />
                        <span>
                          <strong>{plan.viewingRequestQuota}</strong> viewing
                          requests / period
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden />
                        <span>
                          {plan.earlyUnlock
                            ? 'Early unlock on new ads'
                            : 'Standard unlock timing'}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    {user?.role === 'SEEKER' ? (
                      plan.isFree ? (
                        <Link
                          to="/seeker/premium"
                          className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'w-full',
                          )}
                        >
                          {isCurrent ? 'Current plan' : 'Free tier'}
                        </Link>
                      ) : (
                        <Button
                          type="button"
                          className={cn(
                            'w-full',
                            (plan.code === 'plus' || plan.code === 'PLUS') &&
                              'bg-accent text-[#132A22] hover:brightness-105',
                          )}
                          disabled={busyCode === plan.code || isCurrent}
                          loading={busyCode === plan.code}
                          onClick={() => void startCheckout(plan.code)}
                        >
                          {isCurrent
                            ? 'Current plan'
                            : busyCode === plan.code
                              ? 'Starting…'
                              : 'Upgrade with PayHere'}
                        </Button>
                      )
                    ) : (
                      <Link
                        to="/register?role=SEEKER"
                        className={cn(
                          buttonVariants({ variant: 'primary' }),
                          'w-full',
                        )}
                      >
                        Create seeker account
                      </Link>
                    )}
                    {!plan.isFree && (
                      <p className="text-center text-xs text-muted">
                        Viewings + saved searches
                      </p>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
