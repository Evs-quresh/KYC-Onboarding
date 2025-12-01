import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { LogEntry } from '@/utils/types'
import { Badge } from '@/components/ui/badge'

type Props = {
  items: LogEntry[]
}

export function LogsTable({ items }: Props) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Payload</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {new Date(log.timestamp).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>{log.vendor}</TableCell>
              <TableCell>
                <Badge>{log.type}</Badge>
              </TableCell>
              <TableCell>{log.requestId}</TableCell>
              <TableCell>
                <pre className="text-xs text-muted-foreground">
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

