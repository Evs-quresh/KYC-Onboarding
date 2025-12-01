import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recentVerifications } from '@/utils/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

const checklist = [
  { label: 'Document checks', status: true },
  { label: 'MRZ match', status: true },
  { label: 'Hologram', status: false },
  { label: 'Expiry valid', status: true },
  { label: 'Face match ≥ 92%', status: true },
  { label: 'Liveness', status: true },
  { label: 'Watchlist', status: false },
]

export default function RequestDetailsPage() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const request = useMemo(
    () => recentVerifications.find((item) => item.id === requestId),
    [requestId],
  )

  if (!request) {
    return (
      <div className="space-y-4">
        <p>Request not found.</p>
        <Button variant="outline" onClick={() => navigate('/requests')}>
          Back to list
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr_260px]">
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Client</p>
            <p className="font-semibold">{request.client}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Vendor</p>
            <p className="font-semibold">{request.vendor}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Document</p>
            <p className="font-semibold">{request.document}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Country</p>
            <p className="font-semibold">{request.country}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Risk score</p>
            <Badge variant="secondary" className="text-lg">
              {Math.round(request.score * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Media evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="front" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="front">Front</TabsTrigger>
              <TabsTrigger value="back">Back</TabsTrigger>
              <TabsTrigger value="selfie">Selfie</TabsTrigger>
              <TabsTrigger value="video">Liveness</TabsTrigger>
            </TabsList>
            {['front', 'back', 'selfie', 'video'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="flex h-64 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                  {tab === 'video' ? 'Video playback placeholder' : 'Image preview placeholder'}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {checklist.map((item) => (
            <label key={item.label} className="flex items-center gap-3 text-sm">
              <Checkbox checked={item.status} disabled />
              {item.label}
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Raw JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <details className="rounded-lg border bg-muted/40 p-4" open>
            <summary className="cursor-pointer font-semibold">View payload</summary>
            <pre className="mt-4 max-h-64 overflow-auto text-xs">
              {JSON.stringify(
                {
                  request,
                  checks: checklist,
                  media: ['front', 'back', 'selfie', 'video'],
                },
                null,
                2,
              )}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}

