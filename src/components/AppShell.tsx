import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  ClipboardCheck,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Search,
  Sparkles,
  Sun,
  Tag,
  X,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import {
  fadeUp,
  motionSafe,
  pageTransition,
  usePrefersReducedMotion,
} from '../lib/motion'
import { cn } from '../lib/utils'
import { OnboardingTour } from './OnboardingTour'
import { Button } from './ui/button'

function NavItem({
  to,
  icon: Icon,
  children,
  onNavigate,
  tourId,
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  children: ReactNode
  onNavigate?: () => void
  tourId?: string
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      data-tour={tourId}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium no-underline transition',
          isActive
            ? 'bg-accent/15 text-ink ring-1 ring-accent/30'
            : 'text-muted hover:bg-[var(--color-glass-surface)] hover:text-ink',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {children}
    </NavLink>
  )
}

const TOUR_ID_BY_PATH: Record<string, string> = {
  '/browse': 'nav-browse',
  '/advertiser/publish': 'nav-publish',
  '/advertiser/ads': 'nav-ads',
  '/inbox': 'nav-inbox',
  '/pricing': 'nav-pricing',
  '/seeker/premium': 'nav-premium',
  '/admin/analytics': 'nav-analytics',
  '/admin/postings': 'nav-postings',
}

export const OPEN_MOBILE_NAV_EVENT = 'stayspot:open-mobile-nav'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const reduceMotion = usePrefersReducedMotion()
  const isLanding = pathname === '/'

  useEffect(() => {
    function onOpenMobileNav() {
      setOpen(true)
    }
    window.addEventListener(OPEN_MOBILE_NAV_EVENT, onOpenMobileNav)
    return () => window.removeEventListener(OPEN_MOBILE_NAV_EVENT, onOpenMobileNav)
  }, [])

  if (isLanding) return <>{children}</>

  const roleLinks =
    user?.role === 'ADVERTISER'
      ? [
          { to: '/advertiser/publish', label: 'Create an Ad', icon: PlusCircle },
          { to: '/advertiser/ads', label: 'My Ads', icon: LayoutDashboard },
          { to: '/inbox', label: 'Inbox', icon: Inbox },
          { to: '/pricing', label: 'Plans', icon: Tag },
        ]
      : user?.role === 'SEEKER'
        ? [
            { to: '/inbox', label: 'Inquiries', icon: Inbox },
            { to: '/seeker/premium', label: 'Premium', icon: Sparkles },
            { to: '/pricing', label: 'Plans', icon: Tag },
          ]
        : user?.role === 'ADMIN'
          ? [
              { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
              {
                to: '/admin/postings',
                label: 'Ad Postings',
                icon: ClipboardCheck,
              },
            ]
          : []

  return (
    <div className="page-canvas min-h-screen text-ink">
      <OnboardingTour />
      <header className="glass-panel sticky top-0 z-40 border-b border-[var(--color-glass-border)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl p-2 text-ink hover:bg-[var(--color-glass-surface)] md:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="leading-tight">
              <Link
                to="/"
                className="font-display text-lg font-bold text-teal-deep no-underline dark:text-teal"
              >
                StaySpot
              </Link>
              {user && (
                <p className="hidden text-[11px] text-muted md:block">
                  Good to see you, {user.firstName}
                </p>
              )}
            </div>
            <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="App">
              <NavItem to="/browse" icon={Search} tourId="nav-browse">
                Browse
              </NavItem>
              {roleLinks.map((l) => (
                <NavItem
                  key={l.to}
                  to={l.to}
                  icon={l.icon}
                  tourId={TOUR_ID_BY_PATH[l.to]}
                >
                  {l.label}
                </NavItem>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggle}
              className="relative overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={reduceMotion ? false : { opacity: 0, rotate: -30, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, rotate: 30, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
            {loading ? (
              <span className="text-sm text-muted">…</span>
            ) : user ? (
              <>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-ink">
                    {user.initials}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{user.displayName}</p>
                    <p className="text-[11px] uppercase tracking-wide text-muted">
                      {user.role}
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button type="button" variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button type="button" size="sm">
                    Create account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={reduceMotion ? false : { x: -280 }}
            animate={{ x: 0 }}
            transition={motionSafe(reduceMotion, pageTransition)}
            className="glass-panel absolute inset-y-0 left-0 flex w-72 flex-col gap-2 border-r border-[var(--color-glass-border)] p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">Menu</span>
              <button
                type="button"
                className="rounded-xl p-2 hover:bg-[var(--color-glass-surface)]"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavItem to="/" icon={Home} onNavigate={() => setOpen(false)}>
              Home
            </NavItem>
            <NavItem
              to="/browse"
              icon={Search}
              tourId="nav-browse"
              onNavigate={() => setOpen(false)}
            >
              Browse
            </NavItem>
            {roleLinks.map((l) => (
              <NavItem
                key={l.to}
                to={l.to}
                icon={l.icon}
                tourId={TOUR_ID_BY_PATH[l.to]}
                onNavigate={() => setOpen(false)}
              >
                {l.label}
              </NavItem>
            ))}
          </motion.aside>
        </div>
      )}

      <motion.div
        id="app-main"
        key={pathname}
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
        transition={motionSafe(reduceMotion, pageTransition)}
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
      >
        {children}
      </motion.div>
    </div>
  )
}
