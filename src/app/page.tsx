import { Suspense } from 'react'
import { Button } from '@/tokens/src/components/Button'

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Noidlux
        </h1>
        <Suspense fallback={<LoadingFallback />}>
          <div className="flex flex-col items-center space-y-4">
            <Button 
              variant="primary" 
              size="lg"
              aria-label="Get started with Noidlux platform"
            >
              Get Started
            </Button>
            <p className="text-center text-gray-600 max-w-md">
              Experience luxury digital solutions with Fortune-500 polish and accessibility-first design.
            </p>
          </div>
        </Suspense>
      </div>
    </main>
  )
}