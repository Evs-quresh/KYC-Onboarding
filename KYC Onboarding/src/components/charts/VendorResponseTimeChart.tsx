import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { vendorLatencySeries } from '@/utils/mockData'

const areaData = vendorLatencySeries.map((item, index) => ({
  ...item,
  errors: Math.round((index + 2) * 4),
}))

export function VendorResponseTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={areaData}>
        <defs>
          <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="vendor" />
        <YAxis unit="s" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="latency"
          stroke="#2563eb"
          fillOpacity={1}
          fill="url(#colorLatency)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

