import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from 'recharts'
import { dailySeries } from '@/utils/mockData'

export function DailyVerificationsChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={dailySeries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
        <Line type="monotone" dataKey="success" stroke="#16a34a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

