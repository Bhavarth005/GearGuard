"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { MaintenanceKanban } from "@/components/maintenance-kanban"
import { EquipmentDashboard } from "@/components/equipment-dashboard"
import { EquipmentDetail } from "@/components/equipment-detail"
import { MaintenanceRequestForm } from "@/components/maintenance-request-form"
import { PreventiveMaintenanceCalendar } from "@/components/preventive-maintenance-calendar"
import { TeamsList } from "@/components/teams-list"
import { PerformanceReport } from "@/components/performance-report"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { LoginModal } from "@/components/login-modal"

export default function Page() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "kanban" | "equipment" | "equipment-detail" | "maintenance-form" | "calendar" | "teams" | "reports"
  >("kanban")
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      window.location.href = "/login"
    } else {
      setIsAuthenticated(true)
      setLoading(false)
    }
  }, [])

  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipmentId(id)
    setCurrentView("equipment-detail")
  }

  const handleBackToEquipment = () => {
    setCurrentView("equipment")
    setSelectedEquipmentId(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GG</span>
            </div>
          </div>
          <p className="text-foreground font-medium">Loading GearGuard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view)
          setSidebarOpen(false)
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onLoginClick={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          {currentView === "kanban" && <MaintenanceKanban />}
          {currentView === "dashboard" && <AnalyticsDashboard />}
          {currentView === "equipment" && <EquipmentDashboard onSelectEquipment={handleEquipmentSelect} />}
          {currentView === "equipment-detail" && selectedEquipmentId && (
            <EquipmentDetail equipmentId={selectedEquipmentId} onBack={handleBackToEquipment} />
          )}
          {currentView === "maintenance-form" && <MaintenanceRequestForm />}
          {currentView === "calendar" && <PreventiveMaintenanceCalendar />}
          {currentView === "teams" && <TeamsList />}
          {currentView === "reports" && <PerformanceReport />}
        </div>
      </main>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} onLogout={handleLogout} />
    </div>
  )
}
