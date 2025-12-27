"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { login } from "@/lib/api";
import { ApiError } from "@/lib/api-client";

const DEMO_CREDENTIALS = {
  email: "admin@gearguard.com",
  password: "Admin@123",
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const persistSession = (
    token: string,
    user: { user_id: number; full_name: string; role: string }
  ) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const performLogin = async (payload: { email: string; password: string }) => {
    setLoading(true);
    setError("");

    try {
      const response = await login(payload);
      persistSession(response.access_token, response.user);
      window.location.href = "/";
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Unable to sign in. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    await performLogin({ email: email.trim().toLowerCase(), password });
  };

  const handleDemoLogin = async () => {
    await performLogin(DEMO_CREDENTIALS);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-base"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:opacity-80 sm:text-sm"
          >
            Forgot?
          </Link>
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-border bg-input px-4 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Remember */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-border bg-input accent-primary"
        />
        <span className="text-sm text-muted-foreground">Remember me</span>
      </div>

      {/* Primary Action */}
      <button
        type="submit"
        disabled={loading}
        className="min-h-11 w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* Secondary Action */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className="min-h-11 w-full rounded-lg bg-secondary/15 px-4 py-2.5 text-sm font-semibold text-secondary transition-all hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
      >
        {loading ? "Loading Demo..." : "Try Demo"}
      </button>
    </form>
  );
}
