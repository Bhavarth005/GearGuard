"use client"

import { useState } from "react"
import { LogOut, ChevronDown } from "lucide-react"

interface ProfileDropdownProps {
  onLogout: () => void
}

export function ProfileDropdown({ onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string; designation: string } | null>(null)

  // Get user data from localStorage on mount
  useState(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  const [mounted, setMounted] = useState(false)
  if (!mounted) {
    const user = localStorage.getItem("user")
    if (user) {
      setUserData(JSON.parse(user))
      setMounted(true)
    }
  }

  const handleLogout = () => {
    setIsOpen(false)
    onLogout()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-muted/40 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
          {userData?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-lg z-50">
          {/* Profile Info Section */}
          <div className="px-4 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                {userData?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{userData?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{userData?.designation || "Technician"}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 truncate">{userData?.email || "user@example.com"}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
