"use client"

import React from "react"
import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import { cn } from "../../lib/utils"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Label } from "../ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Trash2, X, Circle, Square, Octagon, ArrowRight } from "lucide-react"

interface PropertiesPanelProps {
  className?: string
}

const stateTypeLabels = {
  INITIAL: { label: "Inicial", icon: Circle },
  INTERMEDIATE: { label: "Intermediário", icon: Square },
  FINAL: { label: "Final", icon: Octagon },
} as const

export function PropertiesPanel({ className }: PropertiesPanelProps) {
  const {
    currentDefinition,
    getNodes,
    getEdges,
    updateNodeName,
    removeNode,
    removeEdge,
  } = useJourneyDefinitionStore()

  const nodes = getNodes()
  const edges = getEdges()

  // For now, we'll use a simple selection mechanism
  // In a real implementation, this would come from React Flow selection state
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = React.useState<string | null>(null)

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId)

  const handleClose = () => {
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
  }

  const handleNodeNameChange = (newName: string) => {
    if (selectedNodeId && newName.trim()) {
      updateNodeName(selectedNodeId, newName.trim())
    }
  }

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      removeNode(selectedNodeId)
      setSelectedNodeId(null)
    }
  }

  const handleDeleteEdge = () => {
    if (selectedEdgeId) {
      removeEdge(selectedEdgeId)
      setSelectedEdgeId(null)
    }
  }

  if (!selectedNode && !selectedEdge) {
    return (
      <aside className={cn(
        "flex w-80 flex-col border-l border-border bg-card",
        className
      )}>
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Propriedades</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Selecione um nó ou transição para editar
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma seleção ativa
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Clique em um nó ou transição no canvas
            </p>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={cn(
      "flex w-80 flex-col border-l border-border bg-card",
      className
    )}>
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Propriedades</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-name" className="text-xs font-medium text-muted-foreground">
                Nome do Estado
              </Label>
              <Input
                id="node-name"
                value={selectedNode.data.name}
                onChange={(e) => handleNodeNameChange(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Tipo de Estado
              </Label>
              <div className="mt-1 flex items-center gap-2 rounded-md border border-border p-2 bg-muted">
                {(() => {
                  const Icon = stateTypeLabels[selectedNode.data.type as keyof typeof stateTypeLabels].icon
                  return (
                    <>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {stateTypeLabels[selectedNode.data.type as keyof typeof stateTypeLabels].label}
                      </span>
                    </>
                  )
                })()}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                ID do Nó
              </Label>
              <div className="mt-1 font-mono text-xs text-muted-foreground bg-muted p-2 rounded">
                {selectedNode.id}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Posição
              </Label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">X</Label>
                  <Input
                    value={Math.round(selectedNode.position.x)}
                    readOnly
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y</Label>
                  <Input
                    value={Math.round(selectedNode.position.y)}
                    readOnly
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteNode}
                className="w-full gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir Nó
              </Button>
            </div>
          </div>
        )}

        {selectedEdge && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Transição
              </Label>
              <div className="mt-1 font-mono text-xs text-muted-foreground bg-muted p-2 rounded">
                {selectedEdge.source} -&gt; {selectedEdge.target}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                ID da Transição
              </Label>
              <div className="mt-1 font-mono text-xs text-muted-foreground bg-muted p-2 rounded">
                {selectedEdge.id}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Evento
              </Label>
              <Input
                value={selectedEdge.data?.event || 'transition'}
                readOnly
                className="mt-1"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteEdge}
                className="w-full gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir Transição
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
