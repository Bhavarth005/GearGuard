"use client"

import type React from "react"

import { TrendingUp, AlertTriangle, Clock, CheckCircle } from "lucide-react"

interface StatCard {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  color: string
}

export function AnalyticsDashboard() {
  const stats: StatCard[] = [
    {
      title: "Active Tasks",
      value: "12",
      change: "+3 this week",
      icon: <Clock className="w-8 h-8" />,
      color: "text-orange-400",
    },
    {
      title: "Equipment Warnings",
      value: "3",
      change: "1 critical",
      icon: <AlertTriangle className="w-8 h-8" />,
      color: "text-red-400",
    },
    {
      title: "Completed Tasks",
      value: "48",
      change: "+8 this month",
      icon: <CheckCircle className="w-8 h-8" />,
      color: "text-green-400",
    },
    {
      title: "On-Time Rate",
      value: "94%",
      change: "+2% from last month",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "text-blue-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Maintenance system overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Maintenance Trend</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Preventive</span>
                <span className="text-sm font-medium text-foreground">65%</span>
              </div>
              <div className="w-full bg-input rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Corrective</span>
                <span className="text-sm font-medium text-foreground">25%</span>
              </div>
              <div className="w-full bg-input rounded-full h-2">
                <div className="bg-accent rounded-full h-2" style={{ width: "25%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Emergency</span>
                <span className="text-sm font-medium text-foreground">10%</span>
              </div>
              <div className="w-full bg-input rounded-full h-2">
                <div className="bg-red-500 rounded-full h-2" style={{ width: "10%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Equipment by Issues</h3>
          <div className="space-y-3">
            {[
              { name: "Motor Unit 2", issues: 8 },
              { name: "Air Compressor", issues: 6 },
              { name: "Pump A", issues: 4 },
              { name: "Belt Conveyor", issues: 2 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="text-sm font-medium bg-input px-3 py-1 rounded text-foreground">{item.issues}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: "Motor bearing inspection started", time: "2 hours ago", type: "in-progress" },
            { action: "Hydraulic fluid flush completed", time: "4 hours ago", type: "completed" },
            { action: "Pump A oil change scheduled", time: "1 day ago", type: "scheduled" },
            { action: "Air compressor filter replacement", time: "2 days ago", type: "completed" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 pb-4 border-b border-border last:border-b-0">
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === "completed"
                    ? "bg-green-400"
                    : activity.type === "in-progress"
                      ? "bg-blue-400"
                      : "bg-muted-foreground"
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
