"use client"

import { Search, User, Settings, Menu, LogOut } from "lucide-react"
import { useState } from "react"

interface DashboardHeaderProps {
  onMenuClick?: () => void
  onLoginClick?: () => void
  onLogout?: () => void
}

export function DashboardHeader({ onMenuClick, onLoginClick, onLogout }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white border-b border-border px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-xs gap-4">
      <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-muted/40 rounded-lg transition-colors">
        <Menu className="w-5 h-5 text-[#4b5563]" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] leading-tight truncate">Maintenance Board</h1>
        <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5 font-medium truncate">
          Track and manage equipment maintenance tasks efficiently
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-2 sm:p-2.5 hover:bg-muted/40 rounded-lg transition-colors flex-shrink-0"
          >
            <User className="w-4 sm:w-5 h-4 sm:h-5 text-[#4b5563] hover:text-primary" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-black border border-border rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  onLoginClick?.()
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-foreground hover:bg-muted/40 transition-colors flex items-center gap-2 border-b border-border"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  onLogout?.()
                }}
                className="w-full px-4 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
