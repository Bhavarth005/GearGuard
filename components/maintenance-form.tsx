"use client"

import type React from "react"
import { useState } from "react"

interface MaintenanceFormData {
  title: string
  description: string
  equipment: string
  type: "preventive" | "corrective" | "emergency"
  priority: "low" | "medium" | "high" | "critical"
  assignee: string
  dueDate: string
  estimatedHours: number
  notes: string
}

interface MaintenanceFormProps {
  onSubmit?: (data: MaintenanceFormData) => void
  onCancel?: () => void
}

export function MaintenanceForm({ onSubmit, onCancel }: MaintenanceFormProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    title: "",
    description: "",
    equipment: "",
    type: "preventive",
    priority: "medium",
    assignee: "",
    dueDate: "",
    estimatedHours: 1,
    notes: "",
  })


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estimatedHours" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-5"
    >
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
        Create Maintenance Task
      </h3>

      {/* Title + Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Task Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Oil change – Pump A"
            className="w-full min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Equipment *</label>
          <select
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            required
            className="w-full min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">Select equipment</option>
            <option>Pump A</option>
            <option>Motor Unit 2</option>
            <option>Air Compressor</option>
            <option>Hydraulic Press</option>
            <option>Belt Conveyor</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:border-primary focus:outline-none md:rows-3"
        />
      </div>

      {/* Type + Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm"
          >
            <option value="preventive">Preventive</option>
            <option value="corrective">Corrective</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Assignee + Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Assignee</label>
          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm"
          >
            <option value="">Select assignee</option>
            <option>John Smith</option>
            <option>Sarah Lee</option>
            <option>Mike Johnson</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm"
          />
        </div>
      </div>

      {/* Estimated Hours */}
      <div>
        <label className="block text-sm font-medium mb-1">Estimated Hours</label>
        <input
          type="number"
          name="estimatedHours"
          value={formData.estimatedHours}
          onChange={handleChange}
          step="0.5"
          min="0.5"
          className="w-full min-h-[44px] rounded-lg border border-border bg-input px-3 text-sm"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Additional Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm md:rows-3"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto flex-1 min-h-[44px] rounded-lg border border-border bg-input text-sm font-medium hover:bg-input/80"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto flex-1 min-h-[44px] rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Create Task
        </button>
      </div>
    </form>
  )
}
