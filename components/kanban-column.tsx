import type React from "react"
import { Plus } from "lucide-react"
import type { ReactNode } from "react"

interface Task {
  id: string
  title: string
  description: string
  equipment: string
  priority: "low" | "medium" | "high" | "critical"
  dueDate: string
  assignee: string
}

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  onDragStart: (task: Task, columnId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (columnId: string) => void
  color: string
  children: ReactNode
}

export function KanbanColumn({ id, title, tasks, onDragOver, onDrop, color, children }: KanbanColumnProps) {
  return (
    <div className="flex-1 flex flex-col min-w-80 bg-card rounded-lg border border-border overflow-hidden">
      <div className={`px-4 py-4 border-b border-border ${color} border-t-2`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{tasks.length} tasks</p>
          </div>
          <button className="p-1 hover:bg-input rounded transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div onDragOver={onDragOver} onDrop={() => onDrop(id)} className="flex-1 p-4 overflow-y-auto space-y-3">
        {children}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">Drop tasks here</div>
        )}
      </div>
    </div>
  )
}
