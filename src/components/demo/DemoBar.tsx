import { DEMO_PASSWORD, demoPersonas, tokenForUser } from '../../demo/mockApi'
import { resetStore } from '../../demo/store'

export function DemoBar() {
  function switchPersona(userId: string | null) {
    if (userId) {
      localStorage.setItem('stayspot_token', tokenForUser(userId))
    } else {
      localStorage.removeItem('stayspot_token')
    }
    // Keep onboarding flags so persona switch does not force the tour again
    window.location.assign('/')
  }

  function resetDemo() {
    resetStore()
    localStorage.removeItem('stayspot_token')
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('stayspot.onboarding.')) localStorage.removeItem(key)
    }
    window.location.assign('/')
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[100] border-b border-teal-deep/20 bg-teal-deep text-white">
      <div className="mx-auto flex h-10 max-w-7xl flex-wrap items-center gap-2 overflow-x-auto px-3 text-xs sm:gap-3 sm:px-4 sm:text-sm">
        <span className="font-semibold tracking-tight">StaySpot Demo</span>
        <span className="hidden text-white/70 sm:inline">Offline · no backend</span>
        <div className="flex flex-wrap items-center gap-1.5 sm:ml-2">
          {demoPersonas.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => switchPersona(p.userId)}
              className="rounded-md bg-white/10 px-2 py-1 font-medium transition hover:bg-white/20"
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={resetDemo}
          className="rounded-md bg-accent/90 px-2 py-1 font-medium text-[#132A22] transition hover:bg-accent"
        >
          Reset data
        </button>
        <span className="ml-auto hidden text-white/60 lg:inline">
          Password for all personas: {DEMO_PASSWORD}
        </span>
      </div>
    </div>
  )
}
