import { AlertTriangle } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { illustrations } from './assets/illustrations'
import { Button } from './components/ui/button'
import { SafeImage } from './components/ui/safe-image'

type Props = { children: ReactNode }
type State = { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unexpected error' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('StaySpot UI error', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="glass-panel w-full rounded-2xl p-8">
            <SafeImage
              src={illustrations.errorGeneric}
              alt=""
              width={160}
              height={160}
              className="mx-auto h-36 w-36 rounded-2xl object-cover shadow-sm ring-1 ring-[var(--color-glass-border)]"
              fallback={<></>}
            />
            <div className="mx-auto mt-5 inline-flex rounded-2xl bg-warning/15 p-3 text-warning ring-1 ring-warning/30">
              <AlertTriangle className="h-6 w-6" aria-hidden />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-ink">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-muted">{this.state.message}</p>
            <Button
              type="button"
              className="mt-5"
              onClick={() => window.location.assign('/')}
            >
              Back to home
            </Button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
