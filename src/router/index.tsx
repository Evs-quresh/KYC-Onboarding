import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import VendorsPage from '@/pages/vendors/VendorsPage'
import VendorDetailsPage from '@/pages/vendors/VendorDetailsPage'
import VendorCreatePage from '@/pages/vendors/VendorCreatePage'
import ClientsPage from '@/pages/clients/ClientsPage'
import ClientConfigPage from '@/pages/clients/ClientConfigPage'
import ClientCreatePage from '@/pages/clients/ClientCreatePage'
import ClientOnboardingPage from '@/pages/clients/ClientOnboardingPage'
import RequestsPage from '@/pages/requests/RequestsPage'
import RequestDetailsPage from '@/pages/request-details/RequestDetailsPage'
import RulesPage from '@/pages/rules/RulesPage'
import LogsPage from '@/pages/logs/LogsPage'
import DeveloperPortalPage from '@/pages/developer/DeveloperPortalPage'
import WidgetPage from '@/pages/widget/WidgetPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import { useAppStore } from '@/store/useAppStore'

export function AppRoutes() {
  const isAuthenticated = Boolean(useAppStore((state) => state.user))

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route path="/onboard/:clientId" element={<ClientOnboardingPage />} />
      <Route
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/new" element={<VendorCreatePage />} />
        <Route path="/vendors/:vendorId" element={<VendorDetailsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/new" element={<ClientCreatePage />} />
        <Route path="/clients/:clientId" element={<ClientConfigPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/:requestId" element={<RequestDetailsPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/developer" element={<DeveloperPortalPage />} />
        <Route path="/widget" element={<WidgetPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

