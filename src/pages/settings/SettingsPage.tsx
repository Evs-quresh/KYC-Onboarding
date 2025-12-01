import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Platform preferences and alerts.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control alerting channels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {['Vendor outages', 'Latency spikes', 'Manual reviews'].map((label) => (
            <div key={label} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <p>{label}</p>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

