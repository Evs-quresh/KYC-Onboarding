import {
  Activity,
  Boxes,
  Building2,
  GaugeCircle,
  Layers3,
  Settings,
  ShieldCheck,
  Workflow,
} from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: GaugeCircle },
  { label: 'Vendors', path: '/vendors', icon: Building2 },
  { label: 'Clients', path: '/clients', icon: Boxes },
  { label: 'Requests', path: '/requests', icon: Activity },
  { label: 'Rules', path: '/rules', icon: Workflow },
  { label: 'Logs', path: '/logs', icon: Layers3 },
  { label: 'Developer', path: '/developer', icon: ShieldCheck },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export const SUPPORTED_CHECKS = [
  'Document',
  'Watchlist',
  'Liveness',
  'Face',
  'AML',
  'Device',
]

export const COUNTRIES = ['AU', 'NZ', 'SG', 'GB', 'US', 'BR', 'MX']

export const DOCUMENT_TYPES = ['Passport', 'Driver License', 'National ID']

