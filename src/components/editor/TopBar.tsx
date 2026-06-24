"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { Input } from "../ui/Input"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import {
  ArrowLeft,
  Save,
  Upload,
  MoreHorizontal,
  Circle,
  Loader2,
  Undo,
  Redo,
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
    setHasUnsavedChanges,
    setCurrentDefinition,
    hasActualChanges,
    updateDefinition,
    updateJourneyCode,
    deleteDefinition,
    discardChanges,
    saveCurrentDefinition,
    publishCurrentDefinition,
    error,
    isLoading,
    clearError,
    success,
    clearSuccess,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useJourneyDefinitionStore()
  const saveJustCompleted = React.useRef(false)

  const [editedName, setEditedName] = React.useState(currentDefinition?.name || '')
  const [editedCode, setEditedCode] = React.useState(currentDefinition?.journeyCode || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [showBackConfirm, setShowBackConfirm] = React.useState(false)

  // Initialize edited values on mount
  React.useEffect(() => {
    if (currentDefinition) {
      setEditedName(currentDefinition.name || '')
      setEditedCode(currentDefinition.journeyCode || '')
    }
  }, []) // Run only once on mount

  // Update edited values only after saved or after save, not on every currentDefinition change
  React.useEffect(() => {
    if (currentDefinition && saveJustCompleted.current) {
      setEditedName(currentDefinition.name || '')
      setEditedCode(currentDefinition.journeyCode || '')
      saveJustCompleted.current = false
    }
  }, [currentDefinition])

  // Keyboard shortcuts for undo/redo
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is in an input field - don't trigger shortcuts
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleNameChange = (value: string) => {
    setEditedName(value)
    setHasUnsavedChanges(true)
  }

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase()
    setEditedCode(upperValue)
    setHasUnsavedChanges(true)
  }

  const hasEditedChanges = () => {
    if (!currentDefinition) return false
    return (
      editedName !== currentDefinition.name ||
      editedCode !== currentDefinition.journeyCode
    )
  }

  const handleSave = async () => {
    if (currentDefinition) {
      // Update journey code and name in currentDefinition before saving
      setCurrentDefinition({
        ...currentDefinition,
        journeyCode: editedCode,
        name: editedName
      })
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
      'INVALID_BASIC_FIELDS': 'Preencha o Journey Code e o Journey Name antes de salvar.',
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
    if (error.includes('Journey code is required') || error.includes('Journey name is required')) {
      return errorMessages['INVALID_BASIC_FIELDS']
    }
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

  const handlePublish = async () => {
    if (currentDefinition?.status === "RASCUNHO" || currentDefinition?.status === "INATIVA") {
      await publishCurrentDefinition()
    }
  }

  const handleBack = () => {
    if (hasActualChanges() || hasEditedChanges()) {
      setShowBackConfirm(true)
    } else {
      navigate("/")
    }
  }

  const handleConfirmBack = () => {
    discardChanges()
    navigate("/")
    setShowBackConfirm(false)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (currentDefinition) {
      deleteDefinition(currentDefinition.id)
      navigate("/")
    }
    setShowDeleteConfirm(false)
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

  if (!currentDefinition) return null

  return (
    <>
      {/* Success alert */}
      <ConfirmDialog
        isOpen={!!success}
        onClose={clearSuccess}
        title="Sucesso"
        message={success || ''}
        variant="success"
        showCancel={false}
      />

      {/* Error alert */}
      <ConfirmDialog
        isOpen={!!displayError}
        onClose={clearError}
        title="Erro ao salvar"
        message={displayError || ''}
        variant="error"
        showCancel={false}
      />

      {/* Back confirmation */}
      <ConfirmDialog
        isOpen={showBackConfirm}
        onClose={() => setShowBackConfirm(false)}
        onConfirm={handleConfirmBack}
        title="Alterações não salvas"
        message="Você tem alterações não salvas. Deseja descartá-las?"
        variant="confirmation"
        confirmText="Descartar"
        cancelText="Cancelar"
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir jornada"
        message="Tem certeza que deseja excluir esta jornada?"
        variant="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
      />

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
              placeholder="Journey Code"
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
              placeholder="Journey Name"
              maxLength={20}
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
                : currentDefinition.status === "INATIVA"
                ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
            }
          >
            {currentDefinition.status === "ATIVA" ? "Ativa" : currentDefinition.status === "INATIVA" ? "Inativa" : "Rascunho"}
          </Badge>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Desfazer (Ctrl+Z)"
          className="text-muted-foreground hover:text-foreground"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Refazer (Ctrl+Y)"
          className="text-muted-foreground hover:text-foreground"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isLoading || !!success}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar
        </Button>

        {(currentDefinition.status === "RASCUNHO" || currentDefinition.status === "INATIVA") && (
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
