import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type User = {
  name: string
  email: string
  role: string
}

type RequestFilters = {
  client?: string
  country?: string
  status?: string
  vendor?: string
  documentType?: string
  dateRange?: [Date | null, Date | null]
}

type AppState = {
  user: User | null
  sidebarCollapsed: boolean
  requestFilters: RequestFilters
  setUser: (user: User) => void
  logout: () => void
  toggleSidebar: () => void
  setSidebar: (collapsed: boolean) => void
  updateRequestFilters: (filters: Partial<RequestFilters>) => void
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    user: null,
    sidebarCollapsed: false,
    requestFilters: {},
    setUser: (user) =>
      set((state) => {
        state.user = user
      }),
    logout: () =>
      set((state) => {
        state.user = null
      }),
    toggleSidebar: () =>
      set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed
      }),
    setSidebar: (collapsed) =>
      set((state) => {
        state.sidebarCollapsed = collapsed
      }),
    updateRequestFilters: (filters) =>
      set((state) => {
        state.requestFilters = { ...state.requestFilters, ...filters }
      }),
  })),
)

