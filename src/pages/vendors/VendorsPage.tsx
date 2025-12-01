import { VendorsTable } from '@/components/tables/VendorsTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { VendorResponseTimeChart } from '@/components/charts/VendorResponseTimeChart'
import { VendorErrorRateChart } from '@/components/charts/VendorErrorRateChart'

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Vendors</h1>
          <p className="text-muted-foreground">Manage vendor integrations and routing.</p>
        </div>
        <Button asChild>
          <Link to="/vendors/new">Add vendor</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connected vendors</CardTitle>
          <CardDescription>Toggle availability, run tests, configure features.</CardDescription>
        </CardHeader>
        <CardContent>
          <VendorsTable />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendor response times</CardTitle>
            <CardDescription>Realtime insight</CardDescription>
          </CardHeader>
          <CardContent>
            <VendorResponseTimeChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Error rate trend</CardTitle>
            <CardDescription>Last 4 vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <VendorErrorRateChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

