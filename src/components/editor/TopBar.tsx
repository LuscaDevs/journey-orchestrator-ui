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
  AlertCircle,
  Loader2,
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
    saveCurrentDefinition,
    error,
    isLoading,
    clearError
  } = useJourneyDefinitionStore()

  const handleSave = async () => {
    if (currentDefinition?.name) {
      await saveCurrentDefinition()
    }
  }

  const getErrorMessage = (error: string | null) => {
    if (!error) return null
    
    // Map backend error messages to user-friendly messages
    if (error.includes('No INITIAL state defined')) {
      return 'A journey deve ter um estado inicial. Adicione um estado do tipo "INITIAL" antes de salvar.'
    }
    if (error.includes('No FINAL state defined') || error.includes('must have at least one FINAL state')) {
      return 'A journey deve ter um estado final. Adicione um estado do tipo "FINAL" antes de salvar.'
    }
    if (error.includes('Source state') && error.includes('not found')) {
      return 'Estado de origem não encontrado na transição. Verifique as conexões entre estados.'
    }
    if (error.includes('Target state') && error.includes('not found')) {
      return 'Estado de destino não encontrado na transição. Verifique as conexões entre estados.'
    }
    
    // Default to the original error message if no mapping exists
    return error
  }

  const displayError = getErrorMessage(error)

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
    <>
      {/* Error alert - centered popup */}
      {displayError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md rounded-lg border border-destructive/50 bg-card p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Erro ao salvar</h3>
                <p className="text-sm text-muted-foreground">{displayError}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearError}
                className="gap-2"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

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
    </>
  )
}
