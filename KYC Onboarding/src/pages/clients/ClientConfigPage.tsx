import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { clients } from '@/utils/mockData'
import { FormSection } from '@/components/form/FormSection'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const schema = z.object({
  name: z.string().min(2),
  apiKey: z.string().min(3),
  workflow: z.enum(['Primary', 'Fallback', 'Parallel']),
  allowedVendors: z.array(z.string()).min(1),
  scoreThreshold: z.number().min(0).max(1),
  reviewThreshold: z.number().min(0).max(1),
  webhook: z.string().url(),
  notes: z.string().optional(),
})

type ClientValues = z.infer<typeof schema>

export default function ClientConfigPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const client = useMemo(() => clients.find((item) => item.id === clientId), [clientId])
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ClientValues>({
    resolver: zodResolver(schema),
    defaultValues: client
      ? {
          name: client.name,
          apiKey: client.apiKey,
          workflow: client.flow,
          allowedVendors: client.allowedVendors,
          scoreThreshold: client.thresholds.score,
          reviewThreshold: client.thresholds.manualReview,
          webhook: client.webhooks[0],
          notes: '',
        }
      : undefined,
  })

  const onSubmit = (values: ClientValues) => {
    console.log('Client config', values)
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <p>Client not found.</p>
        <Button variant="outline" onClick={() => navigate('/clients')}>
          Back to clients
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        <p className="text-muted-foreground">Configure workflows and thresholds.</p>
      </div>
      <FormSection title="Basic info">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Client name</Label>
            <Input {...register('name')} />
          </div>
          <div className="space-y-2">
            <Label>API key</Label>
            <Input {...register('apiKey')} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Allowed vendors">
        <Controller
          name="allowedVendors"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {['GBG', 'Veriff', 'Facephi', 'Onfido'].map((vendor) => {
                const active = field.value?.includes(vendor)
                return (
                  <Badge
                    key={vendor}
                    variant={active ? 'success' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() =>
                      field.onChange(
                        active
                          ? field.value.filter((value) => value !== vendor)
                          : [...(field.value ?? []), vendor],
                      )
                    }
                  >
                    {vendor}
                  </Badge>
                )
              })}
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Workflow">
        <Controller
          name="workflow"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary">Primary vendor</SelectItem>
                <SelectItem value="Fallback">Fallback orchestration</SelectItem>
                <SelectItem value="Parallel">Parallel vendors</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormSection>

      <FormSection title="Thresholds">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Auto approve score</Label>
            <Input type="number" step="0.05" min="0" max="1" {...register('scoreThreshold', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Manual review score</Label>
            <Input
              type="number"
              step="0.05"
              min="0"
              max="1"
              {...register('reviewThreshold', { valueAsNumber: true })}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Webhooks & notes">
        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <Input {...register('webhook')} />
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea rows={4} {...register('notes')} />
        </div>
      </FormSection>

      <Button type="submit" disabled={isSubmitting}>
        Save configuration
      </Button>
    </form>
  )
}

