import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const steps = ['Welcome', 'Document', 'Capture', 'Selfie', 'Status']

export function VerificationWidget() {
  const [step, setStep] = useState(0)
  const [document, setDocument] = useState<File | null>(null)

  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1))
  const reset = () => {
    setStep(0)
    setDocument(null)
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verification widget</CardTitle>
            <CardDescription>Reusable embeddable flow</CardDescription>
          </div>
          <span className="text-sm text-muted-foreground">
            Step {step + 1} / {steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Welcome to the secure verification experience. You&apos;ll need a valid document and a
              selfie. This widget can be embedded in any client property.
            </p>
            <Button className="w-full" onClick={next}>
              Start verification
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2 text-left">
              <Label>Document type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driver">Driver license</SelectItem>
                  <SelectItem value="national">National ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={next}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Label htmlFor="document-upload">Upload document</Label>
            <Input
              id="document-upload"
              type="file"
              accept="image/*,application/pdf"
              onChange={(event) => setDocument(event.target.files?.[0] ?? null)}
            />
            {document && (
              <p className="text-xs text-muted-foreground">Selected {document.name}</p>
            )}
            <Button className="w-full" onClick={next} disabled={!document}>
              Upload & continue
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Align your face within the frame. We&apos;ll guide you through liveness gestures.
            </p>
            <div className="mx-auto h-48 w-48 rounded-full bg-muted" />
            <div className="flex gap-2">
              <Button variant="outline" className="w-full" onClick={reset}>
                Restart
              </Button>
              <Button className="w-full" onClick={next}>
                Submit selfie
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-3xl">
              ✓
            </div>
            <p className="text-lg font-semibold">Verification submitted</p>
            <p className="text-sm text-muted-foreground">
              You can safely close this widget. We&apos;ll redirect your browser shortly.
            </p>
            <Button className="w-full" onClick={reset}>
              Run again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

