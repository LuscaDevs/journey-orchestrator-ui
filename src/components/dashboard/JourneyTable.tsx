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
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Globe,
  ArrowUpDown,
  GitBranch,
  ArrowRight,
} from "lucide-react"
import type { Journey, JourneyStatus } from "../../lib/journeyAdapter"
import { formatDate } from "../../lib/journeyAdapter"
import { cn } from "../../lib/utils"

interface JourneysTableProps {
  journeys: Journey[]
  onUpdate: (updated: Journey) => void
  onDelete: (id: string) => void
  onDuplicate: (journey: Journey) => void
  onPublish: (id: string) => void
  onEdit: (journey: Journey) => void
}

type SortKey = keyof Journey
type SortDir = "asc" | "desc"

function StatusBadge({ status }: { status: JourneyStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium px-2 py-0.5 border rounded-full gap-1.5 items-center inline-flex",
        status === "published"
          ? "border-[oklch(0.65_0.18_160/0.4)] text-[oklch(0.75_0.18_160)] bg-[oklch(0.65_0.18_160/0.08)]"
          : "border-[oklch(0.62_0.16_60/0.4)] text-[oklch(0.78_0.14_60)] bg-[oklch(0.62_0.16_60/0.08)]"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          status === "published"
            ? "bg-[oklch(0.65_0.18_160)]"
            : "bg-[oklch(0.72_0.16_60)]"
        )}
      />
      {status === "published" ? "Publicado" : "Rascunho"}
    </Badge>
  )
}

export function JourneysTable({
  journeys,
  onUpdate,
  onDelete,
  onDuplicate,
  onPublish,
  onEdit,
}: JourneysTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("code")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...journeys].sort((a, b) => {
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
            <TableHead className="w-28 pl-4">
              <SortButton label="Código" col="code" />
            </TableHead>
            <TableHead>
              <SortButton label="Nome" col="name" />
            </TableHead>
            <TableHead className="w-24">
              <SortButton label="Versão" col="version" />
            </TableHead>
            <TableHead className="w-32">
              <SortButton label="Status" col="status" />
            </TableHead>
            <TableHead className="w-44">
              <SortButton label="Criado em" col="createdAt" />
            </TableHead>
            <TableHead className="w-44">
              <SortButton label="Atualizado em" col="updatedAt" />
            </TableHead>
            <TableHead className="w-20 text-center">
              <span className="flex items-center gap-1 justify-center text-xs font-medium text-muted-foreground">
                <GitBranch className="h-3 w-3" />
                Estados
              </span>
            </TableHead>
            <TableHead className="w-24 text-center">
              <span className="flex items-center gap-1 justify-center text-xs font-medium text-muted-foreground">
                <ArrowRight className="h-3 w-3" />
                Transições
              </span>
            </TableHead>
            <TableHead className="w-12 pr-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-16 text-muted-foreground text-sm">
                Nenhuma journey encontrada.
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((journey) => (
              <TableRow
                key={journey.id}
                className="border-border hover:bg-muted/40 transition-colors group"
              >
                <TableCell className="pl-4 font-mono text-xs text-muted-foreground">
                  {journey.code}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {journey.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">
                    {journey.version}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={journey.status} />
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {formatDate(journey.createdAt)}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {formatDate(journey.updatedAt)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-foreground mx-auto">
                    {journey.statesCount}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-foreground mx-auto">
                    {journey.transitionsCount}
                  </span>
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      onClick={() => onEdit(journey)}
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      onClick={() => onDuplicate(journey)}
                      title="Duplicar"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {journey.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-[oklch(0.65_0.18_160)] hover:bg-[oklch(0.65_0.18_160/0.1)]"
                        onClick={() => onPublish(journey.id)}
                        title="Publicar"
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(journey.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
