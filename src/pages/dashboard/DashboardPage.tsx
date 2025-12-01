import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DailyVerificationsChart } from '@/components/charts/DailyVerificationsChart'
import { VendorLatencyChart } from '@/components/charts/VendorLatencyChart'
import { FailureReasonsChart } from '@/components/charts/FailureReasonsChart'
import { RecentVerificationsTable } from '@/components/tables/RecentVerificationsTable'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Verifications today', value: '2,560', change: '+12%' },
  { label: 'Success rate', value: '92.3%', change: '+2.1%' },
  { label: 'Avg latency', value: '3.4s', change: '-0.4s' },
  { label: 'Vendors healthy', value: '3/4', change: 'Veriff degraded' },
]

const vendorHealth = [
  { vendor: 'GBG', status: 'Online' },
  { vendor: 'Veriff', status: 'Degraded' },
  { vendor: 'Facephi', status: 'Online' },
  { vendor: 'Onfido', status: 'Online' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="space-y-1">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily verifications</CardTitle>
            <CardDescription>Rolling 7-day trend</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyVerificationsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vendor latency comparison</CardTitle>
            <CardDescription>p95 response time</CardDescription>
          </CardHeader>
          <CardContent>
            <VendorLatencyChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent verifications</CardTitle>
            <CardDescription>Live orchestration feed</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentVerificationsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failure reasons</CardTitle>
            <CardDescription>Past 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <FailureReasonsChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor health</CardTitle>
          <CardDescription>Active routing status</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {vendorHealth.map((vendor) => (
            <div
              key={vendor.vendor}
              className="flex items-center justify-between rounded-lg border px-3 py-3"
            >
              <div>
                <p className="font-medium">{vendor.vendor}</p>
                <p className="text-xs text-muted-foreground">Realtime signal</p>
              </div>
              <Badge
                variant={
                  vendor.status === 'Online'
                    ? 'success'
                    : vendor.status === 'Degraded'
                      ? 'warning'
                      : 'destructive'
                }
              >
                {vendor.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

