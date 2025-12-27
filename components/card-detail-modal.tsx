"use client"

import { useState } from "react"
import { X, Edit2, Save, Calendar, Clock } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  equipment: string
  type: "preventive" | "corrective" | "emergency"
  priority: "low" | "medium" | "high" | "critical"
  dueDate: string
  assignee: string
  hoursEstimated: number
  createdAt: string
  updatedAt: string
}

interface CardDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: Task) => void
}

export function CardDetailModal({ task, isOpen, onClose, onUpdate }: CardDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(task)

  if (!isOpen || !task) return null

  const handleSave = () => {
    if (editedTask) {
      onUpdate({
        ...editedTask,
        updatedAt: new Date().toISOString(),
      })
      setIsEditing(false)
    }
  }

  const handleClose = () => {
    setIsEditing(false)
    setEditedTask(task)
    onClose()
  }

  const priorityStyles = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  const typeStyles = {
    preventive: "bg-green-100 text-green-800",
    corrective: "bg-blue-100 text-blue-800",
    emergency: "bg-red-100 text-red-800",
  }

  const currentTask = editedTask || task

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-slate-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-foreground">Task Details</h2>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary font-medium"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-700 font-semibold flex items-center gap-1"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
            {isEditing ? (
              <input
                type="text"
                value={currentTask?.title || ""}
                onChange={(e) => setEditedTask(currentTask ? { ...currentTask, title: e.target.value } : null)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
              />
            ) : (
              <p className="text-lg font-semibold text-foreground">{task.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={currentTask?.description || ""}
                onChange={(e) => setEditedTask(currentTask ? { ...currentTask, description: e.target.value } : null)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
                rows={4}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{task.description}</p>
            )}
          </div>

          {/* Grid Layout for fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Equipment</label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentTask?.equipment || ""}
                  onChange={(e) => setEditedTask(currentTask ? { ...currentTask, equipment: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
                />
              ) : (
                <p className="bg-white border border-slate-200 text-foreground px-4 py-2 rounded-lg">
                  {task.equipment}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Type</label>
              {isEditing ? (
                <select
                  value={currentTask?.type || "preventive"}
                  onChange={(e) =>
                    setEditedTask(currentTask ? { ...currentTask, type: e.target.value as Task["type"] } : null)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="emergency">Emergency</option>
                </select>
              ) : (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${typeStyles[task.type]}`}>
                  {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                </span>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Priority</label>
              {isEditing ? (
                <select
                  value={currentTask?.priority || "medium"}
                  onChange={(e) =>
                    setEditedTask(currentTask ? { ...currentTask, priority: e.target.value as Task["priority"] } : null)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              ) : (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityStyles[task.priority]}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Assignee</label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentTask?.assignee || ""}
                  onChange={(e) => setEditedTask(currentTask ? { ...currentTask, assignee: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
                />
              ) : (
                <p className="bg-white border border-slate-200 text-foreground px-4 py-2 rounded-lg">{task.assignee}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Due Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={currentTask?.dueDate || ""}
                  onChange={(e) => setEditedTask(currentTask ? { ...currentTask, dueDate: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
                />
              ) : (
                <p className="bg-white border border-slate-200 text-foreground px-4 py-2 rounded-lg">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Hours Estimated */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Estimated Hours
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={currentTask?.hoursEstimated || 0}
                  onChange={(e) =>
                    setEditedTask(
                      currentTask ? { ...currentTask, hoursEstimated: Number.parseFloat(e.target.value) } : null,
                    )
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-white"
                />
              ) : (
                <p className="bg-white border border-slate-200 text-foreground px-4 py-2 rounded-lg">
                  {task.hoursEstimated} hours
                </p>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-slate-200 pt-6 space-y-3 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Created:</span>
              <span className="text-foreground font-semibold">{new Date(task.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Last Updated:</span>
              <span className="text-foreground font-semibold">{new Date(task.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
