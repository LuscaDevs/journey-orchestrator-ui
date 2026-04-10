"use client"

import { useState, useMemo, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Search, ChevronDown, GitBranch, Globe, FileText, Activity, Loader2, AlertCircle } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { JourneysTable } from "./JourneyTable"
import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import type { JourneyDefinition } from "../../types/journey"
import { journeyDefinitionToJourney, generateJourneyCode, type Journey, type JourneyStatus } from "../../lib/journeyAdapter"

type FilterStatus = "all" | JourneyStatus

export function JourneysPage() {
  const navigate = useNavigate()
  const { definitions, createDefinition, deleteDefinition, loadDefinition, setCurrentDefinition, loadDefinitionsFromAPI, isLoading, error } = useJourneyDefinitionStore()
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  // Load definitions from API on mount
  useEffect(() => {
    loadDefinitionsFromAPI()
  }, [loadDefinitionsFromAPI])

  // Convert JourneyDefinitions to Journey format for the table
  const journeys = useMemo(() => {
    return definitions.map((def, index) => journeyDefinitionToJourney(def, index))
  }, [definitions])

  const filtered = useMemo(() => {
    return journeys.filter((j) => {
      const matchSearch =
        !search ||
        j.name.toLowerCase().includes(search.toLowerCase()) ||
        j.code.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === "all" || j.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [journeys, search, filterStatus])

  function handleCreateJourney() {
    const name = prompt('Nome da nova jornada:')
    if (name) {
      createDefinition(name)
      setTimeout(() => navigate('/editor'), 100)
    }
  }

  function handleEditJourney(journey: Journey) {
    // Find the original JourneyDefinition
    const definition = definitions.find(def => def.id === journey.id)
    if (definition) {
      loadDefinition(definition)
      navigate('/editor')
    }
  }

  function handleDeleteJourney(id: string) {
    if (confirm('Tem certeza que deseja excluir esta jornada?')) {
      deleteDefinition(id)
    }
  }

  function handleDuplicateJourney(journey: Journey) {
    // Find the original JourneyDefinition
    const definition = definitions.find(def => def.id === journey.id)
    if (definition) {
      const newName = prompt('Nome da jornada duplicada:', `${definition.name} (Cópia)`)
      if (newName) {
        const duplicatedDefinition: JourneyDefinition = {
          ...definition,
          id: crypto.randomUUID(),
          name: newName,
          version: 1,
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }

        // Add to definitions list and set as current
        const { definitions: currentDefs } = useJourneyDefinitionStore.getState()
        useJourneyDefinitionStore.setState({
          definitions: [...currentDefs, duplicatedDefinition],
          currentDefinition: duplicatedDefinition,
          hasUnsavedChanges: false
        })
      }
    }
  }

  function handlePublishJourney(id: string) {
    // Find the original JourneyDefinition
    const definition = definitions.find(def => def.id === id)
    if (definition) {
      // Remove "(Cópia)" from name to mark as published
      const publishedName = definition.name.replace(' (Cópia)', '')
      const { definitions: currentDefs } = useJourneyDefinitionStore.getState()
      
      const updatedDefinition: JourneyDefinition = {
        ...definition,
        name: publishedName,
        version: definition.version + 1,
        metadata: {
          ...definition.metadata,
          updatedAt: new Date().toISOString()
        }
      }

      useJourneyDefinitionStore.setState({
        definitions: currentDefs.map(def => 
          def.id === id ? updatedDefinition : def
        ),
        currentDefinition: updatedDefinition,
        hasUnsavedChanges: false
      })
    }
  }

  function handleUpdateJourney(journey: Journey) {
    // This would be used for inline editing if needed
    // For now, we'll just update the definition name
    const definition = definitions.find(def => def.id === journey.id)
    if (definition) {
      const { definitions: currentDefs } = useJourneyDefinitionStore.getState()
      
      const updatedDefinition: JourneyDefinition = {
        ...definition,
        name: journey.name,
        metadata: {
          ...definition.metadata,
          updatedAt: new Date().toISOString()
        }
      }

      useJourneyDefinitionStore.setState({
        definitions: currentDefs.map(def => 
          def.id === journey.id ? updatedDefinition : def
        ),
        currentDefinition: updatedDefinition,
        hasUnsavedChanges: false
      })
    }
  }

  const publishedCount = journeys.filter((j) => j.status === "published").length
  const draftCount = journeys.filter((j) => j.status === "draft").length

  const filterLabel =
    filterStatus === "all"
      ? "Todos os status"
      : filterStatus === "published"
      ? "Publicados"
      : "Rascunhos"

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground text-balance">
            Journey Definitions
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e orquestre os fluxos de trabalho da sua plataforma.
          </p>
        </div>
        <Button
          onClick={handleCreateJourney}
          disabled={isLoading}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm font-medium"
        >
          <PlusCircle className="h-4 w-4" />
          Nova Journey
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Carregando journey definitions...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <GitBranch className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold text-foreground leading-tight">{journeys.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.65_0.18_160/0.1)]">
                <Globe className="h-4 w-4 text-[oklch(0.65_0.18_160)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Publicadas</p>
                <p className="text-lg font-semibold text-foreground leading-tight">{publishedCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.62_0.16_60/0.1)]">
                <FileText className="h-4 w-4 text-[oklch(0.78_0.14_60)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rascunhos</p>
                <p className="text-lg font-semibold text-foreground leading-tight">{draftCount}</p>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por nome ou código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm bg-muted border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="h-9 text-sm border border-input bg-muted text-foreground px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">{filterLabel}</option>
                <option value="published">Publicados</option>
                <option value="draft">Rascunhos</option>
              </select>
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table */}
          <JourneysTable
            journeys={filtered}
            onUpdate={handleUpdateJourney}
            onDelete={handleDeleteJourney}
            onDuplicate={handleDuplicateJourney}
            onPublish={handlePublishJourney}
            onEdit={handleEditJourney}
          />
        </>
      )}
    </div>
  )
}
