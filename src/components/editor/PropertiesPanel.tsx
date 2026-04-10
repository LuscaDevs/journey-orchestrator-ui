"use client"

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
    getSelectedNode,
    getSelectedEdge,
    setSelectedNode,
    setSelectedEdge,
    updateNodeName,
    removeNode,
    removeEdge,
    getNodes,
    getEdges,
  } = useJourneyDefinitionStore()

  const selectedNode = getSelectedNode()
  const selectedEdge = getSelectedEdge()
  const nodes = getNodes()
  const edges = getEdges()

  const handleClose = () => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }

  const handleNodeNameChange = (newName: string) => {
    if (selectedNode && newName.trim()) {
      updateNodeName(selectedNode.id, newName.trim())
    }
  }

  const handleDeleteNode = () => {
    if (selectedNode) {
      removeNode(selectedNode.id)
      setSelectedNode(null)
    }
  }

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      removeEdge(selectedEdge.id)
      setSelectedEdge(null)
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
            <div className="space-y-2">
              <Label htmlFor="node-name">Nome do Estado</Label>
              <Input
                id="node-name"
                value={selectedNode.data.name}
                onChange={(e) => handleNodeNameChange(e.target.value)}
                placeholder="Nome do estado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-type">Tipo</Label>
              <Select
                value={selectedNode.data.type}
                disabled
              >
                <SelectTrigger id="node-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stateTypeLabels).map(([type, { label, icon: Icon }]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3" />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ID do Nó</Label>
              <div className="font-mono text-xs text-muted-foreground bg-muted p-2 rounded">
                {selectedNode.id}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Posição</Label>
              <div className="grid grid-cols-2 gap-2">
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
            {/* Connection info */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Conexão
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground">
                  {nodes.find((n) => n.id === selectedEdge.source)?.data?.name || "?"}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-foreground">
                  {nodes.find((n) => n.id === selectedEdge.target)?.data?.name || "?"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edge-id">ID da Transição</Label>
              <div className="font-mono text-xs text-muted-foreground bg-muted p-2 rounded">
                {selectedEdge.id}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edge-event">Evento</Label>
              <Input
                id="edge-event"
                value={selectedEdge.data?.event || 'transition'}
                readOnly
                placeholder="Nome do evento"
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
