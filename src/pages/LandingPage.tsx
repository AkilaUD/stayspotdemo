import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchListings,
  fetchPlans,
  type Plan,
  type PublicListing,
} from '../api'
import { illustrations } from '../assets/illustrations'
import { Seo } from '../components/Seo'
import { LandingNav } from '../components/landing/LandingNav'
import { HeroSearch } from '../components/landing/HeroSearch'
import { MobileStickyCta } from '../components/landing/MobileStickyCta'
import {
  DISTRICT_CHIPS,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP,
  formatLkr,
} from '../components/landing/constants'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { MotionSection } from '../components/ui/motion'
import { ListingCover, SafeImage } from '../components/ui/safe-image'
import { TrustStrip } from '../components/ui/conversion'
import { PresenceStrip } from '../components/ui/presence'
import {
  softTransition,
  staggerContainer,
  staggerItem,
  usePrefersReducedMotion,
} from '../lib/motion'

const FAQ = [
  {
    q: 'Why can’t I see phone numbers as a guest?',
    a: 'StaySpot gates contact until you sign in as a seeker. That cuts spam and keeps landlords’ numbers off open classifieds.',
  },
  {
    q: 'Who can post a boarding ad?',
    a: 'Only advertiser (landlord) accounts can publish. Seekers browse, unlock contact, and send inquiries.',
  },
  {
    q: 'Do I pay to try listing?',
    a: 'Starter is free with 1 live+pending ad. Upgrade to Growth, Pro, or House when you need more slots and boost credits.',
  },
  {
    q: 'Does StaySpot hold rent money?',
    a: 'No. StaySpot does not escrow rent. We help you find and fill rooms—payments between landlord and renter stay between you.',
  },
  {
    q: 'When can I open WhatsApp?',
    a: 'Send an inquiry first. Then open a rate-limited WhatsApp handoff from your inbox with a prefilled message.',
  },
] as const

function FaqItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string
  a: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  return (
    <div className="glass-panel rounded-xl">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-ink"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {q}
        <span className="text-accent" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-[var(--color-glass-border)] px-4 py-3 text-sm text-muted"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function LandingPage() {
  const [listings, setListings] = useState<PublicListing[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [track, setTrack] = useState<'renter' | 'landlord'>('renter')
  const [listError, setListError] = useState<string | null>(null)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [items, planList] = await Promise.all([
          fetchListings(),
          fetchPlans(),
        ])
        if (!cancelled) {
          setListings(items.slice(0, 6))
          setPlans(planList)
        }
      } catch (e) {
        if (!cancelled)
          setListError(
            e instanceof Error ? e.message : 'Could not load live listings',
          )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const waUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
    'Hi StaySpot — I have a question about listing / finding a boarding place.',
  )}`

  return (
    <div className="page-canvas text-ink pb-24 md:pb-0">
      <Seo />
      <LandingNav />

      <main id="main">
        {/* Hero — search-first under fixed LandingNav */}
        <section className="relative min-h-[88svh] overflow-hidden">
          <SafeImage
            src={illustrations.heroBoarding}
            alt=""
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            overlay="glass"
            className="absolute inset-0 h-full w-full"
            fallback={
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-deep via-teal to-teal-deep" />
                <div className="glass-overlay absolute inset-0" aria-hidden />
              </div>
            }
          />
          <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
            <motion.div
              variants={staggerContainer}
              initial={reduceMotion ? false : 'hidden'}
              animate="show"
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <motion.p
                variants={staggerItem}
                transition={softTransition}
                className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              >
                StaySpot
              </motion.p>
              <motion.h1
                variants={staggerItem}
                transition={softTransition}
                className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-snug text-white sm:text-3xl md:text-4xl"
              >
                Your next boarding is one{' '}
                <span className="inline-block rounded-md bg-white px-2 py-0.5 text-on-accent sm:px-2.5">
                  search
                </span>{' '}
                away.
              </motion.h1>
              <motion.div
                variants={staggerItem}
                transition={softTransition}
                className="mt-8 w-full"
              >
                <HeroSearch liveCount={listings.length || null} />
              </motion.div>
              <motion.p
                variants={staggerItem}
                transition={softTransition}
                className="mt-5 text-sm text-white/85"
              >
                Ads go live only after review · Contact gated · No rent escrow
              </motion.p>
            </motion.div>
          </div>
        </section>

        <div className="band-presence relative z-[1] -mt-6 px-4 pb-2 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <PresenceStrip
              ambient
              liveCount={listings.length || null}
              className="shadow-md"
            />
          </div>
        </div>

        {/* Why — tighter spacing into featured */}
        <MotionSection className="band-warm mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-text">
                Why StaySpot
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                Fewer wasted visits. Clearer leads.
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                Free classifieds dump phones online. StaySpot reviews ads, gates
                contact, and keeps an inquiry trail so landlords know what works.
              </p>
            </div>
            <SafeImage
              src={illustrations.featureTrust}
              alt=""
              width={960}
              height={540}
              loading="lazy"
              className="w-full rounded-3xl object-cover shadow-md ring-1 ring-[var(--color-glass-border)]"
              fallback={
                <div className="aspect-video w-full rounded-3xl bg-gradient-to-br from-accent/20 to-surface ring-1 ring-line" />
              }
            />
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: 'Reviewed before live',
                d: 'Every public listing passes admin review—not an open dump.',
              },
              {
                t: 'Contact after login',
                d: 'Seekers unlock phone & address. Guests never see them.',
              },
              {
                t: 'Inquiry before WhatsApp',
                d: 'Leads land in your inbox first, then a controlled WA handoff.',
              },
              {
                t: 'Plans that scale reach',
                d: 'Slots + district/island boosts in LKR—not only one-off carts.',
              },
            ].map((b) => (
              <li
                key={b.t}
                className="glass-panel rounded-2xl border-t-2 border-t-accent p-4 pt-4"
              >
                <h3 className="font-display text-lg font-semibold text-ink">
                  {b.t}
                </h3>
                <p className="mt-2 text-sm text-muted">{b.d}</p>
              </li>
            ))}
          </ul>
        </MotionSection>

        {/* Featured */}
        <MotionSection className="band-presence border-y border-[var(--color-glass-border)] py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-text">
                  Featured places
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-ink">
                  Live approved listings
                </h2>
              </div>
              <Link
                to="/browse"
                className="text-sm font-bold text-accent-text no-underline hover:underline"
              >
                Browse all →
              </Link>
            </div>
            {listError && (
              <p className="mt-6 rounded-lg bg-warning/15 px-4 py-3 text-sm text-warning ring-1 ring-warning/30">
                {listError}. Start the API on :5080 to load live rooms.
              </p>
            )}
            {!listError && listings.length === 0 && (
              <p className="mt-8 text-muted">
                No approved listings yet.{' '}
                <Link to="/browse" className="font-semibold text-accent-text">
                  Open browse
                </Link>{' '}
                or list the first room.
              </p>
            )}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <Card
                  key={l.id}
                  className="group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(232,177,104,0.18)] hover:ring-1 hover:ring-accent/25"
                >
                  <ListingCover
                    imageUrls={l.imageUrls}
                    alt={l.title}
                    overlay="glass"
                  />
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{l.adType}</Badge>
                        <Badge variant="verified">Reviewed</Badge>
                      </div>
                      <code>{l.publicCode}</code>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                      <Link
                        to={`/listings/${l.id}`}
                        className="text-ink no-underline group-hover:text-accent-text"
                      >
                        {l.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {l.city}, {l.district}
                    </p>
                    <p className="mt-3 text-lg font-bold tabular-nums text-ink">
                      {formatLkr(l.priceLkrMonth)}
                      <span className="text-sm font-medium text-muted">
                        /month
                      </span>
                    </p>
                    <TrustStrip dense className="mt-3" />
                    <Link
                      to={`/listings/${l.id}`}
                      className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-bold text-on-accent no-underline transition hover:brightness-105"
                    >
                      View details
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* Categories */}
        <MotionSection className="band-warm mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-ink">
            Search by district & campus corridor
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            Jump straight into browse with Sri Lanka–native filters — you are
            searching with thousands of local seekers in mind.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {DISTRICT_CHIPS.map((c) => (
              <Link
                key={c.label}
                to={`/browse?district=${encodeURIComponent(c.district)}`}
                className="rounded-full bg-accent/15 px-4 py-2 text-sm font-semibold text-ink ring-1 ring-accent/35 no-underline transition hover:bg-accent/25"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </MotionSection>

        {/* How it works — dark band with accent */}
        <MotionSection
          id="how-it-works"
          className="band-deep border-y border-[var(--color-glass-border)] py-12 text-white sm:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              How it works
            </h2>
            <div className="mt-6 inline-flex rounded-full bg-white/10 p-1 backdrop-blur-sm">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  track === 'renter'
                    ? 'bg-accent text-on-accent'
                    : 'text-white/80'
                }`}
                onClick={() => setTrack('renter')}
              >
                I’m a renter
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  track === 'landlord'
                    ? 'bg-accent text-on-accent'
                    : 'text-white/80'
                }`}
                onClick={() => setTrack('landlord')}
              >
                I’m a landlord
              </button>
            </div>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {(track === 'renter'
                ? [
                    {
                      n: '1',
                      t: 'Browse approved rooms',
                      d: 'Filter by district and budget. No phone spam in the open.',
                      img: illustrations.howRenterBrowse,
                    },
                    {
                      n: '2',
                      t: 'Sign in & unlock',
                      d: 'Reveal contact when you’re serious—then send an inquiry.',
                      img: illustrations.howRenterUnlock,
                    },
                    {
                      n: '3',
                      t: 'WhatsApp with a trail',
                      d: 'Open chat after the lead is logged. Optional viewing slots on Plus.',
                      img: illustrations.howRenterChat,
                    },
                  ]
                : [
                    {
                      n: '1',
                      t: 'Create advertiser account',
                      d: 'Starter is free with one live+pending ad.',
                      img: illustrations.howLandlordAccount,
                    },
                    {
                      n: '2',
                      t: 'Submit for review',
                      d: 'We approve quality ads before they hit the public feed.',
                      img: illustrations.howLandlordReview,
                    },
                    {
                      n: '3',
                      t: 'Grow with plans & boosts',
                      d: 'Add slots, run district or island boosts, reply in Inbox.',
                      img: illustrations.howLandlordGrow,
                    },
                  ]
              ).map((s) => (
                <li
                  key={`${track}-${s.n}`}
                  className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <SafeImage
                      src={s.img}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <span className="font-display text-3xl font-bold text-accent-text">
                      {s.n}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold">
                      {s.t}
                    </h3>
                    <p className="mt-2 text-sm text-white/75">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              {track === 'renter' ? (
                <Link
                  to="/browse"
                  className="inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-bold text-on-accent no-underline transition hover:brightness-105"
                >
                  Explore rooms
                </Link>
              ) : (
                <Link
                  to="/register?role=ADVERTISER"
                  className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-deep no-underline transition hover:bg-white/90"
                >
                  Post Ad — start free
                </Link>
              )}
            </div>
          </div>
        </MotionSection>

        {/* Plans */}
        <MotionSection id="plans" className="band-warm mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-text">
            Landlord packages
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Clear LKR plans. Start free.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Intake week? Boost district reach after you’re live. No fake
            countdown clocks—just slots and visibility you can explain.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const recommended = plan.code === 'growth'
              return (
                <Card
                  key={plan.code}
                  className={`flex flex-col p-5 transition hover:scale-[1.02] ${
                    recommended
                      ? 'border-accent shadow-[0_12px_40px_rgba(232,177,104,0.25)] ring-2 ring-accent'
                      : ''
                  }`}
                >
                  {recommended && (
                    <Badge variant="accent" className="mb-2 w-fit">
                      Recommended
                    </Badge>
                  )}
                  <h3 className="font-display text-xl font-bold text-ink">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-ink">
                    {formatLkr(plan.priceLkrMonth)}
                    {!plan.isFree && (
                      <span className="text-sm font-medium text-muted">
                        /30 days
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-sm text-muted">{plan.bestFor}</p>
                  <ul className="mt-4 flex-1 space-y-1 text-sm text-muted">
                    <li>
                      <strong className="text-ink">{plan.listingSlots}</strong>{' '}
                      live + pending ads
                    </li>
                    <li>
                      {plan.boostCreditsDistrict} district ·{' '}
                      {plan.boostCreditsIsland} island boost credits
                    </li>
                  </ul>
                  <Link
                    to={plan.isFree ? '/register?role=ADVERTISER' : '/pricing'}
                    className={`mt-5 rounded-lg px-4 py-2.5 text-center text-sm font-bold no-underline ${
                      recommended
                        ? 'bg-accent text-on-accent'
                        : 'bg-surface text-ink ring-1 ring-line'
                    }`}
                  >
                    {plan.isFree ? 'Start free' : 'View plans'}
                  </Link>
                </Card>
              )
            })}
          </div>
          {plans.length === 0 && (
            <p className="mt-6 text-muted">
              Plans load from the API. See{' '}
              <Link to="/pricing" className="font-semibold text-accent-text">
                /pricing
              </Link>
              .
            </p>
          )}
        </MotionSection>

        {/* Belonging */}
        <MotionSection className="band-presence border-y border-[var(--color-glass-border)] py-12 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-text">
              You’re not searching alone
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">
              Voices from the same corridors
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Real marketplace habits — not invented star counts. Ratings of 3–5
              publish automatically; tougher scores wait for a light check.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  q: '“Finally a site that doesn’t spray phone numbers everywhere.”',
                  a: 'Seeker · Colombo',
                  img: illustrations.howRenterBrowse,
                },
                {
                  q: '“Review queue feels slower than Facebook—but leads are cleaner.”',
                  a: 'Advertiser · Growth plan',
                  img: illustrations.howLandlordReview,
                },
                {
                  q: '“Inquiry inbox meant I knew who messaged before WhatsApp.”',
                  a: 'Advertiser · Moratuwa corridor',
                  img: illustrations.howRenterChat,
                },
              ].map((t) => (
                <blockquote
                  key={t.a}
                  className="glass-panel overflow-hidden rounded-2xl"
                >
                  <div className="aspect-[16/7] overflow-hidden">
                    <SafeImage
                      src={t.img}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-display text-lg text-ink">{t.q}</p>
                    <footer className="mt-3 text-sm font-semibold text-accent-text">
                      {t.a}
                    </footer>
                  </div>
                </blockquote>
              ))}
            </div>
          </div>
        </MotionSection>

        {/* FAQ */}
        <MotionSection className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-ink">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                defaultOpen={f.q === 'Does StaySpot hold rent money?'}
              />
            ))}
          </div>
        </MotionSection>

        {/* Contact */}
        <MotionSection
          id="contact"
          className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20"
        >
          <div className="relative overflow-hidden rounded-3xl bg-teal-deep px-6 py-10 text-white sm:px-10">
            <div className="glass-overlay pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold">Talk to us</h2>
              <p className="mt-2 max-w-xl text-white/80">
                Questions about listing, plans, or a campus intake week? Reach the
                StaySpot team.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-on-accent no-underline"
                >
                  Email {SUPPORT_EMAIL}
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-accent px-5 py-3 text-sm font-bold text-on-accent no-underline"
                >
                  WhatsApp StaySpot
                </a>
              </div>
            </div>
          </div>
        </MotionSection>
      </main>

      <footer className="band-deep relative overflow-hidden border-t border-white/10 text-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--color-surface)]/30 to-transparent opacity-40"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="font-display text-2xl font-bold">StaySpot</p>
            <p className="mt-2 text-sm text-white/70">
              Trust-first boarding marketplace for Sri Lanka.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/60">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/browse" className="text-white no-underline hover:underline">
                  Browse rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/register?role=SEEKER"
                  className="font-bold text-accent-text no-underline hover:underline"
                >
                  Create seeker account
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white no-underline hover:underline">
                  Landlord plans
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/60">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>Privacy (stub)</li>
              <li>Terms (stub)</li>
              <li>StaySpot does not hold rent</li>
            </ul>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} StaySpot · LKR · Sri Lanka
        </p>
      </footer>

      <MobileStickyCta />
    </div>
  )
}
