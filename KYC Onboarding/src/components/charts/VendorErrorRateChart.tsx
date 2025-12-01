import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const errorSeries = [
  { vendor: 'GBG', latency: 3.2, errorRate: 0.9 },
  { vendor: 'Veriff', latency: 4.8, errorRate: 1.8 },
  { vendor: 'Facephi', latency: 2.6, errorRate: 0.6 },
  { vendor: 'Onfido', latency: 3.9, errorRate: 1.2 },
]

export function VendorErrorRateChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={errorSeries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="vendor" />
        <YAxis yAxisId="left" unit="s" />
        <YAxis yAxisId="right" orientation="right" unit="%" />
        <Tooltip />
        <Bar
          yAxisId="left"
          dataKey="latency"
          fill="#a855f7"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="errorRate"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

