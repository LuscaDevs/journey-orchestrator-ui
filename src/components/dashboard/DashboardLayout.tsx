"use client"

import { Sidebar } from "./Sidebar"
import { JourneysPage } from "./JourneysPage"

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Journey Orchestrator</span>
            <span>/</span>
            <span className="text-foreground font-medium">Journeys</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
              v1.0.0
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          <JourneysPage />
        </div>
      </main>
    </div>
  )
}
