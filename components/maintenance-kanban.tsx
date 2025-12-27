"use client"

import type React from "react"
import { useEffect, useState } from "react";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";
import { CardDetailModal } from "./card-detail-modal";
import {
  fetchEquipment,
  fetchRequests,
  fetchUsers,
  updateRequestStatus,
  type EquipmentRecord,
  type MaintenanceRequestRecord,
  type UserRecord,
} from "@/lib/api";
import { ApiError } from "@/lib/api-client";

type ColumnId = "new" | "in-progress" | "repaired" | "scrap";

interface Task {
  id: string;
  requestId: number;
  statusId: number;
  title: string;
  description: string;
  equipment: string;
  type: "preventive" | "corrective" | "emergency";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
  assignee: string;
  hoursEstimated: number;
  createdAt: string;
  updatedAt: string;
}

type Board = Record<ColumnId, Task[]>;

const COLUMN_TO_STATUS: Record<ColumnId, number> = {
  new: 1,
  "in-progress": 2,
  repaired: 3,
  scrap: 4,
};

const STATUS_TO_COLUMN: Record<number, ColumnId> = {
  1: "new",
  2: "in-progress",
  3: "repaired",
  4: "scrap",
};

const emptyBoard: Board = {
  new: [],
  "in-progress": [],
  repaired: [],
  scrap: [],
};

export function MaintenanceKanban() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [draggedTask, setDraggedTask] = useState<{
    task: Task;
    fromColumn: ColumnId;
  } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadBoard = async () => {
      try {
        setLoading(true);
        const [requests, equipment, users] = await Promise.all([
          fetchRequests(),
          fetchEquipment(),
          fetchUsers(),
        ]);

        if (!active) return;

        const equipmentMap = new Map<number, EquipmentRecord>(
          equipment.map((item) => [item.equipment_id, item])
        );
        const userMap = new Map<number, UserRecord>(
          users.map((user) => [user.user_id, user])
        );
        const nextBoard = buildBoardFromRequests(
          requests,
          equipmentMap,
          userMap
        );
        setBoard(nextBoard);
        setError("");
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "Unable to load maintenance board";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBoard();
    return () => {
      active = false;
    };
  }, []);

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, fromColumn: columnId as ColumnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: ColumnId) => {
    if (!draggedTask) return;
    if (draggedTask.fromColumn === columnId) {
      setDraggedTask(null);
      return;
    }

    const statusId = COLUMN_TO_STATUS[columnId];
    const userId = getStoredUserId();
    if (!userId) {
      setError("Please sign in again to update request status.");
      setDraggedTask(null);
      return;
    }

    try {
      await updateRequestStatus(draggedTask.task.requestId, {
        status_id: statusId,
        changed_by: userId,
        duration_hours:
          columnId === "repaired"
            ? draggedTask.task.hoursEstimated || 1
            : undefined,
        notes: `Status updated via board (${draggedTask.fromColumn} → ${columnId})`,
      });

      setBoard((prev) =>
        moveTask(
          prev,
          draggedTask.task,
          draggedTask.fromColumn,
          columnId,
          statusId
        )
      );
      setStatusMessage("Request status synced");
      setTimeout(() => setStatusMessage(""), 2000);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to update status";
      setError(message);
    } finally {
      setDraggedTask(null);
    }
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setBoard((prev) => {
      const nextBoard: Board = { ...prev };
      const column = STATUS_TO_COLUMN[updatedTask.statusId] ?? "new";
      nextBoard[column] = nextBoard[column].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return nextBoard;
    });
    setSelectedTask(updatedTask);
  };

  const columns = [
    { id: "new" as ColumnId, title: "New", color: "border-muted" },
    {
      id: "in-progress" as ColumnId,
      title: "In Progress",
      color: "border-primary",
    },
    {
      id: "repaired" as ColumnId,
      title: "Repaired",
      color: "border-green-500",
    },
    { id: "scrap" as ColumnId, title: "Scrap", color: "border-destructive" },
  ];

  return (
    <>
      {error && (
        <div className="mb-4 bg-destructive/10 border border-destructive/40 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      {statusMessage && (
        <div className="mb-4 bg-green-500/10 border border-green-500/40 text-green-600 rounded-lg p-3 text-sm">
          {statusMessage}
        </div>
      )}

      <div className="flex gap-3 sm:gap-4 md:gap-6 h-full overflow-x-auto pb-4 min-w-min md:min-w-full">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={board[column.id]}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            color={column.color}
          >
            {loading && board[column.id].length === 0 ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              board[column.id].map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleCardClick(task)}
                  className="cursor-pointer"
                >
                  <KanbanCard
                    task={task}
                    columnId={column.id}
                    onDragStart={handleDragStart}
                  />
                </div>
              ))
            )}
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
  );
}

const buildBoardFromRequests = (
  requests: MaintenanceRequestRecord[],
  equipmentMap: Map<number, EquipmentRecord>,
  userMap: Map<number, UserRecord>
): Board => {
  const nextBoard: Board = { ...emptyBoard };

  requests.forEach((request) => {
    const column = STATUS_TO_COLUMN[request.status_id] ?? "new";
    const task = mapRequestToTask(request, equipmentMap, userMap);
    nextBoard[column] = [...nextBoard[column], task];
  });

  return nextBoard;
};

const mapRequestToTask = (
  request: MaintenanceRequestRecord,
  equipmentMap: Map<number, EquipmentRecord>,
  userMap: Map<number, UserRecord>
): Task => {
  const equipmentName =
    equipmentMap.get(request.equipment_id)?.equipment_name ??
    `Equipment #${request.equipment_id}`;
  const assignee = request.assigned_to
    ? userMap.get(request.assigned_to)?.full_name ?? "Unassigned"
    : "Unassigned";
  const type = request.request_type_id === 2 ? "preventive" : "corrective";

  return {
    id: request.request_id.toString(),
    requestId: request.request_id,
    statusId: request.status_id,
    title: request.subject,
    description: request.description ?? "No description provided",
    equipment: equipmentName,
    type,
    priority: derivePriority(request),
    dueDate: request.scheduled_date ?? request.created_at,
    assignee,
    hoursEstimated: request.duration_hours ? Number(request.duration_hours) : 0,
    createdAt: request.created_at,
    updatedAt: request.completed_at ?? request.started_at ?? request.created_at,
  };
};

const derivePriority = (
  request: MaintenanceRequestRecord
): Task["priority"] => {
  if (request.status_id === 4) return "critical";
  if (request.request_type_id === 1 && request.status_id === 1) return "high";
  if (!request.scheduled_date) return "medium";
  return "low";
};

const moveTask = (
  board: Board,
  task: Task,
  fromColumn: ColumnId,
  toColumn: ColumnId,
  statusId: number
): Board => {
  const nextBoard: Board = { ...board };
  nextBoard[fromColumn] = nextBoard[fromColumn].filter(
    (item) => item.id !== task.id
  );
  nextBoard[toColumn] = [...nextBoard[toColumn], { ...task, statusId }];
  return nextBoard;
};

const getStoredUserId = (): number | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { user_id?: number };
    return typeof parsed.user_id === "number" ? parsed.user_id : null;
  } catch (error) {
    console.error("Unable to parse stored user", error);
    return null;
  }
};
