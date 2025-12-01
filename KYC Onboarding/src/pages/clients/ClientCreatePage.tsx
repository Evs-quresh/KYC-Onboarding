import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSection } from '@/components/form/FormSection'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { SUPPORTED_CHECKS } from '@/utils/constants'

const vendors = ['GBG', 'Veriff', 'Facephi', 'Onfido']

const schema = z.object({
  name: z.string().min(2),
  apiKey: z.string().min(5),
  status: z.enum(['Active', 'Paused']),
  riskProfile: z.enum(['Low', 'Medium', 'High']),
  workflow: z.enum(['Primary', 'Fallback', 'Parallel']),
  allowedVendors: z.array(z.string()).min(1, 'Select at least one vendor'),
  scoreThreshold: z.number().min(0).max(1),
  manualReviewThreshold: z.number().min(0).max(1),
  webhookUrl: z.string().url(),
  webhookSecret: z.string().min(6),
  webhooks: z.string().optional(),
  notes: z.string().optional(),
})

type ClientFormValues = z.infer<typeof schema>

const defaultValues: ClientFormValues = {
  name: '',
  apiKey: 'client_live_',
  status: 'Active',
  riskProfile: 'Medium',
  workflow: 'Primary',
  allowedVendors: ['GBG'],
  scoreThreshold: 0.75,
  manualReviewThreshold: 0.55,
  webhookUrl: 'https://client.app/webhooks/kyc',
  webhookSecret: 'super-secret',
  webhooks: '',
  notes: '',
}

export default function ClientCreatePage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = (values: ClientFormValues) => {
    console.log('Create client payload', {
      ...values,
      extraWebhooks: values.webhooks
        ?.split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    })
    navigate('/clients')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Create client</h1>
          <p className="text-muted-foreground">
            Configure vendor orchestration, workflows, thresholds, and webhooks for a new client.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/clients')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save client'}
          </Button>
        </div>
      </div>

      <FormSection title="Basic info" description="Identity, status, and risk posture.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Client name</Label>
            <Input {...register('name')} placeholder="Neo Bank" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>API key</Label>
            <Input {...register('apiKey')} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={watch('status')} onValueChange={(value) => setValue('status', value as ClientFormValues['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Risk profile</Label>
            <Select
              value={watch('riskProfile')}
              onValueChange={(value) => setValue('riskProfile', value as ClientFormValues['riskProfile'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection title="Allowed vendors" description="Select at least one vendor and checks.">
        <div className="flex flex-wrap gap-2">
          {vendors.map((vendor) => {
            const active = watch('allowedVendors')?.includes(vendor)
            return (
              <Badge
                key={vendor}
                variant={active ? 'success' : 'secondary'}
                className="cursor-pointer"
                onClick={() => {
                  const current = watch('allowedVendors') ?? []
                  const next = active ? current.filter((item) => item !== vendor) : [...current, vendor]
                  setValue('allowedVendors', next, { shouldValidate: true })
                }}
              >
                {vendor}
              </Badge>
            )
          })}
        </div>
        {errors.allowedVendors && (
          <p className="text-xs text-destructive">{errors.allowedVendors.message}</p>
        )}
        <div className="flex flex-wrap gap-2 pt-3">
          {SUPPORTED_CHECKS.map((check) => (
            <Badge key={check} variant="secondary">
              {check}
            </Badge>
          ))}
        </div>
      </FormSection>

      <FormSection title="Workflow" description="Define routing logic between primary / fallback vendors.">
        <RadioGroup
          value={watch('workflow')}
          onValueChange={(value) => setValue('workflow', value as ClientFormValues['workflow'])}
          className="grid gap-3 md:grid-cols-3"
        >
          {['Primary', 'Fallback', 'Parallel'].map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"
            >
              <RadioGroupItem value={option} />
              <div>
                <p className="font-semibold">{option}</p>
                <p className="text-xs text-muted-foreground">
                  {option === 'Primary' && 'Single vendor with auto retry'}
                  {option === 'Fallback' && 'Cascade to secondary on failure'}
                  {option === 'Parallel' && 'Fire vendors simultaneously'}
                </p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </FormSection>

      <FormSection title="Thresholds" description="Set decision boundaries for automation.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Auto approve score</Label>
            <Input
              type="number"
              step="0.05"
              min="0"
              max="1"
              {...register('scoreThreshold', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Manual review score</Label>
            <Input
              type="number"
              step="0.05"
              min="0"
              max="1"
              {...register('manualReviewThreshold', { valueAsNumber: true })}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Webhooks" description="Notification endpoints for orchestration events.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary webhook URL</Label>
            <Input {...register('webhookUrl')} />
          </div>
          <div className="space-y-2">
            <Label>Webhook secret</Label>
            <Input type="password" {...register('webhookSecret')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Additional webhook URLs (one per line)</Label>
          <Textarea rows={3} placeholder="https://..." {...register('webhooks')} />
        </div>
      </FormSection>

      <FormSection title="Notes" description="Optional metadata that impacts orchestration.">
        <Textarea rows={4} {...register('notes')} placeholder="Risk overrides, contract terms, etc." />
      </FormSection>
    </form>
  )
}

