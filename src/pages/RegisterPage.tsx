import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { illustrations } from '../assets/illustrations'
import { useAuth } from '../AuthContext'
import { Alert } from '../components/ui/feedback'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input, Label } from '../components/ui/input'
import { fadeUp, slideLeft, softTransition, usePrefersReducedMotion } from '../lib/motion'
import { cn } from '../lib/utils'
import { SafeImage } from '../components/ui/safe-image'
import { safeNextPath, TrustStrip } from '../components/ui/conversion'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState<1 | 2>(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'SEEKER' | 'ADVERTISER'>('SEEKER')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const r = (params.get('role') || '').toUpperCase()
    if (r === 'ADVERTISER' || r === 'SEEKER') setRole(r)
  }, [params])

  function onNext(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setStep(2)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await register({ email, password, firstName, lastName, role })
      const fallback =
        role === 'ADVERTISER' ? '/advertiser/publish?welcome=1' : '/browse'
      navigate(safeNextPath(params.get('next'), fallback))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
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
          src={illustrations.authRegister}
          alt="Boarding house exterior"
          width={800}
          height={1067}
          overlay="glass"
          className="h-full min-h-[560px] w-full"
          loading="lazy"
          fallback={
            <div className="relative flex min-h-[560px] w-full items-end bg-gradient-to-br from-teal-deep to-teal p-8 text-white">
              <div className="glass-overlay absolute inset-0" aria-hidden />
              <p className="relative font-display text-3xl font-bold">Join StaySpot</p>
            </div>
          }
        />
        <div className="glass-overlay absolute inset-0 opacity-50" aria-hidden />
        <div className="absolute bottom-0 space-y-3 p-8 text-white">
          <p className="font-display text-3xl font-bold">Join StaySpot</p>
          <p className="max-w-sm text-white/85">
            Renters browse free. Landlords start with one free Starter slot —
            same calm review queue as everyone else.
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
        <Card className="mx-auto max-w-lg">
          <CardContent className="pt-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-accent/15 p-2 text-accent">
                <UserPlus className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">
                  Create account
                </h1>
                <p className="text-sm text-muted">
                  {step === 1
                    ? 'Step 1 — email & password'
                    : 'Step 2 — name & role'}
                </p>
              </div>
            </div>

            {step === 1 ? (
              <form className="grid gap-4" onSubmit={onNext}>
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
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Label>
                <Button type="submit" className="w-full">
                  Next
                </Button>
              </form>
            ) : (
              <form className="grid gap-4" onSubmit={onSubmit}>
                {error && <Alert variant="error">{error}</Alert>}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={cn(
                      'rounded-xl border px-3 py-3 text-left text-sm font-semibold transition',
                      role === 'SEEKER'
                        ? 'border-accent bg-accent/15 text-ink'
                        : 'border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] text-muted hover:border-accent/40',
                    )}
                    onClick={() => setRole('SEEKER')}
                  >
                    Find a place
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded-xl border px-3 py-3 text-left text-sm font-semibold transition',
                      role === 'ADVERTISER'
                        ? 'border-accent bg-accent/15 text-ink'
                        : 'border-[var(--color-glass-border)] bg-[var(--color-glass-surface)] text-muted hover:border-accent/40',
                    )}
                    onClick={() => setRole('ADVERTISER')}
                  >
                    List a place
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Label required>
                    First name
                    <Input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Label>
                  <Label required>
                    Last name
                    <Input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setError(null)
                      setStep(1)
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit" loading={busy} className="flex-1">
                    {busy ? 'Creating…' : 'Create account'}
                  </Button>
                </div>
              </form>
            )}
            <p className="mt-5 text-center text-sm text-muted">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-accent-text">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
