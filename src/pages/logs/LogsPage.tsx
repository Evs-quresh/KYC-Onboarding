import { logs } from '@/utils/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogsTable } from '@/components/tables/LogsTable'

const tabFilters = {
  vendor: (type: string) => type === 'API',
  orchestrator: (type: string) => type === 'Orchestrator',
  errors: (type: string) => type === 'Error',
  latency: () => true,
}

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Logs & monitoring</h1>
        <p className="text-muted-foreground">Inspect vendor traffic, orchestrator events, and latency.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Log streams</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vendor" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="vendor">Vendor API</TabsTrigger>
              <TabsTrigger value="orchestrator">Orchestrator</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="latency">Latency</TabsTrigger>
            </TabsList>
            {Object.entries(tabFilters).map(([key, predicate]) => (
              <TabsContent key={key} value={key}>
                <LogsTable items={logs.filter((log) => predicate(log.type))} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

