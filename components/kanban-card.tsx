"use client"

import { Calendar } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  equipment: string
  priority: "low" | "medium" | "high" | "critical"
  dueDate: string
  assignee: string
}

interface KanbanCardProps {
  task: Task
  columnId: string
  onDragStart: (task: Task, columnId: string) => void
}

export function KanbanCard({ task, columnId, onDragStart }: KanbanCardProps) {
  const priorityStyles = {
    low: "bg-blue-900/30 text-blue-300 border-blue-700",
    medium: "bg-yellow-900/30 text-yellow-300 border-yellow-700",
    high: "bg-orange-900/30 text-orange-300 border-orange-700",
    critical: "bg-red-900/30 text-red-300 border-red-700",
  }

  const getPriorityColor = () => priorityStyles[task.priority]

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task, columnId)}
      className="bg-input border border-border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <h4 className="font-semibold text-foreground text-sm mb-2">{task.title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{task.description}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{task.equipment}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded border ${getPriorityColor()}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border">{task.assignee}</div>
      </div>
    </div>
  )
}
