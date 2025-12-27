"use client"

import {
  LayoutGrid,
  Trello,
  Package,
  Calendar,
  Users,
  Plus,
  Wrench,
  X,
} from "lucide-react"

interface SidebarProps {
  currentView: string
  onViewChange: (
    view:
      | "dashboard"
      | "kanban"
      | "equipment"
      | "maintenance-form"
      | "calendar"
      | "teams"
      | "reports",
  ) => void
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({
  currentView,
  onViewChange,
  isOpen = true,
  onToggle,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "kanban", label: "Maintenance Board", icon: Trello },
    { id: "equipment", label: "Equipment", icon: Package },
    { id: "calendar", label: "Preventive Calendar", icon: Calendar },
    { id: "teams", label: "Teams", icon: Users },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-md flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                GearGuard
              </h1>
              <p className="text-xs text-muted-foreground">
                Asset Management
              </p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-muted/20 rounded-lg"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-sidebar-foreground hover:bg-muted/30"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer CTA */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => onViewChange("maintenance-form")}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:shadow-md hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </aside>
    </>
  )
}
