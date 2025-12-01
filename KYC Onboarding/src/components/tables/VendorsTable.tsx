import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchVendors } from '@/utils/mockApi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Vendor } from '@/utils/types'

export function VendorsTable() {
  const { data = [] } = useQuery({ queryKey: ['vendors'], queryFn: fetchVendors })
  const [testVendor, setTestVendor] = useState<Vendor | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    latency: number
    success: boolean
    message: string
    timestamp: string
  } | null>(null)

  const runTest = async () => {
    if (!testVendor) return
    setIsTesting(true)
    setTestResult(null)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const success = Math.random() > 0.2
    const latency = Number((Math.random() * 2 + testVendor.avgLatency).toFixed(2))
    setTestResult({
      latency,
      success,
      message: success ? 'Connection healthy' : 'Vendor reported temporary failure',
      timestamp: new Date().toISOString(),
    })
    setIsTesting(false)
  }

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Supported checks</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Avg latency</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="flex items-center gap-3">
                <img src={vendor.logo} alt={vendor.name} className="h-8 w-20 object-contain" />
                <div>
                  <p className="font-semibold">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">#{vendor.id}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={vendor.status !== 'offline'} />
                  <Badge
                    variant={
                      vendor.status === 'online'
                        ? 'success'
                        : vendor.status === 'degraded'
                          ? 'warning'
                          : 'destructive'
                    }
                  >
                    {vendor.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                {vendor.supportedChecks.map((check) => (
                  <Badge key={check} variant="secondary">
                    {check}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>{vendor.region}</TableCell>
              <TableCell>{vendor.avgLatency}s</TableCell>
              <TableCell className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/vendors/${vendor.id}`}>Edit</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setTestVendor(vendor)}>
                  Test
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={Boolean(testVendor)} onOpenChange={(open) => !open && setTestVendor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test vendor connection</DialogTitle>
            <DialogDescription>
              Send a live ping to {testVendor?.name} sandbox endpoint to verify credentials and latency.
            </DialogDescription>
          </DialogHeader>
          {testVendor && (
            <div className="space-y-4">
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-semibold">{testVendor.name}</p>
                <p className="text-muted-foreground text-xs">{testVendor.region} · #{testVendor.id}</p>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Avg latency</span>
                  <span>{testVendor.avgLatency}s</span>
                  <span className="text-muted-foreground">Routing tag</span>
                  <span>{testVendor.routingTag}</span>
                </div>
              </div>
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-semibold mb-2">Test result</p>
                {testResult ? (
                  <div className="space-y-1">
                    <p>
                      Status:{' '}
                      <Badge variant={testResult.success ? 'success' : 'destructive'}>
                        {testResult.success ? 'HEALTHY' : 'FAILED'}
                      </Badge>
                    </p>
                    <p>Latency: {testResult.latency}s</p>
                    <p className="text-muted-foreground">{testResult.message}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(testResult.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {isTesting
                      ? 'Running sandbox ping...'
                      : 'No test run yet. Click "Run test" to execute a live call.'}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestVendor(null)}>
              Close
            </Button>
            <Button onClick={runTest} disabled={isTesting}>
              {isTesting ? 'Testing…' : 'Run test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

