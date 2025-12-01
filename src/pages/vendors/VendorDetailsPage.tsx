import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { vendors } from '@/utils/mockData'
import { FormSection } from '@/components/form/FormSection'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { VendorResponseTimeChart } from '@/components/charts/VendorResponseTimeChart'
import { VendorErrorRateChart } from '@/components/charts/VendorErrorRateChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

const vendorSchema = z.object({
  apiKey: z.string().min(3),
  secret: z.string().min(6),
  region: z.string(),
  environment: z.enum(['sandbox', 'production']),
  documentScan: z.boolean(),
  liveness: z.boolean(),
  watchlist: z.boolean(),
  faceMatch: z.boolean(),
  routingTag: z.string().min(2),
  notes: z.string().optional(),
  priority: z.array(z.number()).length(1),
})

type VendorFormValues = z.infer<typeof vendorSchema>

export default function VendorDetailsPage() {
  const navigate = useNavigate()
  const { vendorId } = useParams()
  const vendor = useMemo(() => vendors.find((item) => item.id === vendorId), [vendorId])

  const defaultValues: VendorFormValues = vendor
    ? {
        apiKey: vendor.apiKey,
        secret: vendor.secret,
        region: vendor.region,
        environment: vendor.sandbox ? 'sandbox' : 'production',
        documentScan: vendor.documentScan,
        liveness: vendor.liveness,
        watchlist: vendor.watchlist,
        faceMatch: vendor.faceMatch,
        routingTag: vendor.routingTag,
        notes: '',
        priority: [vendor.priority],
      }
    : {
        apiKey: '',
        secret: '',
        region: '',
        environment: 'sandbox',
        documentScan: false,
        liveness: false,
        watchlist: false,
        faceMatch: false,
        routingTag: '',
        notes: '',
        priority: [1],
      }

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues,
  })

  const onSubmit = (values: VendorFormValues) => {
    console.log('Submit vendor config', values)
  }

  if (!vendor) {
    return (
      <div className="space-y-4">
        <p>Vendor not found.</p>
        <Button variant="outline" onClick={() => navigate('/vendors')}>
          Back to vendors
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{vendor.name}</h1>
        <p className="text-muted-foreground">
          Manage credentials, toggles, routing, and performance insights.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <FormSection title="Credentials" description="API key and secrets">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>API key</Label>
                <Input {...register('apiKey')} />
              </div>
              <div className="space-y-2">
                <Label>Secret</Label>
                <Input type="password" {...register('secret')} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Region</Label>
                <Input {...register('region')} />
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Controller
                  name="environment"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </FormSection>
          <FormSection title="Feature toggles" description="Control available checks">
            <div className="grid gap-4 md:grid-cols-2">
              {['documentScan', 'liveness', 'watchlist', 'faceMatch'].map((feature) => (
                <div key={feature} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div>
                    <p className="capitalize">{feature.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-xs text-muted-foreground">Toggle module</p>
                  </div>
                  <Controller
                    name={feature as keyof VendorFormValues}
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              ))}
            </div>
          </FormSection>
          <FormSection title="Routing & priority" description="Drag and drop style ordering">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Priority order</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      value={field.value}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Drag the slider to adjust priority ({watch('priority')?.[0] ?? vendor.priority})
                </p>
              </div>
              <div className="space-y-2">
                <Label>Routing tag</Label>
                <Input {...register('routingTag')} />
              </div>
              <div className="space-y-2">
                <Label>Routing notes</Label>
                <Textarea {...register('notes')} placeholder="Describe routing overrides" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Document', 'Liveness', 'Watchlist', 'Face'].map((item, index) => (
                  <Badge key={item} variant={index === 0 ? 'success' : 'secondary'}>
                    {index + 1}. {item}
                  </Badge>
                ))}
              </div>
            </div>
          </FormSection>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              Save changes
            </Button>
            <Button variant='outline' type="button">
              Test connection
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response time</CardTitle>
            </CardHeader>
            <CardContent>
              <VendorResponseTimeChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Error rate</CardTitle>
            </CardHeader>
            <CardContent>
              <VendorErrorRateChart />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

