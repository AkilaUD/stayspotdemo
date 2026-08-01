import {
  createSeedState,
  DEMO_STORE_KEY,
  type DemoState,
} from './fixtures'

let memory: DemoState | null = null

function clone<T>(value: T): T {
  return structuredClone(value)
}

export function loadStore(): DemoState {
  if (memory) return memory
  try {
    const raw = localStorage.getItem(DEMO_STORE_KEY)
    if (raw) {
      memory = JSON.parse(raw) as DemoState
      return memory
    }
  } catch {
    /* fall through to seed */
  }
  memory = createSeedState()
  persistStore()
  return memory
}

export function persistStore(): void {
  if (!memory) return
  localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(memory))
}

export function updateStore(mutator: (state: DemoState) => void): DemoState {
  const state = loadStore()
  mutator(state)
  persistStore()
  return state
}

export function resetStore(): DemoState {
  memory = createSeedState()
  persistStore()
  return memory
}

export function getStoreSnapshot(): DemoState {
  return clone(loadStore())
}

export function nextId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
