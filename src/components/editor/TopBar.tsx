"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { Input } from "../ui/Input"
import {
  ArrowLeft,
  Save,
  Upload,
  MoreHorizontal,
  Circle,
  AlertCircle,
  Loader2,
  CheckCircle,
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
    updateJourneyCode,
    deleteDefinition,
    discardChanges,
    saveCurrentDefinition,
    error,
    isLoading,
    clearError,
    success,
    clearSuccess
  } = useJourneyDefinitionStore()

  // Track if save was just completed to temporarily disable button
  const saveJustCompleted = React.useRef(false)

  // Reset saveJustCompleted flag when success is cleared
  React.useEffect(() => {
    if (!success) {
      saveJustCompleted.current = false
    }
  }, [success])

  // State for editing journey code and name
  const [editedName, setEditedName] = React.useState(currentDefinition?.name || '')
  const [editedCode, setEditedCode] = React.useState(currentDefinition?.journeyCode || '')

  // Update edited values when currentDefinition changes
  React.useEffect(() => {
    if (currentDefinition) {
      setEditedName(currentDefinition.name || '')
      setEditedCode(currentDefinition.journeyCode || '')
    }
  }, [currentDefinition])

  const handleNameChange = (value: string) => {
    setEditedName(value)
  }

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase()
    setEditedCode(upperValue)
  }

  const handleSave = async () => {
    if (currentDefinition?.name) {
      // Update journey code and name before saving
      updateJourneyCode(editedCode)
      updateDefinition(editedName)
      saveJustCompleted.current = true
      await saveCurrentDefinition()
    }
  }

  const getErrorMessage = (error: string | null) => {
    if (!error) return null
    
    // Parse error code and detail if separated by pipe
    const [errorCode, detail] = error.includes('|') ? error.split('|') : [error, null]
    
    // Map backend error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'NO_INITIAL_STATE': 'A journey deve ter um estado inicial. Adicione um estado do tipo "INITIAL" antes de salvar.',
      'NO_FINAL_STATE': 'A journey deve ter um estado final. Adicione um estado do tipo "FINAL" antes de salvar.',
      'SOURCE_STATE_NOT_FOUND': 'Estado de origem não encontrado na transição. Verifique as conexões entre estados.',
      'TARGET_STATE_NOT_FOUND': 'Estado de destino não encontrado na transição. Verifique as conexões entre estados.',
      'TRANSITION_CONFLICT': 'Conflito na transição: o estado de origem e destino referem-se a estados diferentes. Verifique as conexões.',
      'TRANSITION_SOURCE_REQUIRED': 'A transição deve ter um estado de origem. Verifique as conexões entre estados.',
      'TRANSITION_TARGET_REQUIRED': 'A transição deve ter um estado de destino. Verifique as conexões entre estados.',
      'UNREACHABLE_STATE': detail 
        ? `Alguns estados não são alcançáveis a partir do estado inicial: ${detail.replace(/Journey definition validation failed: /, '').replace(/State /g, '').replace(/; /g, ', ').replace(/ is unreachable from initial state/g, '')}. Adicione transições para conectar esses estados.`
        : 'Alguns estados não são alcançáveis a partir do estado inicial. Adicione transições para conectar os estados.',
    }
    
    // Check if error matches a known error code
    if (errorMessages[errorCode]) {
      return errorMessages[errorCode]
    }
    
    // Fallback: try to parse from detail string for backward compatibility
    if (error.includes('No INITIAL state defined')) {
      return errorMessages['NO_INITIAL_STATE']
    }
    if (error.includes('No FINAL state defined') || error.includes('must have at least one FINAL state')) {
      return errorMessages['NO_FINAL_STATE']
    }
    if (error.includes('Source state') && error.includes('not found')) {
      return errorMessages['SOURCE_STATE_NOT_FOUND']
    }
    if (error.includes('Target state') && error.includes('not found')) {
      return errorMessages['TARGET_STATE_NOT_FOUND']
    }
    
    // Default to the original error message if no mapping exists
    return error
  }

  const displayError = getErrorMessage(error)

  const handlePublish = () => {
    if (currentDefinition?.status === "RASCUNHO") {
      // Update status to ATIVA - this would need to be implemented in the store
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
      {/* Success alert - centered popup */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md rounded-lg border border-emerald-500/50 bg-card p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Sucesso</h3>
                <p className="text-sm text-muted-foreground">{success}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSuccess}
                className="gap-2"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

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
          {/* Journey code field */}
          <div className="flex items-center gap-2">
            <Input
              value={editedCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="CÓDIGO"
              className="h-6 text-sm font-semibold text-foreground px-2 py-0 w-32"
              maxLength={10}
            />
          </div>
          
          {/* Name field */}
          <div className="flex items-center gap-2">
            <Input
              value={editedName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-6 text-sm font-semibold text-foreground px-2 py-0 w-32"
              placeholder="Nome da Jornada"
            />
            {hasUnsavedChanges && (
              <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
            )}
          </div>
          
          <Badge
            variant={currentDefinition.status === "ATIVA" ? "default" : "secondary"}
            className={
              currentDefinition.status === "ATIVA"
                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
            }
          >
            {currentDefinition.status === "ATIVA" ? "Ativa" : "Rascunho"}
          </Badge>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isLoading || !currentDefinition?.name || !!success || saveJustCompleted.current}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar
        </Button>

        {currentDefinition.status === "RASCUNHO" && (
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
