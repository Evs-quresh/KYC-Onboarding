import { Pie, PieChart, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { failureBreakdown } from '@/utils/mockData'

const COLORS = ['#f43f5e', '#f97316', '#facc15', '#22c55e', '#3b82f6']

export function FailureReasonsChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={failureBreakdown}
          dataKey="value"
          nameKey="reason"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={4}
        >
          {failureBreakdown.map((entry, index) => (
            <Cell key={entry.reason} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

