import React from 'react'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-4">
                <p>Er is een fout opgetreden bij het laden van deze pagina.</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Foutdetails:</p>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {this.state.error?.message || 'Onbekende fout'}
                  </code>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  Pagina herladen
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}

// Simple error display component for API errors
export function ErrorDisplay({ 
  error, 
  retry, 
  className = "" 
}: { 
  error: string | null
  retry?: () => void
  className?: string 
}) {
  if (!error) return null

  return (
    <Alert variant="destructive" className={className}>
      <AlertDescription>
        <div className="space-y-2">
          <p>{error}</p>
          {retry && (
            <Button onClick={retry} variant="outline" size="sm">
              Opnieuw proberen
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

// Loading spinner component
export function LoadingSpinner({ 
  size = "md", 
  className = "" 
}: { 
  size?: "sm" | "md" | "lg"
  className?: string 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
    </div>
  )
}

// Loading skeleton for cards
export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}