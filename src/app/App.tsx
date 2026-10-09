import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { Providers } from './providers'
import { ErrorBoundary } from '../components/feedback/error-boundary'
import { AppShell } from '../components/layout/app-shell'
import { DashboardPage } from '../features/dashboard/dashboard-page'
import { ProjectsPage } from '../features/projects/projects-page'
import { ProjectDetailPage } from '../features/projects/project-detail-page'
import { RequestsPage } from '../features/requests/requests-page'
import { ApprovalsPage } from '../features/approvals/approvals-page'
import { ChatPage } from '../features/chat/chat-page'
import { FilesPage } from '../features/files/files-page'
import { ClientsPage } from '../features/clients/clients-page'
import { NotificationsPage } from '../features/notifications/notifications-page'
import { SettingsPage } from '../features/settings/settings-page'
import { PortalPage } from '../features/portal/portal-page'
import { PageTransition } from '../components/layout/page-transition'
import { EmptyState } from '../components/ui/empty-state'
import { Card } from '../components/ui/card'

function NotFound() {
  return (
    <div className="mesh flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <EmptyState title="Page not found" hint="The link may be wrong, or the page moved." />
        <div className="flex justify-center pb-6">
          <a href="#/" className="btn btn-primary">Go home</a>
        </div>
      </Card>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/portal" element={<PageTransition><PortalPage /></PageTransition>} />
        <Route path="/portal/:clientId" element={<PageTransition><PortalPage /></PageTransition>} />
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <HashRouter>
          <AnimatedRoutes />
        </HashRouter>
      </Providers>
    </ErrorBoundary>
  )
}
