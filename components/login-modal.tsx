"use client"

import { X } from "lucide-react"
import { LoginForm } from "./login-form"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogout?: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-card shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your GearGuard account
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
