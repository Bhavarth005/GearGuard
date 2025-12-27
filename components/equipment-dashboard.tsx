"use client"

import { useState, useMemo } from "react"
import { Search, Filter, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react"
import { AddEquipmentModal } from "./add-equipment-modal"

interface Equipment {
  id: string
  name: string
  serialNumber: string
  department: string
  status: "operational" | "warning" | "maintenance"
  hoursOfOperation: number
  nextMaintenanceDate: string
  lastMaintenanceDate: string
  assignedTeam: string
  location: string
}

const initialMockEquipment: Equipment[] = [
  {
    id: "eq-001",
    name: "CNC Machine A",
    serialNumber: "CNC-2024-001",
    department: "Manufacturing",
    status: "operational",
    hoursOfOperation: 2450,
    nextMaintenanceDate: "2024-02-15",
    lastMaintenanceDate: "2024-01-10",
    assignedTeam: "Mechanics",
    location: "Building A, Floor 2",
  },
  {
    id: "eq-002",
    name: "Hydraulic Press B",
    serialNumber: "HYD-2024-002",
    department: "Manufacturing",
    status: "warning",
    hoursOfOperation: 3120,
    nextMaintenanceDate: "2024-01-20",
    lastMaintenanceDate: "2023-12-01",
    assignedTeam: "Mechanics",
    location: "Building A, Floor 1",
  },
  {
    id: "eq-003",
    name: "Air Compressor C",
    serialNumber: "AIR-2024-003",
    department: "Manufacturing",
    status: "maintenance",
    hoursOfOperation: 4560,
    nextMaintenanceDate: "2024-01-18",
    lastMaintenanceDate: "2023-11-15",
    assignedTeam: "Mechanics",
    location: "Building B, Floor 1",
  },
  {
    id: "eq-004",
    name: "Server Rack 1",
    serialNumber: "SRV-2024-004",
    department: "IT",
    status: "operational",
    hoursOfOperation: 8760,
    nextMaintenanceDate: "2024-03-01",
    lastMaintenanceDate: "2024-01-05",
    assignedTeam: "IT Support",
    location: "Building C, Server Room",
  },
]

interface EquipmentDashboardProps {
  onSelectEquipment: (id: string) => void
}

export function EquipmentDashboard({ onSelectEquipment }: EquipmentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [equipment, setEquipment] = useState(initialMockEquipment)
  const [showAddModal, setShowAddModal] = useState(false)

  const departments = useMemo(() => {
    return ["all", ...new Set(equipment.map((e) => e.department))]
  }, [equipment])

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch =
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = departmentFilter === "all" || eq.department === departmentFilter
      return matchesSearch && matchesDept
    })
  }, [searchTerm, departmentFilter, equipment])

  const handleAddEquipment = (newEquip: any) => {
    const newEquipment: Equipment = {
      id: `eq-${Date.now()}`,
      name: newEquip.name,
      serialNumber: newEquip.serialNumber,
      department: newEquip.department,
      status: "operational",
      hoursOfOperation: 0,
      nextMaintenanceDate: newEquip.warrantyExpiration || new Date().toISOString().split("T")[0],
      lastMaintenanceDate: newEquip.purchaseDate || new Date().toISOString().split("T")[0],
      assignedTeam: newEquip.assignedTeam,
      location: newEquip.location,
    }
    setEquipment([...equipment, newEquipment])
    setShowAddModal(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "maintenance":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 flex items-center gap-2 bg-input rounded-lg px-3 sm:px-4 py-2 border border-border">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-input text-foreground px-3 sm:px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#714B67] to-[#017E84] text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Equipment</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                departmentFilter === dept
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-input"
              }`}
            >
              {dept === "all" ? "All" : dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1">
        {filteredEquipment.map((equipment) => (
          <div
            key={equipment.id}
            onClick={() => onSelectEquipment(equipment.id)}
            className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:border-primary/50 cursor-pointer transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(equipment.status)}
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{equipment.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 truncate">S/N: {equipment.serialNumber}</p>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Department</p>
                    <p className="font-medium text-foreground truncate">{equipment.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Team</p>
                    <p className="font-medium text-foreground truncate">{equipment.assignedTeam}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Hours Op.</p>
                    <p className="font-medium text-foreground">{equipment.hoursOfOperation.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Next Maint.</p>
                    <p className="font-medium text-foreground whitespace-nowrap">{equipment.nextMaintenanceDate}</p>
                  </div>
                </div>
              </div>

              <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0 w-full sm:w-auto">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddEquipmentModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddEquipment} />
    </div>
  )
}
