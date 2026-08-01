import { motion } from 'framer-motion'
import { LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { illustrations } from '../assets/illustrations'
import { useAuth } from '../AuthContext'
import { Alert } from '../components/ui/feedback'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input, Label } from '../components/ui/input'
import { fadeUp, slideLeft, softTransition, usePrefersReducedMotion } from '../lib/motion'
import { SafeImage } from '../components/ui/safe-image'
import { safeNextPath, TrustStrip } from '../components/ui/conversion'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email, password)
      navigate(safeNextPath(params.get('next'), '/browse'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const reduceMotion = usePrefersReducedMotion()

  return (
    <div className="page-canvas grid min-h-[70vh] items-center gap-10 lg:grid-cols-2">
      <motion.div
        variants={slideLeft}
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
        transition={softTransition}
        className="relative hidden overflow-hidden rounded-3xl lg:block"
      >
        <SafeImage
          src={illustrations.authLogin}
          alt="Modern room interior"
          width={800}
          height={1067}
          overlay="glass"
          className="h-full min-h-[520px] w-full"
          loading="lazy"
          fallback={
            <div className="relative flex min-h-[520px] w-full items-end bg-gradient-to-br from-teal-deep to-teal p-8 text-white">
              <div className="glass-overlay absolute inset-0" aria-hidden />
              <p className="relative font-display text-3xl font-bold">Welcome back</p>
            </div>
          }
        />
        <div className="glass-overlay absolute inset-0 opacity-50" aria-hidden />
        <div className="absolute bottom-0 space-y-3 p-8 text-white">
          <p className="font-display text-3xl font-bold">Welcome back</p>
          <p className="max-w-sm text-white/85">
            You’re rejoining students, workers, and landlords who keep contact
            private until it matters.
          </p>
          <TrustStrip className="text-white/90 [&_span]:text-white/85" />
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
        transition={softTransition}
      >
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-accent/15 p-2 text-accent">
                <LockKeyhole className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">
                  Sign in
                </h1>
                <p className="text-sm text-muted">Access your StaySpot account</p>
              </div>
            </div>
            <form className="grid gap-4" onSubmit={onSubmit}>
              {error && <Alert variant="error">{error}</Alert>}
              <Label required>
                Email
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Label>
              <Label required>
                Password
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Label>
              <Button type="submit" loading={busy} className="w-full">
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted">
              No account?{' '}
              <Link to="/register" className="font-semibold text-accent-text">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
