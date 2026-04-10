"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import {
  ArrowLeft,
  Save,
  Upload,
  MoreHorizontal,
  Circle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function TopBar() {
  const navigate = useNavigate()
  const { 
    currentDefinition, 
    hasUnsavedChanges, 
    hasActualChanges,
    updateDefinition, 
    deleteDefinition,
    discardChanges,
    saveCurrentDefinition
  } = useJourneyDefinitionStore()

  const handleSave = () => {
    if (currentDefinition?.name) {
      saveCurrentDefinition()
    }
  }

  const handlePublish = () => {
    if (currentDefinition?.status === "draft") {
      // Update status to published - this would need to be implemented in the store
      // For now, just save
      handleSave()
    }
  }

  const handleBack = () => {
    if (hasActualChanges()) {
      if (confirm("Você tem alterações não salvas. Deseja descartá-las?")) {
        discardChanges()
        navigate("/")
      }
    } else {
      navigate("/")
    }
  }

  const handleExport = () => {
    if (currentDefinition) {
      const data = JSON.stringify(currentDefinition, null, 2)
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentDefinition.name || "journey"}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleDuplicate = () => {
    if (currentDefinition) {
      // This would need to be implemented in the store
      console.log("Duplicate journey:", currentDefinition.id)
    }
  }

  const handleDelete = () => {
    if (currentDefinition && confirm("Tem certeza que deseja excluir esta jornada?")) {
      deleteDefinition(currentDefinition.id)
      navigate("/")
    }
  }

  if (!currentDefinition) return null

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      {/* Left: Back button + Journey info */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-foreground">
                {currentDefinition.name || "Nova Jornada"}
              </h1>
              {hasUnsavedChanges && (
                <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentDefinition.id.slice(0, 8)}... v{currentDefinition.version}
            </p>
          </div>
          <Badge
            variant={currentDefinition.status === "published" ? "default" : "secondary"}
            className={
              currentDefinition.status === "published"
                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
            }
          >
            {currentDefinition.status === "published" ? "Publicado" : "Rascunho"}
          </Badge>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>

        {currentDefinition.status === "draft" && (
          <Button
            size="sm"
            onClick={handlePublish}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            Publicar
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExport}>
              Exportar JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              Duplicar Journey
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              Excluir Journey
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
