import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchClients } from '@/utils/mockApi'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { Client } from '@/utils/types'

export function ClientsTable() {
  const { data = [] } = useQuery({ queryKey: ['clients'], queryFn: fetchClients })
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [configs, setConfigs] = useState<Record<string, Client['onboardingConfig']>>({})

  useEffect(() => {
    const map = data.reduce<Record<string, Client['onboardingConfig']>>((acc, client) => {
      acc[client.id] = client.onboardingConfig
      return acc
    }, {})
    setConfigs(map)
  }, [data])

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'

  const onboardingLink = useMemo(() => {
    if (!activeClient) return ''
    return `${baseUrl}/onboard/${activeClient.id}`
  }, [activeClient, baseUrl])

  const toggleField = (clientId: string, field: keyof Client['onboardingConfig']['fields']) => {
    setConfigs((prev) => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        fields: {
          ...prev[clientId].fields,
          [field]: !prev[clientId].fields[field],
        },
        documents: prev[clientId].documents,
      },
    }))
  }

  const toggleDoc = (clientId: string, doc: keyof Client['onboardingConfig']['documents']) => {
    setConfigs((prev) => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        documents: {
          ...prev[clientId].documents,
          [doc]: !prev[clientId].documents[doc],
        },
        fields: prev[clientId].fields,
      },
    }))
  }

  return (
    <>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>API key</TableHead>
              <TableHead>Allowed vendors</TableHead>
              <TableHead>Flow</TableHead>
              <TableHead>Risk profile</TableHead>
            <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <code className="rounded-md bg-muted px-2 py-1 text-xs">{client.apiKey}</code>
                </TableCell>
                <TableCell className="space-x-2">
                  {client.allowedVendors.map((vendor) => (
                    <Badge key={vendor} variant="secondary">
                      {vendor}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>{client.flow}</TableCell>
                <TableCell>
                  <Badge variant={client.riskProfile === 'High' ? 'destructive' : 'success'}>
                    {client.riskProfile}
                  </Badge>
                </TableCell>
                <TableCell>{client.status}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/clients/${client.id}`}>Configure</Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setActiveClient(client)}>
                    Onboarding URL
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(activeClient)} onOpenChange={(open) => !open && setActiveClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer onboarding</DialogTitle>
            <DialogDescription>
              Share this link with customers and choose which fields & documents to collect.
            </DialogDescription>
          </DialogHeader>
          {activeClient && configs[activeClient.id] && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Onboarding link</Label>
                <div className="flex flex-col gap-2 lg:flex-row">
                  <Input value={onboardingLink} readOnly />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.open(onboardingLink, '_blank', 'noopener,noreferrer')}
                    >
                      Open
                    </Button>
                    <Button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(onboardingLink)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Customer information</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {Object.entries(configs[activeClient.id].fields).map(([key, enabled]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="capitalize">{formatFieldLabel(key)}</p>
                        <p className="text-xs text-muted-foreground">
                          {enabled ? 'Visible' : 'Hidden'} on form
                        </p>
                      </div>
                      <Checkbox
                        checked={enabled}
                        onCheckedChange={() =>
                          toggleField(activeClient.id, key as keyof Client['onboardingConfig']['fields'])
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Document capture</p>
                <div className="grid gap-2 md:grid-cols-3">
                  {Object.entries(configs[activeClient.id].documents).map(([key, enabled]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="capitalize">{key}</p>
                        <p className="text-xs text-muted-foreground">
                          {enabled ? 'Required' : 'Optional'}
                        </p>
                      </div>
                      <Checkbox
                        checked={enabled}
                        onCheckedChange={() =>
                          toggleDoc(
                            activeClient.id,
                            key as keyof Client['onboardingConfig']['documents'],
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveClient(null)}>
              Close
            </Button>
            <Button onClick={() => setActiveClient(null)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatFieldLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

