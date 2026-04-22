"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
  ArrowUpDown,
} from "lucide-react"
import type { JourneyInstanceListItem } from "../../hooks/useJourneyInstances"
import { formatDate } from "../../lib/journeyAdapter"
import { cn } from "../../lib/utils"

interface JourneyInstancesTableProps {
  instances: JourneyInstanceListItem[]
}

type SortKey = keyof JourneyInstanceListItem
type SortDir = "asc" | "desc"

function StatusBadge({ status }: { status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' }) {
  const isRunning = status === "RUNNING";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";
  const isCancelled = status === "CANCELLED";

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium px-2 py-0.5 border rounded-full gap-1.5 items-center inline-flex",
        isRunning
          ? "border-blue-500/40 text-blue-600 bg-blue-500/10"
          : isCompleted
          ? "border-[oklch(0.65_0.18_160/0.4)] text-[oklch(0.75_0.18_160)] bg-[oklch(0.65_0.18_160/0.08)]"
          : isFailed
          ? "border-destructive/40 text-destructive bg-destructive/10"
          : "border-[oklch(0.62_0.16_60/0.4)] text-[oklch(0.78_0.14_60)] bg-[oklch(0.62_0.16_60/0.08)]"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          isRunning
            ? "bg-blue-500"
            : isCompleted
            ? "bg-[oklch(0.65_0.18_160)]"
            : isFailed
            ? "bg-destructive"
            : "bg-[oklch(0.72_0.16_60)]"
        )}
      />
      {isRunning ? "Em Execução" : isCompleted ? "Concluído" : isFailed ? "Falhou" : "Cancelado"}
    </Badge>
  )
}

export function JourneyInstancesTable({
  instances,
}: JourneyInstancesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...instances].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv))
    return sortDir === "asc" ? cmp : -cmp
  })

  function SortButton({ label, col }: { label: string; col: SortKey }) {
    const active = sortKey === col
    return (
      <button
        onClick={() => handleSort(col)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium transition-colors",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ArrowUpDown className={cn("h-3 w-3", active ? "text-primary" : "opacity-40")} />
      </button>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card hover:bg-card border-border">
            <TableHead className="w-40 pl-4">
              <SortButton label="ID" col="instanceId" />
            </TableHead>
            <TableHead className="w-48">
              <SortButton label="Journey Code" col="journeyCode" />
            </TableHead>
            <TableHead className="w-24">
              <SortButton label="Versão" col="version" />
            </TableHead>
            <TableHead className="w-40">
              <SortButton label="Estado Atual" col="currentState" />
            </TableHead>
            <TableHead className="w-32">
              <SortButton label="Status" col="status" />
            </TableHead>
            <TableHead className="w-44 pr-4">
              <SortButton label="Criado em" col="createdAt" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                Nenhuma instância de jornada encontrada.
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((instance) => (
              <TableRow
                key={instance.instanceId}
                className="border-border hover:bg-muted/40 transition-colors group"
              >
                <TableCell className="pl-4 font-mono text-xs text-muted-foreground">
                  {instance.instanceId}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {instance.journeyCode}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">
                    {instance.version}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">
                    {instance.currentState}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={instance.status} />
                </TableCell>
                <TableCell className="pr-4 text-xs text-gray-600">
                  {formatDate(instance.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
