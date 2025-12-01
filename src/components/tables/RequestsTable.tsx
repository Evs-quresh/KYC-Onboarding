import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/hooks/usePagination'
import { Link } from 'react-router-dom'
import type { VerificationRequest } from '@/utils/types'
import { cn } from '@/lib/utils'

type Props = {
  data: VerificationRequest[]
  selectedId?: string | null
  onSelect?: (request: VerificationRequest) => void
}

export function RequestsTable({ data, selectedId, onSelect }: Props) {
  const pagination = usePagination(data, 6)
  const start = data.length === 0 ? 0 : pagination.page * pagination.pageSize + 1
  const end =
    data.length === 0
      ? 0
      : Math.min(pagination.page * pagination.pageSize + pagination.pageSize, data.length)

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagination.pageData.map((req) => (
            <TableRow
              key={req.id}
              onClick={() => onSelect?.(req)}
              className={cn('cursor-pointer', selectedId === req.id && 'bg-primary/5')}
            >
              <TableCell className="font-medium">{req.id}</TableCell>
              <TableCell>{req.document}</TableCell>
              <TableCell>{req.vendor}</TableCell>
              <TableCell>{Math.round(req.score * 100)}%</TableCell>
              <TableCell>
                <Badge>{req.status}</Badge>
              </TableCell>
              <TableCell>
                {new Date(req.timestamp).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/requests/${req.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {pagination.pageData.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No requests match the current filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-2 text-sm text-muted-foreground">
        <p>
          Showing {start === 0 ? 0 : `${start}–${end}`} of {data.length} requests
        </p>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={pagination.prev} disabled={pagination.page === 0}>
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
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

