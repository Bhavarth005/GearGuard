"use client"

import { useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      window.location.href = "/"
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-background flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl overflow-hidden border border-border">
          {/* Header gradient */}
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />

          {/* Logo & title */}
          <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">GG</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              GearGuard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Equipment Maintenance Management
            </p>
          </div>

          {/* Form */}
          <div className="px-6 sm:px-8 pb-8 sm:pb-10">
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="py-3 sm:px-8 pb-6 sm:pb-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:opacity-80"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">
            Need help? Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
