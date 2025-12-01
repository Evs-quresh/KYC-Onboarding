export type VendorStatus = 'online' | 'degraded' | 'offline'

export type VerificationStatus = 'success' | 'pending' | 'failed' | 'review'

export type Vendor = {
  id: string
  name: string
  logo: string
  status: VendorStatus
  supportedChecks: string[]
  region: string
  avgLatency: number
  apiKey: string
  secret: string
  sandbox: boolean
  documentScan: boolean
  liveness: boolean
  watchlist: boolean
  faceMatch: boolean
  priority: number
  routingTag: string
}

export type Client = {
  id: string
  name: string
  apiKey: string
  allowedVendors: string[]
  flow: 'Primary' | 'Fallback' | 'Parallel'
  riskProfile: 'Low' | 'Medium' | 'High'
  status: 'Active' | 'Paused'
  thresholds: {
    score: number
    manualReview: number
  }
  webhooks: string[]
  onboardingConfig: {
    fields: {
      fullName: boolean
      email: boolean
      phone: boolean
      gender: boolean
      country: boolean
      address: boolean
      nationalId: boolean
    }
    documents: {
      front: boolean
      back: boolean
      selfie: boolean
    }
  }
}

export type VerificationRequest = {
  id: string
  client: string
  vendor: string
  document: string
  country: string
  score: number
  status: VerificationStatus
  timestamp: string
}

export type LogEntry = {
  id: string
  timestamp: string
  vendor: string
  type: 'API' | 'Orchestrator' | 'Error' | 'Latency'
  requestId: string
  payload: Record<string, unknown>
}

export type Rule = {
  id: string
  name: string
  priority: number
  enabled: boolean
  conditions: string[]
  action: string
}

