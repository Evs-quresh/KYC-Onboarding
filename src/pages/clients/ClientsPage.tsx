import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ClientsTable } from '@/components/tables/ClientsTable'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-muted-foreground">Manage client level workflows, vendors, and keys.</p>
        </div>
        <Button asChild>
          <Link to="/clients/new">Create client</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client list</CardTitle>
          <CardDescription>API keys, flow strategies, risk profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsTable />
        </CardContent>
      </Card>
    </div>
  )
}

