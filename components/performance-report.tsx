"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Filter } from "lucide-react"

const teamPerformanceData = [
  { name: "Mechanics", requests: 45, completed: 42, overdue: 3 },
  { name: "Electricians", requests: 28, completed: 27, overdue: 1 },
  { name: "IT Support", requests: 15, completed: 14, overdue: 1 },
  { name: "Hydraulics", requests: 22, completed: 20, overdue: 2 },
]

const equipmentIssuesData = [
  { name: "CNC Machine A", issues: 8, type: "Mechanical" },
  { name: "Hydraulic Press", issues: 12, type: "Mechanical" },
  { name: "Air Compressor", issues: 6, type: "Mechanical" },
  { name: "Server Rack 1", issues: 4, type: "IT" },
  { name: "Motor Unit 2", issues: 5, type: "Mechanical" },
]

const overdueTrackerData = [
  { id: "req-001", title: "Oil change - Pump A", dueDate: "2024-01-10", daysOverdue: 5, equipment: "Pump A" },
  { id: "req-002", title: "Belt inspection - Motor", dueDate: "2024-01-12", daysOverdue: 3, equipment: "Motor Unit 2" },
  { id: "req-003", title: "Filter replacement", dueDate: "2024-01-08", daysOverdue: 7, equipment: "Air Compressor" },
]

export function PerformanceReport() {
  const [filterType, setFilterType] = useState("all")

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Performance Reports</h1>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-input text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm md:text-base">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Performance by Team</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Legend />
              <Bar dataKey="completed" fill="var(--chart-1)" />
              <Bar dataKey="overdue" fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Equipment Issues Trend</h2>
          <div className="space-y-3">
            {equipmentIssuesData.map((item) => (
              <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm md:text-base">{item.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 md:w-24 h-2 bg-input rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(item.issues / 12) * 100}%` }} />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-foreground w-6 text-right">{item.issues}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Overdue Maintenance Tracker</h2>
        <div className="grid gap-3 overflow-x-auto">
          {overdueTrackerData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 md:p-4 bg-background border border-destructive/50 rounded-lg text-sm md:text-base"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{item.equipment}</p>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <p className="text-xs md:text-sm font-medium text-destructive">{item.daysOverdue} days overdue</p>
                <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
