import { Component, type ReactNode } from "react"
import { Button } from "./ui/Button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen pt-24 flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-heading font-bold text-text mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-text-muted mb-6">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.href = "/"
                }}
              >
                Go Home
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
