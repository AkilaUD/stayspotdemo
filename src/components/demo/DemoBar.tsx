import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DEMO_PASSWORD, demoPersonas, tokenForUser } from '../../demo/mockApi'
import { markSeedToursDone, storageKey } from '../../demo/onboarding'
import { resetStore } from '../../demo/store'

function currentDemoUserId(): string | null {
  const token = localStorage.getItem('stayspot_token')
  if (!token?.startsWith('demo.')) return null
  return token.slice('demo.'.length)
}

/**
 * Collapsible floating overlay — no document flow / sticky impact.
 * Collapsed by default so homepage + nav match production visually.
 */
export function DemoBar() {
  const [open, setOpen] = useState(true)
  const { pathname } = useLocation()
  const onLanding = pathname === '/'

  useEffect(() => {
    markSeedToursDone()
  }, [])

  function switchPersona(userId: string | null) {
    if (userId) {
      localStorage.setItem('stayspot_token', tokenForUser(userId))
    } else {
      localStorage.removeItem('stayspot_token')
    }
    markSeedToursDone()
    window.location.assign('/')
  }

  function resetDemo() {
    resetStore()
    localStorage.removeItem('stayspot_token')
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('stayspot.onboarding.')) localStorage.removeItem(key)
    }
    markSeedToursDone()
    window.location.assign('/')
  }

  function replayTour() {
    const userId = currentDemoUserId()
    if (!userId) return
    try {
      localStorage.removeItem(storageKey(userId))
    } catch {
      /* ignore */
    }
    window.location.assign(window.location.pathname + window.location.search)
  }

  const canTour = Boolean(currentDemoUserId())

  return (
    <div
      className={
        onLanding
          ? 'pointer-events-none fixed bottom-20 right-3 z-[100] flex flex-col items-end gap-2 md:bottom-3'
          : 'pointer-events-none fixed bottom-3 right-3 z-[100] flex flex-col items-end gap-2'
      }
      aria-label="StaySpot demo controls"
    >
      {open && (
        <div className="pointer-events-auto flex max-w-[min(100vw-1.5rem,22rem)] flex-wrap items-center justify-end gap-1.5 rounded-2xl border border-white/15 bg-teal-deep/95 px-3 py-2 text-xs text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:text-sm">
          <span className="mr-1 font-semibold tracking-tight">Offline demo</span>
          {demoPersonas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => switchPersona(p.userId)}
              className="rounded-lg bg-white/10 px-2 py-1 font-medium transition hover:bg-white/20"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={resetDemo}
            className="rounded-lg bg-accent/90 px-2 py-1 font-medium text-on-accent transition hover:bg-accent"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={replayTour}
            disabled={!canTour}
            title={
              canTour
                ? 'Replay onboarding for this persona'
                : 'Switch to a persona first'
            }
            className="rounded-lg bg-white/10 px-2 py-1 font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Tour
          </button>
          <span className="w-full text-right text-[10px] text-white/50 sm:w-auto sm:text-xs">
            {DEMO_PASSWORD}
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto rounded-full bg-teal-deep px-3 py-2 text-xs font-bold text-white shadow-lg ring-1 ring-white/20"
        aria-expanded={open}
      >
        {open ? 'Close demo' : 'Demo'}
      </button>
    </div>
  )
}
