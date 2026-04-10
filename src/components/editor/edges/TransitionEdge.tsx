"use client"

import { memo, useState, useCallback } from "react"
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow"
import { cn } from "../../../lib/utils"
import { useJourneyDefinitionStore } from "../../../store/useJourneyDefinitionStore"

interface TransitionEdgeData {
  event: string
  condition?: string
}

function TransitionEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<TransitionEdgeData>) {
  const { updateEdgeName } = useJourneyDefinitionStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(data?.event || "Transição")

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
    setEditName(data?.event || "Transição")
  }, [data?.event])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // Only update the store - JourneyDefinition is the single source of truth
      updateEdgeName(id, editName)
      setIsEditing(false)
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setEditName(data?.event || "Transição")
    }
  }, [editName, id, updateEdgeName, data?.event])

  const handleBlur = useCallback(() => {
    // Only update the store - JourneyDefinition is the single source of truth
    updateEdgeName(id, editName)
    setIsEditing(false)
  }, [editName, id, updateEdgeName])

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 2,
          stroke: selected ? "var(--primary)" : "rgba(156, 163, 175, 0.5)",
          transition: "stroke 0.2s",
        }}
        markerEnd="url(#arrow)"
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className={cn(
            "nodrag nopan cursor-pointer rounded-md border px-2 py-1 text-xs transition-all",
            "bg-popover text-popover-foreground shadow-md",
            selected
              ? "border-primary ring-1 ring-primary"
              : "border-border hover:border-muted-foreground"
          )}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
              className="bg-transparent outline-none w-20 text-center"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="font-medium">{data?.event || "Transição"}</span>
              {data?.condition && (
                <span className="ml-1.5 text-muted-foreground">
                  [{data.condition}]
                </span>
              )}
            </>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export const TransitionEdge = memo(TransitionEdgeComponent)
