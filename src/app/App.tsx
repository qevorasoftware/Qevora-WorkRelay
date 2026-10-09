import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { Providers } from './providers'
import { ErrorBoundary } from '../components/feedback/error-boundary'
import { AppShell } from '../components/layout/app-shell'
import { useAuthStore } from '../features/auth/auth-store'
import { LoginPage } from '../features/auth/login-page'
import { RegisterPage } from '../features/auth/register-page'
import { ForgotPasswordPage } from '../features/auth/forgot-password-page'
import { AdminPage } from '../features/admin/admin-page'
import { DashboardPage } from '../features/dashboard/dashboard-page'
import { ProjectsPage } from '../features/projects/projects-page'
import { ProjectDetailPage } from '../features/projects/project-detail-page'
import { RequestsPage } from '../features/requests/requests-page'
import { ApprovalsPage } from '../features/approvals/approvals-page'
import { ChatPage } from '../features/chat/chat-page'
import { FilesPage } from '../features/files/files-page'
import { ClientsPage } from '../features/clients/clients-page'
import { ActivityPage } from '../features/activity/activity-page'
import { NotificationsPage } from '../features/notifications/notifications-page'
import { SettingsPage } from '../features/settings/settings-page'
import { PortalPage } from '../features/portal/portal-page'
import { PageTransition } from '../components/layout/page-transition'
import { EmptyState } from '../components/ui/empty-state'
import { Card } from '../components/ui/card'

/** Gate: workspace pages need a signed-in session; bounces to /login and remembers where you were. */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const sessionUserId = useAuthStore((s) => s.sessionUserId)
  if (!sessionUserId) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }
  return <>{children}</>
}

function NotFound() {
  return (
    <div className="ambient flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <EmptyState title="Page not found" hint="The link may be wrong, or the page moved." />
        <div className="flex justify-center pb-6">
          <a href="#/" className="btn btn-primary">Go home</a>
        </div>
      </Card>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/portal" element={<PageTransition><PortalPage /></PageTransition>} />
      <Route path="/portal/:clientId" element={<PageTransition><PortalPage /></PageTransition>} />
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/files" element={<FilesPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </Providers>
    </ErrorBoundary>
  )
}
