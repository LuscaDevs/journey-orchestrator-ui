"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { JourneysPage } from "./JourneysPage"
import { JourneyInstancesTable } from "./JourneyInstancesTable"
import { useJourneyInstances } from "../../hooks/useJourneyInstances"
import { Loader2, AlertCircle } from "lucide-react"

type DashboardTab = "definitions" | "instances"

function InstancesContent() {
  const { instances, loading, error, refreshInstances } = useJourneyInstances()

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">
          Journey Instances
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualize e gerencie todas as instâncias de jornadas
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
          <button
            onClick={refreshInstances}
            className="ml-auto text-sm text-destructive underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Carregando instâncias...</span>
        </div>
      ) : (
        <JourneyInstancesTable instances={instances} />
      )}
    </div>
  )
}

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("definitions")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Journey Orchestrator</span>
            <span>/</span>
            <span className="text-foreground font-medium">
              {activeTab === "definitions" ? "Journey Definitions" : "Journey Instances"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
              v1.0.0
            </span>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <div className="flex gap-1 border-b border-border">
            <button
              onClick={() => setActiveTab("definitions")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "definitions"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Journey Definitions
            </button>
            <button
              onClick={() => setActiveTab("instances")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "instances"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Journey Instances
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {activeTab === "definitions" ? (
            <JourneysPage />
          ) : (
            <InstancesContent />
          )}
        </div>
      </main>
    </div>
  )
}
