import { useQuery } from '@tanstack/react-query'
import { fetchRecentVerifications } from '@/utils/mockApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePagination } from '@/hooks/usePagination'

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  success: 'success',
  review: 'warning',
  failed: 'destructive',
  pending: 'secondary',
}

export function RecentVerificationsTable() {
  const { data = [] } = useQuery({
    queryKey: ['recent-verifications'],
    queryFn: fetchRecentVerifications,
  })

  const pagination = usePagination(data, 5)

  return (
    <div className="space-y-2">
      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.pageData.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.client}</TableCell>
                <TableCell>{request.vendor}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[request.status]}>
                    {request.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{Math.round(request.score * 100)}%</TableCell>
                <TableCell>{request.country}</TableCell>
                <TableCell>
                  {new Date(request.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {pagination.pageData.length} of {data.length} verifications
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={pagination.prev} disabled={pagination.page === 0}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={pagination.next}
            disabled={pagination.page === pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

