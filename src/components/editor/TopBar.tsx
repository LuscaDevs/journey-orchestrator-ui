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
    updateCurrentDefinition,
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
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [isEditingCode, setIsEditingCode] = React.useState(false)
  const [editedName, setEditedName] = React.useState(currentDefinition?.name || '')
  const [editedCode, setEditedCode] = React.useState(currentDefinition?.journeyCode || '')

  // Update edited values when currentDefinition changes
  React.useEffect(() => {
    if (currentDefinition) {
      setEditedName(currentDefinition.name || '')
      setEditedCode(currentDefinition.journeyCode || '')
    }
  }, [currentDefinition])

  const handleSaveName = () => {
    if (currentDefinition && editedName) {
      updateDefinition(editedName)
      setIsEditingName(false)
    }
  }

  const handleSaveCode = () => {
    if (currentDefinition && editedCode) {
      // Validate SNAKE_CASE
      const snakeCaseRegex = /^[A-Z][A-Z0-9_]*$/
      if (!snakeCaseRegex.test(editedCode)) {
        alert('O journey code deve estar em SNAKE_CASE (ex: MY_JOURNEY)')
        return
      }
      if (editedCode.length > 10) {
        alert('O journey code deve ter no máximo 10 caracteres')
        return
      }
      // Update journey code - just mark as unsaved changes
      setIsEditingCode(false)
    }
  }

  const handleSave = async () => {
    if (currentDefinition?.name) {
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
          <div className="flex flex-col gap-1">
            {/* Name field */}
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName()
                    if (e.key === 'Escape') {
                      setEditedName(currentDefinition?.name || '')
                      setIsEditingName(false)
                    }
                  }}
                  className="h-6 text-sm font-semibold text-foreground px-2 py-0 w-48"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 
                  className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary"
                  onClick={() => setIsEditingName(true)}
                  title="Clique para editar o nome"
                >
                  {currentDefinition.name || "Nova Jornada"}
                </h1>
                {hasUnsavedChanges && (
                  <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
                )}
              </div>
            )}
            
            {/* Journey code field */}
            {isEditingCode ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value.toUpperCase())}
                  onBlur={handleSaveCode}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCode()
                    if (e.key === 'Escape') {
                      setEditedCode(currentDefinition?.journeyCode || '')
                      setIsEditingCode(false)
                    }
                  }}
                  placeholder="CÓDIGO"
                  className="h-5 text-xs text-muted-foreground px-2 py-0 w-24"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p 
                  className="text-xs text-muted-foreground cursor-pointer hover:text-primary"
                  onClick={() => setIsEditingCode(true)}
                  title="Clique para editar o código"
                >
                  {currentDefinition.journeyCode || 'CÓDIGO'}
                </p>
                <span className="text-xs text-muted-foreground">
                  {currentDefinition.id.slice(0, 8)}... v{currentDefinition.version}
                </span>
              </div>
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
