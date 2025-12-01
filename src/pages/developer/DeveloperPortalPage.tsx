import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function DeveloperPortalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Developer portal</h1>
          <p className="text-muted-foreground">Self-serve tools for engineers.</p>
        </div>
        <Button>Generate API key</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>API keys</CardTitle>
            <CardDescription>Manage production & sandbox tokens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Production key</Label>
              <div className="flex gap-2">
                <Input value="prod_live_1x2x3x" readOnly />
                <Button variant="outline">Copy</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sandbox key</Label>
              <div className="flex gap-2">
                <Input value="sandbox_dev_987" readOnly />
                <Button variant="outline">Copy</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API docs</CardTitle>
            <CardDescription>Swagger embedded view.</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              title="Swagger"
              src="https://petstore.swagger.io"
              className="h-64 w-full rounded-lg border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sandbox tester</CardTitle>
          <CardDescription>Upload evidence, pick vendor, view normalized response.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Document upload</Label>
            <Input type="file" />
            <Label>Selfie upload</Label>
            <Input type="file" />
            <Label>Vendor</Label>
            <Select defaultValue="GBG">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBG">GBG</SelectItem>
                <SelectItem value="Veriff">Veriff</SelectItem>
                <SelectItem value="Facephi">Facephi</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Send test</Button>
          </div>
          <div className="space-y-2">
            <Label>Normalized response</Label>
            <Textarea
              rows={10}
              value={`{\n  "status": "success",\n  "score": 0.92,\n  "latency": "3.1s"\n}`}
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

