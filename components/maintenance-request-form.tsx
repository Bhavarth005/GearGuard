"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Calendar, AlertCircle } from "lucide-react"

interface Equipment {
  id: string
  name: string
  assignedTeam: string
  assignedTechnician: string
}

const mockEquipment: Equipment[] = [
  {
    id: "eq-001",
    name: "CNC Machine A",
    assignedTeam: "Mechanics",
    assignedTechnician: "John Smith",
  },
  {
    id: "eq-002",
    name: "Hydraulic Press B",
    assignedTeam: "Mechanics",
    assignedTechnician: "Sarah Lee",
  },
  {
    id: "eq-003",
    name: "Server Rack 1",
    assignedTeam: "IT Support",
    assignedTechnician: "Mike Johnson",
  },
]

const mockTechnicians = ["John Smith", "Sarah Lee", "Mike Johnson", "Emily Davis", "Robert Wilson"]

export function MaintenanceRequestForm() {
  const [subject, setSubject] = useState("")
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("")
  const [type, setType] = useState<"preventive" | "corrective">("preventive")
  const [scheduledDate, setScheduledDate] = useState("")
  const [technician, setTechnician] = useState("")
  const [notes, setNotes] = useState("")

  const selectedEquipment = useMemo(() => {
    return mockEquipment.find((eq) => eq.id === selectedEquipmentId)
  }, [selectedEquipmentId])

  const autoFillTeam = useMemo(() => {
    return selectedEquipment?.assignedTeam || ""
  }, [selectedEquipment])

  const autoFillTechnician = useMemo(() => {
    return selectedEquipment?.assignedTechnician || ""
  }, [selectedEquipment])

  // Update technician when equipment changes
  const handleEquipmentChange = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId)
    const equipment = mockEquipment.find((eq) => eq.id === equipmentId)
    if (equipment) {
      setTechnician(equipment.assignedTechnician)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Maintenance request submitted:", {
      subject,
      equipment: selectedEquipmentId,
      type,
      scheduledDate,
      technician,
      notes,
    })
    // Reset form
    setSubject("")
    setSelectedEquipmentId("")
    setType("preventive")
    setScheduledDate("")
    setTechnician("")
    setNotes("")
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Create Maintenance Request</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Oil change and filter replacement"
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Equipment</label>
            <select
              value={selectedEquipmentId}
              onChange={(e) => handleEquipmentChange(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select equipment...</option>
              {mockEquipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>

          {selectedEquipment && (
            <div className="bg-background border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Auto-filled from equipment record
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Assigned Team</p>
                  <p className="font-medium text-foreground">{autoFillTeam}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Default Technician</p>
                  <p className="font-medium text-foreground">{autoFillTechnician}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "preventive" | "corrective")}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="preventive">Preventive</option>
                <option value="corrective">Corrective</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Scheduled Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Assigned Technician</label>
            <select
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select technician...</option>
              {mockTechnicians.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details about the maintenance request..."
              rows={4}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
