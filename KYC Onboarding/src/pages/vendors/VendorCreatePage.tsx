import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSection } from '@/components/form/FormSection'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SUPPORTED_CHECKS } from '@/utils/constants'
import { Badge } from '@/components/ui/badge'

const createSchema = z.object({
  name: z.string().min(2),
  logo: z.string().url('Provide a logo URL'),
  status: z.enum(['online', 'degraded', 'offline']),
  region: z.string().min(2),
  latency: z.number().min(0).max(15),
  apiKey: z.string().min(3),
  secret: z.string().min(6),
  environment: z.enum(['sandbox', 'production']),
  documentScan: z.boolean(),
  liveness: z.boolean(),
  watchlist: z.boolean(),
  faceMatch: z.boolean(),
  supportedChecks: z.array(z.string()).min(1, 'Select at least one check'),
  routingTag: z.string().min(2),
  description: z.string().optional(),
})

type CreateVendorValues = z.infer<typeof createSchema>

const defaultValues: CreateVendorValues = {
  name: '',
  logo: 'https://dummyimage.com/120x40/1d4ed8/fff&text=Vendor',
  status: 'online',
  region: 'Global',
  latency: 3.2,
  apiKey: '',
  secret: '',
  environment: 'sandbox',
  documentScan: true,
  liveness: true,
  watchlist: true,
  faceMatch: true,
  supportedChecks: ['Document'],
  routingTag: 'new-vendor',
  description: '',
}

export default function VendorCreatePage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateVendorValues>({
    resolver: zodResolver(createSchema),
    defaultValues,
  })

  const onSubmit = (values: CreateVendorValues) => {
    console.table(values)
    navigate('/vendors')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Add vendor</h1>
          <p className="text-muted-foreground">
            Provide detailed integration info to enable orchestration routing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/vendors')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save vendor
          </Button>
        </div>
      </div>

      <FormSection title="Vendor basics" description="Identity, status, and SLA metrics.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Facephi" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input {...register('logo')} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Primary region</Label>
            <Input {...register('region')} />
          </div>
          <div className="space-y-2">
            <Label>Average latency (seconds)</Label>
            <Input type="number" step="0.1" {...register('latency', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Routing tag</Label>
            <Input {...register('routingTag')} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Credentials" description="Secure access for sandbox or production.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>API key</Label>
            <Input {...register('apiKey')} />
          </div>
          <div className="space-y-2">
            <Label>Secret</Label>
            <Input type="password" {...register('secret')} />
          </div>
          <div className="space-y-2">
            <Label>Environment</Label>
            <Controller
              name="environment"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Description / notes</Label>
            <Textarea rows={3} {...register('description')} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Capabilities" description="Enable supported checks & modules.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { key: 'documentScan', label: 'Document scan' },
            { key: 'liveness', label: 'Liveness' },
            { key: 'watchlist', label: 'Watchlist' },
            { key: 'faceMatch', label: 'Face match' },
          ].map((feature) => (
            <div key={feature.key} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div>
                <p className="font-medium">{feature.label}</p>
                <p className="text-xs text-muted-foreground">Toggle module support.</p>
              </div>
              <Controller
                name={feature.key as keyof CreateVendorValues}
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label>Supported checks</Label>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CHECKS.map((check) => {
              const active = watch('supportedChecks')?.includes(check)
              return (
                <Badge
                  key={check}
                  variant={active ? 'success' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => {
                    const current = watch('supportedChecks') ?? []
                    const next = active
                      ? current.filter((item) => item !== check)
                      : [...current, check]
                    setValue('supportedChecks', next, { shouldValidate: true })
                  }}
                >
                  {check}
                </Badge>
              )
            })}
          </div>
          {errors.supportedChecks && (
            <p className="text-xs text-destructive">{errors.supportedChecks.message}</p>
          )}
        </div>
      </FormSection>
    </form>
  )
}

