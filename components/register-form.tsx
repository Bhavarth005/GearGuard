"use client"

import type React from "react"

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone, Building2 } from "lucide-react";
import Link from "next/link";
import {
  registerUser,
  fetchDepartments,
  login,
  type DepartmentRecord,
} from "@/lib/api";
import { ApiError } from "@/lib/api-client";

const ROLE_OPTIONS = ["Admin", "Manager", "Technician", "Employee"] as const;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    role: ROLE_OPTIONS[ROLE_OPTIONS.length - 1],
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    fetchDepartments()
      .then((data) => {
        if (active) {
          setDepartments(data);
        }
      })
      .catch((err) => {
        if (!active) return;
        const message =
          err instanceof ApiError ? err.message : "Unable to load departments";
        setError(message);
      })
      .finally(() => {
        if (active) {
          setLoadingDepartments(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.currentTarget;
    const checked =
      "checked" in e.currentTarget ? e.currentTarget.checked : false;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const persistSession = (
    token: string,
    user: { user_id: number; full_name: string; role: string }
  ) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!/^[0-9+()\-\s]{7,}$/.test(formData.phone.trim())) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!formData.departmentId) {
      setError("Please select a department");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.terms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();

      await registerUser({
        name: formData.name.trim(),
        email: normalizedEmail,
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        dept: Number(formData.departmentId),
        avatar: null,
      });

      const loginResponse = await login({
        email: normalizedEmail,
        password: formData.password,
      });
      persistSession(loginResponse.access_token, loginResponse.user);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Account Created Successfully!
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          Setting things up...
        </p>
        <p className="text-xs text-muted-foreground">
          Redirecting to your dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-foreground"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(+1) 555-0100"
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="departmentId"
            className="block text-sm font-medium text-foreground"
          >
            Department
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              disabled={loadingDepartments}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm sm:text-base disabled:opacity-70"
            >
              <option value="">
                {loadingDepartments
                  ? "Loading departments..."
                  : "Select a department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-foreground"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm sm:text-base"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-foreground"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border bg-input border cursor-pointer accent-primary mt-1"
        />
        <label
          htmlFor="terms"
          className="text-xs sm:text-sm text-muted-foreground cursor-pointer"
        >
          I agree to the{" "}
          <Link
            href="#"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Privacy Policy
          </Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || loadingDepartments}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 text-sm sm:text-base mt-6 min-h-10 sm:min-h-11"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
