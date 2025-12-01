import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { vendorLatencySeries } from '@/utils/mockData'

export function VendorLatencyChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={vendorLatencySeries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="vendor" />
        <YAxis unit="s" />
        <Tooltip />
        <Bar dataKey="latency" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

