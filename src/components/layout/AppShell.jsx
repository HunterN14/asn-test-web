import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({ title, subtitle, actions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          subtitle={subtitle}
          actions={actions}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
