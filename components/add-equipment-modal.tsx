"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

interface NewEquipment {
  name: string
  serialNumber: string
  department: string
  location: string
  assignedTeam: string
  purchaseDate: string
  warrantyExpiration: string
}

interface AddEquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (equipment: NewEquipment) => void
}

/* -------------------------------------------------------------------------- */
/*                               Helper Inputs                                */
/* -------------------------------------------------------------------------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Modal Component                               */
/* -------------------------------------------------------------------------- */

export function AddEquipmentModal({
  isOpen,
  onClose,
  onAdd,
}: AddEquipmentModalProps) {
  const [formData, setFormData] = useState<NewEquipment>({
    name: "",
    serialNumber: "",
    department: "Manufacturing",
    location: "",
    assignedTeam: "Mechanics",
    purchaseDate: "",
    warrantyExpiration: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.serialNumber) return
    onAdd(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Add New Equipment
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Equipment Name *"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />

            <Input
              label="Serial Number *"
              value={formData.serialNumber}
              onChange={(v) => setFormData({ ...formData, serialNumber: v })}
            />

            <Select
              label="Department"
              value={formData.department}
              onChange={(v) => setFormData({ ...formData, department: v })}
              options={["Manufacturing", "IT", "Maintenance", "Operations"]}
            />

            <Select
              label="Assigned Team"
              value={formData.assignedTeam}
              onChange={(v) =>
                setFormData({ ...formData, assignedTeam: v })
              }
              options={[
                "Mechanics",
                "Electricians",
                "IT Support",
                "Technicians",
              ]}
            />

            <Input
              label="Location *"
              className="sm:col-span-2"
              value={formData.location}
              onChange={(v) => setFormData({ ...formData, location: v })}
            />

            <Input
              type="date"
              label="Purchase Date"
              value={formData.purchaseDate}
              onChange={(v) =>
                setFormData({ ...formData, purchaseDate: v })
              }
            />

            <Input
              type="date"
              label="Warranty Expiration"
              value={formData.warrantyExpiration}
              onChange={(v) =>
                setFormData({ ...formData, warrantyExpiration: v })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-lg bg-input px-6 py-2 text-sm font-medium text-foreground hover:bg-input/80 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
