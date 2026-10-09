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
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6">
          <div className="card max-w-sm p-8 text-center">
            <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full text-[var(--danger)]" style={{ background: 'var(--danger-tint)' }}>
              <AlertTriangle size={20} />
            </span>
            <h1 className="text-[17px] font-semibold">Something went wrong</h1>
            <p className="mt-1 text-[13px] text-muted">
              The demo hit an unexpected state. Reloading usually fixes it.
            </p>
            <button className="btn btn-primary mt-5" onClick={() => window.location.reload()}>
              <RotateCcw size={14} /> Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
