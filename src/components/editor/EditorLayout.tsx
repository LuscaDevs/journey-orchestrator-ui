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
  const { currentDefinition, loadDefinition } = useJourneyDefinitionStore()

  // Load existing journey if journeyId is provided
  useEffect(() => {
    if (journeyId) {
      // In a real implementation, this would load the journey from the API
      // For now, we'll just log it
      console.log("Loading journey:", journeyId)
    }
  }, [journeyId, loadDefinition])

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
