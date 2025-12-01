import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { RequestsTable } from '@/components/tables/RequestsTable'
import { COUNTRIES, DOCUMENT_TYPES } from '@/utils/constants'
import { fetchRecentVerifications } from '@/utils/mockApi'
import type { VerificationRequest } from '@/utils/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const statuses = ['success', 'failed', 'review', 'pending']
const clients = ['Neo Bank', 'CryptoX', 'SkyTel']
const vendorsList = ['GBG', 'Veriff', 'Facephi', 'Onfido']

export default function RequestsPage() {
  const filters = useAppStore((state) => state.requestFilters)
  const updateFilters = useAppStore((state) => state.updateRequestFilters)
  const { data = [], isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: fetchRecentVerifications,
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredRequests = useMemo(() => {
    return data.filter((req) => {
      if (filters.client && req.client !== filters.client) return false
      if (filters.status && req.status !== filters.status) return false
      if (filters.vendor && req.vendor !== filters.vendor) return false
      if (filters.country && req.country !== filters.country) return false
      if (filters.documentType && req.document !== filters.documentType) return false
      return true
    })
  }, [data, filters])

  useEffect(() => {
    if (!filteredRequests.length) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !filteredRequests.some((req) => req.id === selectedId)) {
      setSelectedId(filteredRequests[0].id)
    }
  }, [filteredRequests, selectedId])

  const selectedRequest =
    filteredRequests.find((request) => request.id === selectedId) ?? filteredRequests[0] ?? null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Slice orchestration data by any dimension.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select
              value={filters.client}
              onValueChange={(value) => updateFilters({ client: value === 'all' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={filters.country}
              onValueChange={(value) => updateFilters({ country: value === 'all' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilters({ status: value === 'all' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Vendor</Label>
            <Select
              value={filters.vendor}
              onValueChange={(value) => updateFilters({ vendor: value === 'all' ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {vendorsList.map((vendor) => (
                  <SelectItem key={vendor} value={vendor}>
                    {vendor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Document type</Label>
            <Select
              value={filters.documentType}
              onValueChange={(value) =>
                updateFilters({ documentType: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {DOCUMENT_TYPES.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" />
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Verification requests</CardTitle>
            <CardDescription>Monitor orchestration and drill into details.</CardDescription>
          </CardHeader>
          <CardContent>
            <RequestsTable
              data={filteredRequests}
              selectedId={selectedRequest?.id}
              onSelect={(req) => setSelectedId(req.id)}
            />
            {isLoading && (
              <p className="mt-3 text-center text-sm text-muted-foreground">Loading requests…</p>
            )}
          </CardContent>
        </Card>
        <RequestPreview request={selectedRequest} />
      </div>
    </div>
  )
}

type PreviewProps = {
  request: VerificationRequest | null
}

function RequestPreview({ request }: PreviewProps) {
  if (!request) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Request preview</CardTitle>
          <CardDescription>Select a row to inspect details.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No requests match the selected filters.
        </CardContent>
      </Card>
    )
  }

  const timeline = [
    { label: 'Request received', time: request.timestamp, state: 'Received' },
    { label: `Vendor ${request.vendor} engaged`, time: addMs(request.timestamp, 30), state: 'Routing' },
    {
      label: 'Vendor responded',
      time: addMs(request.timestamp, 120),
      state: request.status === 'failed' ? 'Failed' : 'Completed',
    },
  ]

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{request.id}</CardTitle>
            <CardDescription>{new Date(request.timestamp).toLocaleString()}</CardDescription>
          </div>
          <Badge variant={statusVariant(request.status)}>{request.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <MetaRow label="Client" value={request.client} />
          <MetaRow label="Country" value={request.country} />
          <MetaRow label="Document" value={request.document} />
          <MetaRow label="Vendor" value={request.vendor} />
          <MetaRow label="Score" value={`${Math.round(request.score * 100)}%`} />
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" variant="secondary">
            Escalate
          </Button>
          <Button className="flex-1">View detail</Button>
        </div>
        <Separator />
        <div>
          <p className="font-semibold text-sm mb-2">Timeline</p>
          <ol className="space-y-2 text-sm">
            {timeline.map((item) => (
              <li key={item.label} className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.time).toLocaleTimeString()} · {item.state}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Separator />
        <Tabs defaultValue="summary" className="space-y-3">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="payload">Payload</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="text-sm text-muted-foreground">
            Risk score {Math.round(request.score * 100)}%. No watchlist matches. Liveness and face match
            passed within SLA.
          </TabsContent>
          <TabsContent value="vendors">
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-semibold">{request.vendor}</p>
              <p className="text-xs text-muted-foreground">Latency: ~3.2s</p>
            </div>
          </TabsContent>
          <TabsContent value="payload">
            <pre className="max-h-48 overflow-auto rounded bg-muted/50 p-3 text-xs">
              {JSON.stringify(request, null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function addMs(timestamp: string, offsetSeconds: number) {
  return new Date(new Date(timestamp).getTime() + offsetSeconds * 1000).toISOString()
}

function statusVariant(status: string) {
  if (status === 'success') return 'success'
  if (status === 'failed') return 'destructive'
  if (status === 'review') return 'warning'
  return 'secondary'
}
