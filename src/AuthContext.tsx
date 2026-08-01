import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as api from './api'
import type { UserDto } from './api'

type AuthContextValue = {
  user: UserDto | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'SEEKER' | 'ADVERTISER'
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null)
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('stayspot_token'),
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function hydrate() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const profile = await api.me()
        if (!cancelled) setUser(profile)
      } catch {
        localStorage.removeItem('stayspot_token')
        if (!cancelled) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void hydrate()
    return () => {
      cancelled = true
    }
  }, [token])

  const persist = useCallback((auth: api.AuthResponse) => {
    localStorage.setItem('stayspot_token', auth.token)
    setToken(auth.token)
    setUser(auth.user)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      persist(await api.login(email, password))
    },
    [persist],
  )

  const register = useCallback(
    async (input: {
      email: string
      password: string
      firstName: string
      lastName: string
      role: 'SEEKER' | 'ADVERTISER'
    }) => {
      persist(await api.register(input))
    },
    [persist],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('stayspot_token')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
