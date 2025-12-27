"use client"

import { Search, Filter, Plus, AlertCircle, Check, Clock } from "lucide-react"
import { useState } from "react"

interface Equipment {
  id: string
  name: string
  type: string
  location: string
  serialNumber: string
  status: "operational" | "maintenance" | "warning"
  lastMaintenance: string
  nextMaintenance: string
  hoursOfOperation: number
}

const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "Pump A",
    type: "Centrifugal Pump",
    location: "Building A - Line 1",
    serialNumber: "P-2024-001",
    status: "operational",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-02-05",
    hoursOfOperation: 1250,
  },
  {
    id: "2",
    name: "Motor Unit 2",
    type: "3-Phase Motor",
    location: "Building B - Floor 2",
    serialNumber: "M-2024-002",
    status: "warning",
    lastMaintenance: "2023-12-15",
    nextMaintenance: "2024-01-15",
    hoursOfOperation: 3850,
  },
  {
    id: "3",
    name: "Air Compressor",
    type: "Rotary Screw Compressor",
    location: "Building A - Utility",
    serialNumber: "C-2024-003",
    status: "maintenance",
    lastMaintenance: "2024-01-01",
    nextMaintenance: "2024-01-31",
    hoursOfOperation: 2100,
  },
  {
    id: "4",
    name: "Hydraulic Press",
    type: "Hydraulic Press",
    location: "Building C - Workshop",
    serialNumber: "HP-2024-004",
    status: "operational",
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-02-08",
    hoursOfOperation: 890,
  },
  {
    id: "5",
    name: "Belt Conveyor",
    type: "Industrial Conveyor",
    location: "Building A - Line 2",
    serialNumber: "BC-2024-005",
    status: "operational",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    hoursOfOperation: 5200,
  },
]

export function EquipmentInventory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredEquipment = mockEquipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || eq.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <Check className="w-5 h-5 text-green-400" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case "maintenance":
        return <Clock className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      operational: "bg-green-900/30 text-green-300 border-green-700",
      warning: "bg-yellow-900/30 text-yellow-300 border-yellow-700",
      maintenance: "bg-red-900/30 text-red-300 border-red-700",
    }
    return styles[status as keyof typeof styles] || ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Equipment Inventory</h2>
          <p className="text-muted-foreground mt-1">Manage and track all equipment assets</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or serial number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4 py-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-foreground text-sm focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="warning">Warning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-input">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Equipment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hours</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Next Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((equipment) => (
                <tr key={equipment.id} className="border-b border-border hover:bg-input/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{equipment.name}</p>
                      <p className="text-sm text-muted-foreground">{equipment.serialNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{equipment.type}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{equipment.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(equipment.status)}
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded border ${getStatusBadge(equipment.status)}`}
                      >
                        {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{equipment.hoursOfOperation}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(equipment.nextMaintenance).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
