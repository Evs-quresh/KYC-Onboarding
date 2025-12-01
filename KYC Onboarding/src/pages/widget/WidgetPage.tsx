import { VerificationWidget } from '@/components/widget/VerificationWidget'

export default function WidgetPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">End-user verification widget</h1>
        <p className="text-muted-foreground max-w-2xl">
          Drop-in React component that mirrors Veriff-style UX. It handles welcome, document capture,
          selfie, liveness, and status screens with redirect support.
        </p>
      </div>
      <VerificationWidget />
    </div>
  )
}

