import { vendors, clients, recentVerifications, logs, rules } from './mockData'

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchVendors() {
  await wait()
  return vendors
}

export async function fetchClients() {
  await wait()
  return clients
}

export async function fetchRecentVerifications() {
  await wait()
  return recentVerifications
}

export async function fetchLogs() {
  await wait()
  return logs
}

export async function fetchRules() {
  await wait()
  return rules
}

