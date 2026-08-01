import { AnimatePresence, motion } from 'framer-motion'
import { LogIn, Moon, Search, Send, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { useTheme } from '../../ThemeContext'
import { usePrefersReducedMotion } from '../../lib/motion'

const quietLinks = [
  { href: '/browse', label: 'Browse' },
  { href: '/#how-it-works', label: 'How it works' },
]

export function LandingNav() {
  const { user, loading, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const reduce = usePrefersReducedMotion()

  return (
    <header className="sticky top-10 z-50 border-b border-[var(--color-line)] bg-base/95 shadow-[var(--glass-shadow)] backdrop-blur-xl supports-[backdrop-filter]:bg-base/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-tight text-ink no-underline"
          >
            StaySpot
          </Link>
          <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
            {quietLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted no-underline transition-opacity hover:opacity-80 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="relative h-9 w-9 overflow-hidden rounded-xl text-ink hover:bg-[var(--color-glass-surface)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
          {loading ? (
            <span className="text-muted">…</span>
          ) : user ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">
                {user.displayName}
              </span>
              {user.role === 'ADVERTISER' ? (
                <>
                  <Link
                    to="/advertiser/ads"
                    className="hidden text-sm font-semibold text-ink no-underline sm:inline"
                  >
                    My Ads
                  </Link>
                  <Link
                    to="/advertiser/publish"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-deep px-3 py-2 text-sm font-bold text-white no-underline shadow-sm transition hover:brightness-110"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Post Ad
                  </Link>
                </>
              ) : (
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-bold text-[#132A22] no-underline"
                >
                  <Search className="h-3.5 w-3.5" aria-hidden />
                  Find a room
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] px-3 py-1.5 text-sm font-semibold text-ink"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/browse"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-bold text-[#132A22] no-underline shadow-sm transition hover:brightness-105"
              >
                <Search className="h-3.5 w-3.5" aria-hidden />
                Find a room
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink no-underline ring-1 ring-[var(--color-glass-border)] hover:bg-[var(--color-glass-surface)]"
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden />
                Login
              </Link>
              <Link
                to="/register?role=ADVERTISER"
                className="hidden items-center gap-1.5 rounded-xl bg-teal-deep px-3 py-2 text-sm font-bold text-white no-underline sm:inline-flex"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
                Post Ad
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
