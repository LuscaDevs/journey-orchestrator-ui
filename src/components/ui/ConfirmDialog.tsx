import React from "react"
import { Button } from "./Button"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

export type ConfirmDialogVariant = "confirmation" | "success" | "error" | "danger"

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  variant?: ConfirmDialogVariant
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = "confirmation",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  showCancel = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
      case "error":
        return <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
      case "danger":
        return <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
      case "confirmation":
      default:
        return <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
    }
  }

  const getBorderColor = () => {
    switch (variant) {
      case "success":
        return "border-emerald-500/50"
      case "error":
        return "border-destructive/50"
      case "danger":
        return "border-destructive/50"
      case "confirmation":
      default:
        return "border-amber-500/50"
    }
  }

  const handleConfirm = () => {
    onConfirm?.()
    if (variant === "confirmation" || variant === "danger") {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`max-w-md rounded-lg border ${getBorderColor()} bg-card p-6 shadow-lg`}>
        <div className="flex items-start gap-4">
          {getIcon()}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className={`flex justify-end ${showCancel ? 'gap-2' : ''} mt-4`}>
          {showCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          )}
          {(variant === "confirmation" || variant === "danger") && onConfirm && (
            <Button
              size="sm"
              onClick={handleConfirm}
              className={variant === "danger" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}
            >
              {confirmText}
            </Button>
          )}
          {variant !== "confirmation" && variant !== "danger" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
