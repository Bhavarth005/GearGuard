"use client"

import { useState } from "react"
import { ArrowLeft, Edit2, AlertTriangle, X } from "lucide-react"

interface MaintenanceRecord {
  id: string
  date: string
  type: "preventive" | "corrective" | "emergency"
  description: string
  technician: string
  hoursSpent: number
}

const mockMaintenanceHistory: MaintenanceRecord[] = [
  {
    id: "m1",
    date: "2024-01-10",
    type: "preventive",
    description: "Oil change and filter replacement",
    technician: "John Smith",
    hoursSpent: 2,
  },
  {
    id: "m2",
    date: "2023-12-15",
    type: "corrective",
    description: "Replaced worn bearing",
    technician: "Sarah Lee",
    hoursSpent: 4,
  },
]

interface EquipmentDetailProps {
  equipmentId: string
  onBack: () => void
}

export function EquipmentDetail({ equipmentId, onBack }: EquipmentDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEquipment, setEditedEquipment] = useState({
    id: equipmentId,
    name: "CNC Machine A",
    serialNumber: "CNC-2024-001",
    purchaseDate: "2023-06-15",
    warrantyExpiration: "2025-06-15",
    location: "Building A, Floor 2",
    department: "Manufacturing",
    assignedTeam: "Mechanics",
    status: "operational" as const,
    hoursOfOperation: 2450,
    nextMaintenanceDate: "2024-02-15",
    lastMaintenanceDate: "2024-01-10",
  })

  const equipment = editedEquipment

  const handleSaveChanges = () => {
    setIsEditing(false)
  }

  const handleEditChange = (field: string, value: any) => {
    setEditedEquipment({ ...editedEquipment, [field]: value })
  }

  return (
    <div className="max-w-4xl space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Equipment</span>
      </button>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedEquipment.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="text-3xl font-bold text-foreground bg-input border border-border rounded px-2 py-1 mb-2"
              />
            ) : (
              <h1 className="text-3xl font-bold text-foreground">{equipment.name}</h1>
            )}
            <p className="text-muted-foreground mt-1">S/N: {equipment.serialNumber}</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedEquipment(equipment)
                  }}
                  className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-input transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-border">
          {isEditing ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
                <input
                  type="date"
                  value={editedEquipment.purchaseDate}
                  onChange={(e) => handleEditChange("purchaseDate", e.target.value)}
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warranty Expiration</p>
                <input
                  type="date"
                  value={editedEquipment.warrantyExpiration}
                  onChange={(e) => handleEditChange("warrantyExpiration", e.target.value)}
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Physical Location</p>
                <input
                  type="text"
                  value={editedEquipment.location}
                  onChange={(e) => handleEditChange("location", e.target.value)}
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Department</p>
                <input
                  type="text"
                  value={editedEquipment.department}
                  onChange={(e) => handleEditChange("department", e.target.value)}
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assigned Team</p>
                <input
                  type="text"
                  value={editedEquipment.assignedTeam}
                  onChange={(e) => handleEditChange("assignedTeam", e.target.value)}
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hours of Operation</p>
                <input
                  type="number"
                  value={editedEquipment.hoursOfOperation}
                  onChange={(e) => handleEditChange("hoursOfOperation", Number.parseInt(e.target.value) || 0)}
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
                <p className="font-medium text-foreground">{equipment.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warranty Expiration</p>
                <p className="font-medium text-foreground">{equipment.warrantyExpiration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Physical Location</p>
                <p className="font-medium text-foreground">{equipment.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Department</p>
                <p className="font-medium text-foreground">{equipment.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assigned Team</p>
                <p className="font-medium text-foreground">{equipment.assignedTeam}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hours of Operation</p>
                <p className="font-medium text-foreground">{equipment.hoursOfOperation.toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Maintenance History</h2>
          <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">View All</button>
        </div>

        <div className="space-y-3">
          {mockMaintenanceHistory.map((record) => (
            <div key={record.id} className="flex items-start gap-4 p-3 bg-background rounded-lg">
              <div className="pt-1">
                {record.type === "emergency" ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : record.type === "corrective" ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{record.description}</p>
                <p className="text-sm text-muted-foreground">
                  {record.date} • {record.technician} • {record.hoursSpent}h
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground capitalize">
                  {record.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
