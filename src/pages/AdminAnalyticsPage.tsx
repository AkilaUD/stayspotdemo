import { motion } from 'framer-motion'
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  MapPinned,
  Rocket,
  Users,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { fetchAdminAnalytics, type AdminAnalytics } from '../api'
import { useAuth } from '../AuthContext'
import { buttonVariants } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import {
  Alert,
  PageHeader,
  Skeleton,
} from '../components/ui/feedback'
import { MotionFade, MotionStagger } from '../components/ui/motion'
import { staggerItem } from '../lib/motion'
import { cn } from '../lib/utils'

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: number
  hint?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <motion.div variants={staggerItem}>
      <Card className="hover:border-accent/30">
        <CardContent className="flex items-start gap-3 pt-5">
          <div className="rounded-xl bg-accent/15 p-2.5 text-accent ring-1 ring-[var(--color-glass-border)]">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl font-bold tabular-nums tracking-tight text-ink">
              {value.toLocaleString('en-LK')}
            </p>
            <p className="text-sm font-medium text-ink">{label}</p>
            {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AdminAnalyticsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<AdminAnalytics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const analytics = await fetchAdminAnalytics()
        if (!cancelled) setData(analytics)
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to load analytics')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') {
    return (
      <div>
        <Alert variant="error" className="mb-4">
          Analytics are admin-only.
        </Alert>
        <Link to="/browse" className={cn(buttonVariants({ variant: 'outline' }))}>
          Home
        </Link>
      </div>
    )
  }

  return (
    <MotionFade>
      <PageHeader
        eyebrow="Admin console"
        title="Analytics"
        description="Platform rollups from live SQL. Boost metrics stay at zero until boosts ship (M10)."
        actions={
          <Link
            to="/admin/postings"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Ad Postings
          </Link>
        }
      />

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {data && (
        <>
          <MotionStagger className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total ads posted"
              value={data.totalAdsPosted}
              icon={BarChart3}
            />
            <MetricCard
              label="Boosted"
              value={data.boostedCount}
              hint="Placeholder until M10"
              icon={Rocket}
            />
            <MetricCard
              label="Not boosted"
              value={data.notBoostedCount}
              icon={Building2}
            />
            <MetricCard
              label="Advertisers"
              value={data.totalAdvertisers}
              icon={Users}
            />
            <MetricCard
              label="Registered viewers"
              value={data.totalRegisteredViewers}
              icon={Eye}
            />
            <MetricCard
              label="Boosted island-wide"
              value={data.boostedIslandWide}
              hint="Placeholder until M10"
              icon={MapPinned}
            />
            <MetricCard
              label="Boosted district-wide"
              value={data.boostedDistrictWide}
              hint="Placeholder until M10"
              icon={MapPinned}
            />
          </MotionStagger>

          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Trust queue
          </h2>
          <MotionStagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Pending review"
              value={data.pendingAds}
              icon={Clock3}
            />
            <MetricCard
              label="Approved"
              value={data.approvedAds}
              icon={CheckCircle2}
            />
            <MetricCard
              label="Rejected"
              value={data.rejectedAds}
              icon={XCircle}
            />
            <MetricCard
              label="Contact unlocks"
              value={data.contactUnlocks}
              icon={Eye}
            />
          </MotionStagger>
        </>
      )}
    </MotionFade>
  )
}
