import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchClients } from '@/utils/mockApi'
import type { Client } from '@/utils/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const STEP_ORDER = ['info', 'documents', 'review', 'complete'] as const
type Step = (typeof STEP_ORDER)[number]

type InfoForm = {
  fullName: string
  email: string
  phone: string
  gender: string
  country: string
  address: string
  nationalId: string
}

type DocumentState = {
  front: File | null
  back: File | null
  selfie: File | null
  notes: string
}

export default function ClientOnboardingPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: fetchClients })
  const client = useMemo<Client | undefined>(
    () => clients.find((item) => item.id === clientId),
    [clients, clientId],
  )

  const [step, setStep] = useState<Step>('info')
  const [info, setInfo] = useState<InfoForm>({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    country: '',
    address: '',
    nationalId: '',
  })
  const [documents, setDocuments] = useState<DocumentState>({
    front: null,
    back: null,
    selfie: null,
    notes: '',
  })

  if (!client) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 text-center">
        <p className="text-lg font-semibold">Client not found</p>
        <p className="text-muted-foreground">
          The onboarding link may be invalid or has expired. Please contact support.
        </p>
      </div>
    )
  }

  const enabledFields = Object.entries(client.onboardingConfig.fields).filter(([, enabled]) => enabled)

  const nextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(step)
    setStep(STEP_ORDER[Math.min(currentIndex + 1, STEP_ORDER.length - 1)])
  }

  const prevStep = () => {
    const currentIndex = STEP_ORDER.indexOf(step)
    setStep(STEP_ORDER[Math.max(currentIndex - 1, 0)])
  }

  const handleFileChange = (key: keyof DocumentState, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
        <Card className="w-full lg:w-72">
          <CardHeader>
            <CardTitle>{client.name}</CardTitle>
            <CardDescription>Universal KYC Onboarding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="success">{client.status}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Steps</p>
              <ol className="space-y-2 text-sm">
                {STEP_ORDER.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        step === item ? 'bg-primary' : 'bg-muted-foreground/50'
                      }`}
                    />
                    <span className={step === item ? 'font-semibold' : ''}>{stepLabel(item)}</span>
                  </li>
                ))}
              </ol>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              Back to dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{stepLabel(step)}</CardTitle>
            <CardDescription>
              {step === 'info' && 'Provide your details securely to start verification.'}
              {step === 'documents' && 'Upload your identity documents for validation.'}
              {step === 'review' && 'Confirm the scanned data before submission.'}
              {step === 'complete' && 'All set! Your submission is with the compliance team.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'info' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {enabledFields.map(([key]) => (
                    <div key={key} className="space-y-2">
                      <Label>{formatFieldLabel(key)}</Label>
                      <Input
                        value={info[key as keyof InfoForm]}
                        onChange={(event) =>
                          setInfo((prev) => ({
                            ...prev,
                            [key]: event.target.value,
                          }))
                        }
                        placeholder={`Enter ${formatFieldLabel(key)}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <div />
                  <Button onClick={nextStep} disabled={enabledFields.some(([key]) => !info[key as keyof InfoForm])}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 'documents' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {client.onboardingConfig.documents.front && (
                    <DocumentUpload
                      label="Document front"
                      file={documents.front}
                      onChange={(file) => handleFileChange('front', file)}
                    />
                  )}
                  {client.onboardingConfig.documents.back && (
                    <DocumentUpload
                      label="Document back"
                      file={documents.back}
                      onChange={(file) => handleFileChange('back', file)}
                    />
                  )}
                </div>
                {client.onboardingConfig.documents.selfie && (
                  <DocumentUpload
                    label="Selfie / Liveness"
                    file={documents.selfie}
                    onChange={(file) => handleFileChange('selfie', file)}
                  />
                )}
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep}>Continue</Button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="mb-2 text-sm font-semibold">Captured data</p>
                  <dl className="grid gap-3 text-sm md:grid-cols-2">
                    {enabledFields.map(([key]) => (
                      <div key={key} className="rounded border px-3 py-2">
                        <dt className="text-muted-foreground">{formatFieldLabel(key)}</dt>
                        <dd className="font-medium">{info[key as keyof InfoForm] || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <Tabs defaultValue="documents">
                  <TabsList>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="documents" className="space-y-2 text-sm">
                    {(['front', 'back', 'selfie'] as Array<
                      keyof Client['onboardingConfig']['documents']
                    >).map((key) => {
                      const enabled = client.onboardingConfig.documents[key]
                      if (!enabled) return null
                      const file = documents[key]
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg border px-3 py-2"
                        >
                          <span className="capitalize">{key}</span>
                          <Badge variant={file ? 'success' : 'secondary'}>
                            {file ? 'Uploaded' : 'Pending'}
                          </Badge>
                        </div>
                      )
                    })}
                  </TabsContent>
                  <TabsContent value="notes">
                    <Textarea
                      rows={3}
                      placeholder="Add any additional comments"
                      value={documents.notes}
                      onChange={(event) =>
                        setDocuments((prev) => ({ ...prev, notes: event.target.value }))
                      }
                    />
                  </TabsContent>
                </Tabs>
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep}>Submit for review</Button>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                  ✓
                </div>
                <p className="text-lg font-semibold">Submission received</p>
                <p className="text-sm text-muted-foreground">
                  Your documents are under review. You will get an email update once a decision is made.
                </p>
                <Separator />
                <Button onClick={() => navigate('/')}>Return to website</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DocumentUpload({
  label,
  file,
  onChange,
}: {
  label: string
  file: File | null
  onChange: (file: File | null) => void
}) {
  return (
    <label className="flex flex-col rounded-lg border border-dashed p-4 text-sm">
      <span className="font-semibold">{label}</span>
      <span className="text-xs text-muted-foreground">
        Accepted formats: JPG, PNG, PDF. Max 10MB.
      </span>
      <Input
        type="file"
        className="mt-3"
        accept="image/*,application/pdf"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {file && <p className="mt-2 text-xs text-muted-foreground">Uploaded: {file.name}</p>}
    </label>
  )
}

function formatFieldLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

function stepLabel(step: Step) {
  switch (step) {
    case 'info':
      return 'Customer information'
    case 'documents':
      return 'Identity documents'
    case 'review':
      return 'Review & confirm'
    case 'complete':
      return 'Completed'
    default:
      return step
  }
}

