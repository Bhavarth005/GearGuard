"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react";
import { TrendingUp, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import {
  fetchEquipment,
  fetchRequests,
  type EquipmentRecord,
  type MaintenanceRequestRecord,
} from "@/lib/api";
import { ApiError } from "@/lib/api-client";

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export function AnalyticsDashboard() {
  const [equipment, setEquipment] = useState<EquipmentRecord[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequestRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAnalytics = async () => {
      try {
        const [equipmentData, requestData] = await Promise.all([
          fetchEquipment(),
          fetchRequests(),
        ]);
        if (!active) return;
        setEquipment(equipmentData);
        setRequests(requestData);
        setError("");
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof ApiError ? err.message : "Unable to load analytics";
        setError(message);
      }
    };

    loadAnalytics();
    return () => {
      active = false;
    };
  }, []);

  const stats: StatCard[] = useMemo(() => {
    const activeTasks = requests.filter(
      (req) => req.status_id === 1 || req.status_id === 2
    ).length;
    const completedTasks = requests.filter((req) => req.status_id === 3).length;
    const totalTasks = requests.length || 1;
    const onTimeRate = completedTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;
    const warningEquipment = equipment.filter((item) =>
      isEquipmentWarning(item)
    ).length;

    return [
      {
        title: "Active Tasks",
        value: activeTasks,
        change: `${completedTasks} completed`,
        icon: <Clock className="w-8 h-8" />,
        color: "text-orange-400",
      },
      {
        title: "Equipment Warnings",
        value: warningEquipment,
        change: `${equipment.length} total assets`,
        icon: <AlertTriangle className="w-8 h-8" />,
        color: "text-red-400",
      },
      {
        title: "Completed Tasks",
        value: completedTasks,
        change: `${totalTasks - completedTasks} pending`,
        icon: <CheckCircle className="w-8 h-8" />,
        color: "text-green-400",
      },
      {
        title: "On-Time Rate",
        value: `${onTimeRate}%`,
        change: `${totalTasks} total requests`,
        icon: <TrendingUp className="w-8 h-8" />,
        color: "text-blue-400",
      },
    ];
  }, [equipment, requests]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Maintenance system overview and analytics
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Maintenance Trend
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Preventive</span>
                <span className="text-sm font-medium text-foreground">65%</span>
              </div>
              <div className="w-full bg-input rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Corrective</span>
                <span className="text-sm font-medium text-foreground">25%</span>
              </div>
              <div className="w-full bg-input rounded-full h-2">
                <div
                  className="bg-accent rounded-full h-2"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground">Emergency</span>
                <span className="text-sm font-medium text-foreground">10%</span>
              </div>
              <div className="w-full bg-input rounded-full h-2">
                <div
                  className="bg-red-500 rounded-full h-2"
                  style={{ width: "10%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Top Equipment by Issues
          </h3>
          <div className="space-y-3">
            {[
              { name: "Motor Unit 2", issues: 8 },
              { name: "Air Compressor", issues: 6 },
              { name: "Pump A", issues: 4 },
              { name: "Belt Conveyor", issues: 2 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="text-sm font-medium bg-input px-3 py-1 rounded text-foreground">
                  {item.issues}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              action: "Motor bearing inspection started",
              time: "2 hours ago",
              type: "in-progress",
            },
            {
              action: "Hydraulic fluid flush completed",
              time: "4 hours ago",
              type: "completed",
            },
            {
              action: "Pump A oil change scheduled",
              time: "1 day ago",
              type: "scheduled",
            },
            {
              action: "Air compressor filter replacement",
              time: "2 days ago",
              type: "completed",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 pb-4 border-b border-border last:border-b-0"
            >
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
  );
}

const isEquipmentWarning = (equipment: EquipmentRecord) => {
  if (equipment.is_scrapped) return true;
  if (!equipment.warranty_end_date) return false;
  const expiry = new Date(equipment.warranty_end_date);
  const daysLeft = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysLeft < 30;
};
