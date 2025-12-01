import { useEffect, useMemo, useState } from 'react'
import { rules as seedRules } from '@/utils/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { nanoid } from 'nanoid'
import { Label } from '@/components/ui/label'

const blocks = [
  { label: 'Country ==', value: 'country' },
  { label: 'Risk score >', value: 'risk_score' },
  { label: 'Vendor latency <', value: 'latency' },
  { label: 'Watchlist contains', value: 'watchlist' },
]

export default function RulesPage() {
  const [rulesState, setRulesState] = useState(seedRules)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<typeof seedRules[number] | null>(null)
  const defaultPriority = useMemo(() => rulesState.length + 1, [rulesState.length])

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this rule?')) return
    setRulesState((prev) => prev.filter((rule) => rule.id !== id))
  }

  const handleSave = (payload: RuleFormValues) => {
    if (editingRule) {
      setRulesState((prev) =>
        prev.map((rule) =>
          rule.id === editingRule.id
            ? {
                ...rule,
                ...payload,
                conditions: payload.conditions.split('\n').filter(Boolean),
              }
            : rule,
        ),
      )
    } else {
      setRulesState((prev) => [
        ...prev,
        {
          id: nanoid(6),
          name: payload.name,
          priority: payload.priority,
          enabled: payload.enabled,
          action: payload.action,
          conditions: payload.conditions.split('\n').filter(Boolean),
        },
      ])
    }
    setDialogOpen(false)
    setEditingRule(null)
  }

  const openCreate = () => {
    setEditingRule(null)
    setDialogOpen(true)
  }

  const openEdit = (rule: (typeof seedRules)[number]) => {
    setEditingRule(rule)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rules engine</h1>
          <p className="text-muted-foreground">Visual builder for orchestration logic.</p>
        </div>
        <Button onClick={openCreate}>Create rule</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Drag & drop builder</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-lg border border-dashed p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Drag blocks to compose IF/THEN logic.
            </p>
            <div className="flex flex-wrap gap-2">
              {blocks.map((block) => (
                <div key={block.value} className="rounded-lg border bg-muted/50 px-3 py-2 text-sm">
                  {block.label}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold text-muted-foreground">Rule preview</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">IF</Badge>
                  country == NG AND risk_score &gt; 0.75
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">THEN</Badge>
                  Route to manual review + trigger webhook
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-semibold">Priority</p>
            <Slider defaultValue={[1]} min={1} max={10} />
            <p className="text-xs text-muted-foreground">Higher value = earlier execution.</p>
            <Button variant="outline" className="w-full">
              Simulate rule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rulesState
                .sort((a, b) => a.priority - b.priority)
                .map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <ul className="list-inside list-disc text-sm text-muted-foreground">
                      {rule.conditions.map((condition) => (
                        <li key={condition}>{condition}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{rule.action}</TableCell>
                  <TableCell>
                    <Badge variant={rule.enabled ? 'success' : 'secondary'}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(rule)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(rule.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RuleDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingRule(null)
        }}
        onSubmit={handleSave}
        defaultPriority={defaultPriority}
        rule={editingRule ?? undefined}
      />
    </div>
  )
}

type RuleFormValues = {
  name: string
  priority: number
  enabled: boolean
  action: string
  conditions: string
}

type RuleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: RuleFormValues) => void
  defaultPriority: number
  rule?: (typeof seedRules)[number]
}

function RuleDialog({ open, onOpenChange, onSubmit, defaultPriority, rule }: RuleDialogProps) {
  const [formState, setFormState] = useState<RuleFormValues>({
    name: '',
    priority: defaultPriority,
    enabled: true,
    action: 'Route to manual review',
    conditions: '',
  })

  useEffect(() => {
    setFormState({
      name: rule?.name ?? '',
      priority: rule?.priority ?? defaultPriority,
      enabled: rule?.enabled ?? true,
      action: rule?.action ?? 'Route to manual review',
      conditions: rule?.conditions.join('\n') ?? '',
    })
  }, [rule, defaultPriority])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit rule' : 'Create rule'}</DialogTitle>
          <DialogDescription>Define the condition blocks and action you want to take.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Slider
              value={[formState.priority]}
              min={1}
              max={20}
              onValueChange={([value]) =>
                setFormState((prev) => ({ ...prev, priority: value ?? prev.priority }))
              }
            />
            <p className="text-xs text-muted-foreground">Current priority: {formState.priority}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <div>
              <p className="font-medium">Enabled</p>
              <p className="text-xs text-muted-foreground">Turn the rule on or off.</p>
            </div>
            <Switch
              checked={formState.enabled}
              onCheckedChange={(value) => setFormState((prev) => ({ ...prev, enabled: value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Conditions</Label>
            <Textarea
              rows={4}
              placeholder="country == NG"
              value={formState.conditions}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, conditions: event.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">One condition per line.</p>
          </div>
          <div className="space-y-2">
            <Label>Action</Label>
            <Input
              value={formState.action}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, action: event.target.value }))
              }
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(formState)} disabled={!formState.name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

