"use client"

import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  Settings,
  ChevronDown,
  Workflow,
  Bell,
  HelpCircle,
} from "lucide-react"
import { cn } from "../../lib/utils"

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Journeys",
    href: "/journeys",
    icon: GitBranch,
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Workflow className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Journey Orchestrator
        </span>
      </div>

      {/* Workspace selector */}
      <div className="border-b border-sidebar-border px-3 py-2">
        <button className="flex w-full items-center justify-between rounded-md px-2 py-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-primary/20 text-[9px] font-bold flex items-center justify-center text-primary">
              P
            </div>
            <span className="font-medium">Produção</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <button
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors w-full text-left",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-sidebar-border px-3 py-3 flex flex-col gap-0.5">
        <button className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-left">
          <Bell className="h-4 w-4 shrink-0" />
          Notificações
        </button>
        <button className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-left">
          <HelpCircle className="h-4 w-4 shrink-0" />
          Ajuda
        </button>
      </div>

      {/* User */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-sidebar-accent">
          <div className="h-7 w-7 rounded-full bg-primary/20 text-primary text-[11px] font-semibold flex items-center justify-center">
            JS
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs font-medium text-sidebar-foreground truncate">
              João Silva
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              joao@empresa.com
            </span>
          </div>
          <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </aside>
  )
}
