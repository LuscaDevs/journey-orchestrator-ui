"use client"

import { cn } from "../../lib/utils"
import { useJourneyDefinitionStore } from "../../store/useJourneyDefinitionStore"
import { Circle, Square, Octagon, GripVertical } from "lucide-react"

interface PaletteItem {
  type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL'
  label: string
  description: string
  icon: typeof Circle
  color: string
  bgColor: string
}

const paletteItems: PaletteItem[] = [
  {
    type: "INITIAL",
    label: "Estado Inicial",
    description: "Ponto de entrada do fluxo",
    icon: Circle,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    type: "INTERMEDIATE",
    label: "Estado Intermediário",
    description: "Etapa do processo",
    icon: Square,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    type: "FINAL",
    label: "Estado Final",
    description: "Conclusão do fluxo",
    icon: Octagon,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
]

interface NodePaletteProps {
  className?: string
}

export function NodePalette({ className }: NodePaletteProps) {
  const { addNode } = useJourneyDefinitionStore()

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    stateType: 'INITIAL' | 'INTERMEDIATE' | 'FINAL'
  ) => {
    event.dataTransfer.setData("application/reactflow", stateType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleAddNode = (type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL') => {
    const item = paletteItems.find(item => item.type === type)
    if (item) {
      addNode(item.label, type)
    }
  }

  return (
    <aside
      className={cn(
        "flex w-64 flex-col border-r border-border bg-card",
        className
      )}
    >
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Componentes</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Clique ou arraste para adicionar ao canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {paletteItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => onDragStart(e, item.type)}
                onClick={() => handleAddNode(item.type)}
                className={cn(
                  "group flex cursor-grab items-center gap-3 rounded-lg border border-border p-3",
                  "bg-background transition-all hover:border-muted-foreground hover:shadow-md",
                  "active:cursor-grabbing"
                )}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                <div className={cn("rounded-md p-2", item.bgColor)}>
                  <Icon className={cn("h-4 w-4", item.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-border p-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Legenda
        </h3>
        <div className="space-y-1.5">
          {paletteItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.type} className="flex items-center gap-2">
                <Icon className={cn("h-3 w-3", item.color)} />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
