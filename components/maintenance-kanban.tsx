"use client"

import type React from "react"
import { useState } from "react"
import { KanbanCard } from "./kanban-card"
import { KanbanColumn } from "./kanban-column"
import { CardDetailModal } from "./card-detail-modal"

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
  createdAt: string // added timestamp fields
  updatedAt: string
}

interface Board {
  [key: string]: Task[]
}

const initialBoard: Board = {
  new: [
    {
      id: "1",
      title: "Oil change - Pump A",
      description: "Scheduled preventive maintenance",
      equipment: "Pump A",
      type: "preventive",
      priority: "medium",
      dueDate: "2024-01-15",
      assignee: "John Smith",
      hoursEstimated: 2,
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
  ],
  "in-progress": [
    {
      id: "3",
      title: "Motor bearing inspection",
      description: "Check bearing wear patterns",
      equipment: "Motor Unit 2",
      type: "corrective",
      priority: "high",
      dueDate: "2024-01-10",
      assignee: "Sarah Lee",
      hoursEstimated: 3,
      createdAt: "2024-01-01T11:00:00Z",
      updatedAt: "2024-01-02T14:30:00Z",
    },
  ],
  repaired: [
    {
      id: "4",
      title: "Hydraulic fluid flush",
      description: "Complete fluid replacement",
      equipment: "Hydraulic Press",
      type: "corrective",
      priority: "high",
      dueDate: "2024-01-12",
      assignee: "John Smith",
      hoursEstimated: 4,
      createdAt: "2024-01-01T12:00:00Z",
      updatedAt: "2024-01-03T09:15:00Z",
    },
  ],
  scrap: [],
}

export function MaintenanceKanban() {
  const [board, setBoard] = useState<Board>(initialBoard)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumn: string } | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null) // added state for selected task
  const [isModalOpen, setIsModalOpen] = useState(false) // added modal state

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, fromColumn: columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (!draggedTask) return

    setBoard((prev) => {
      const newBoard = { ...prev }

      // Remove from source column
      newBoard[draggedTask.fromColumn] = newBoard[draggedTask.fromColumn].filter((t) => t.id !== draggedTask.task.id)

      // Add to destination column
      if (!newBoard[columnId]) {
        newBoard[columnId] = []
      }
      newBoard[columnId] = [...newBoard[columnId], draggedTask.task]

      return newBoard
    })
    setDraggedTask(null)
  }

  const handleCardClick = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setBoard((prev) => {
      const newBoard = { ...prev }
      for (const columnId in newBoard) {
        const taskIndex = newBoard[columnId].findIndex((t) => t.id === updatedTask.id)
        if (taskIndex !== -1) {
          newBoard[columnId][taskIndex] = updatedTask
          break
        }
      }
      return newBoard
    })
    setSelectedTask(updatedTask)
  }

  const columns = [
    { id: "new", title: "New", color: "border-muted" },
    { id: "in-progress", title: "In Progress", color: "border-primary" },
    { id: "repaired", title: "Repaired", color: "border-green-500" },
    { id: "scrap", title: "Scrap", color: "border-destructive" },
  ]

  return (
    <>
      <div className="flex gap-3 sm:gap-4 md:gap-6 h-full overflow-x-auto pb-4 min-w-min md:min-w-full">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={board[column.id] || []}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            color={column.color}
          >
            {(board[column.id] || []).map((task) => (
              <div key={task.id} onClick={() => handleCardClick(task)} className="cursor-pointer">
                <KanbanCard task={task} columnId={column.id} onDragStart={handleDragStart} />
              </div>
            ))}
          </KanbanColumn>
        ))}
      </div>

      <CardDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateTask}
      />
    </>
  )
}
