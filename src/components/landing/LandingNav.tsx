import { AnimatePresence, motion } from 'framer-motion'
import { LogIn, Menu, Moon, Search, Send, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-surface/95 shadow-[var(--glass-shadow)] backdrop-blur-xl supports-[backdrop-filter]:bg-surface/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <button
            type="button"
            className="rounded-xl p-2 text-ink hover:bg-[var(--color-glass-surface)] md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            to="/"
            className="shrink-0 font-display text-xl font-bold tracking-tight text-ink no-underline"
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
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
              <span className="hidden text-sm text-muted lg:inline">
                {user.displayName}
              </span>
              {user.role === 'ADVERTISER' ? (
                <>
                  <Link
                    to="/advertiser/ads"
                    className="hidden text-sm font-semibold text-ink no-underline md:inline"
                  >
                    My Ads
                  </Link>
                  <Link
                    to="/advertiser/publish"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-2.5 py-2 text-sm font-bold text-on-accent no-underline shadow-sm transition hover:brightness-105 sm:px-3"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    <span className="hidden sm:inline">Post Ad</span>
                    <span className="sm:hidden">Post</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-2.5 py-2 text-sm font-bold text-on-accent no-underline sm:px-3"
                >
                  <Search className="h-3.5 w-3.5" aria-hidden />
                  <span className="hidden sm:inline">Find a room</span>
                  <span className="sm:hidden">Find</span>
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] px-3 py-1.5 text-sm font-semibold text-ink sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/browse"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-2.5 py-2 text-sm font-bold text-on-accent no-underline shadow-sm transition hover:brightness-105 sm:px-3"
              >
                <Search className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Find a room</span>
                <span className="sm:hidden">Find</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-semibold text-ink no-underline ring-1 ring-[var(--color-glass-border)] hover:bg-[var(--color-glass-surface)] sm:px-3"
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                to="/register?role=ADVERTISER"
                className="hidden items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-bold text-on-accent no-underline shadow-sm transition hover:brightness-105 md:inline-flex"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
                Post Ad
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <motion.aside
            initial={reduce ? false : { x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-panel absolute inset-y-0 left-0 flex w-[min(100vw-3rem,18rem)] flex-col gap-1 border-r border-[var(--color-glass-border)] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">Menu</span>
              <button
                type="button"
                className="rounded-xl p-2 hover:bg-[var(--color-glass-surface)]"
                onClick={closeMenu}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {quietLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink no-underline hover:bg-[var(--color-glass-surface)]"
              >
                {l.label}
              </a>
            ))}
            <div className="my-2 border-t border-[var(--color-line)]" />
            {user ? (
              <>
                {user.role === 'ADVERTISER' && (
                  <>
                    <Link
                      to="/advertiser/ads"
                      onClick={closeMenu}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink no-underline hover:bg-[var(--color-glass-surface)]"
                    >
                      My Ads
                    </Link>
                    <Link
                      to="/advertiser/publish"
                      onClick={closeMenu}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink no-underline hover:bg-[var(--color-glass-surface)]"
                    >
                      Post Ad
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-[var(--color-glass-surface)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink no-underline hover:bg-[var(--color-glass-surface)]"
                >
                  Login
                </Link>
                <Link
                  to="/register?role=ADVERTISER"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink no-underline hover:bg-[var(--color-glass-surface)]"
                >
                  Post Ad
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink no-underline hover:bg-[var(--color-glass-surface)]"
                >
                  Create account
                </Link>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </header>
  )
}
