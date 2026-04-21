"use client"

import { useEffect } from "react"
import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import { TopBar } from "./TopBar"
import { NodePalette } from "./NodePalette"
import { CanvasArea } from "./CanvasArea"
import { PropertiesPanel } from "./PropertiesPanel"

interface EditorLayoutProps {
  journeyId?: string
}

export function EditorLayout({ journeyId }: EditorLayoutProps) {
  const { currentDefinition, loadDefinition, createDefinition, setCurrentDefinition } = useJourneyDefinitionStore()

  // Load existing journey if journeyId is provided, otherwise create new empty journey
  useEffect(() => {
    if (journeyId) {
      // Load existing journey from API
      loadDefinitionFromAPI(journeyId)
    } else if (!currentDefinition) {
      // Create new empty journey for editing (locally, not persisted)
      const newDefinition = {
        id: crypto.randomUUID(),
        journeyCode: '',
        name: '',
        version: 1,
        nodes: [],
        edges: [],
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: 'RASCUNHO' as const,
        isNew: true // Flag to indicate this is a new journey not yet persisted
      }
      setCurrentDefinition(newDefinition)
    }
  }, [journeyId, currentDefinition, setCurrentDefinition])

  async function loadDefinitionFromAPI(id: string) {
    try {
      // This would load from API using the journeyId
      // For now, we'll just log it
      console.log("Loading journey:", id)
    } catch (error) {
      console.error("Error loading journey:", error)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <CanvasArea />
        <PropertiesPanel />
      </div>
    </div>
  )
}
