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

type EditingField = 'event' | 'condition' | null

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
  const { updateEdgeName, updateEdgeConditions } = useJourneyDefinitionStore()
  const [editingField, setEditingField] = useState<EditingField>(null)
  const [editEvent, setEditEvent] = useState(data?.event || "Transição")
  const [editCondition, setEditCondition] = useState(data?.condition || "")

  const handleEventDoubleClick = useCallback(() => {
    setEditingField('event')
    setEditEvent(data?.event || "Transição")
  }, [data?.event])

  const handleConditionDoubleClick = useCallback(() => {
    setEditingField('condition')
    setEditCondition(data?.condition || "")
  }, [data?.condition])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (editingField === 'event') {
        updateEdgeName(id, editEvent)
      } else if (editingField === 'condition') {
        updateEdgeConditions(id, editCondition)
      }
      setEditingField(null)
    } else if (e.key === "Escape") {
      setEditingField(null)
      setEditEvent(data?.event || "Transição")
      setEditCondition(data?.condition || "")
    }
  }, [editingField, editEvent, editCondition, id, updateEdgeName, updateEdgeConditions, data?.event, data?.condition])

  const handleBlur = useCallback(() => {
    if (editingField === 'event') {
      updateEdgeName(id, editEvent)
    } else if (editingField === 'condition') {
      updateEdgeConditions(id, editCondition)
    }
    setEditingField(null)
  }, [editingField, editEvent, editCondition, id, updateEdgeName, updateEdgeConditions])

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
            "nodrag nopan cursor-pointer rounded-md border px-2 py-1.5 text-xs transition-all",
            "bg-popover text-popover-foreground shadow-md",
            selected
              ? "border-primary ring-1 ring-primary"
              : "border-border hover:border-muted-foreground"
          )}
        >
          <div className="flex flex-col gap-0.5">
            {/* Event field */}
            {editingField === 'event' ? (
              <input
                type="text"
                value={editEvent}
                onChange={(e) => setEditEvent(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                autoFocus
                className="bg-transparent outline-none w-20 text-center font-bold text-foreground"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="font-bold text-foreground cursor-pointer"
                onDoubleClick={handleEventDoubleClick}
              >
                {data?.event || "Transição"}
              </span>
            )}

            {/* Condition field */}
            {data?.condition || editingField === 'condition' ? (
              editingField === 'condition' ? (
                <input
                  type="text"
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  autoFocus
                  placeholder="(no condition)"
                  className="bg-transparent outline-none w-24 text-center text-xs italic text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="text-xs italic text-muted-foreground cursor-pointer"
                  onDoubleClick={handleConditionDoubleClick}
                >
                  ({data?.condition || "no condition"})
                </span>
              )
            ) : null}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export const TransitionEdge = memo(TransitionEdgeComponent)
