import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Future backend phase: report to error tracking service.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mesh flex min-h-screen items-center justify-center p-6">
          <div className="card max-w-sm p-8 text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-[var(--danger)]">
              <AlertTriangle size={22} />
            </span>
            <h1 className="text-base font-bold">Something went wrong</h1>
            <p className="mt-1 text-sm text-muted">
              The demo hit an unexpected state. Reloading usually fixes it.
            </p>
            <button className="btn btn-primary mt-5" onClick={() => window.location.reload()}>
              <RotateCcw size={15} /> Reload app
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
