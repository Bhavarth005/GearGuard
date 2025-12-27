"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react";
import { Calendar, AlertCircle, Loader2 } from "lucide-react";
import {
  fetchEquipment,
  fetchUsers,
  fetchTeams,
  createMaintenanceRequest,
  type EquipmentRecord,
  type UserRecord,
  type MaintenanceTeamRecord,
} from "@/lib/api";
import { ApiError } from "@/lib/api-client";

export function MaintenanceRequestForm() {
  const [subject, setSubject] = useState("");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [type, setType] = useState<"preventive" | "corrective">("preventive");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [equipment, setEquipment] = useState<EquipmentRecord[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeamRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [equipmentData, usersData, teamsData] = await Promise.all([
          fetchEquipment(),
          fetchUsers(),
          fetchTeams(),
        ]);

        if (!active) return;

        setEquipment(equipmentData);
        setUsers(usersData);
        setTeams(teamsData);
        setError("");
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof ApiError ? err.message : "Unable to load equipment";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const technicianOptions = useMemo(
    () => users.filter((user) => user.role.toLowerCase() === "technician"),
    [users]
  );

  const selectedEquipment = useMemo(() => {
    const numericId = Number(selectedEquipmentId);
    if (Number.isNaN(numericId)) return undefined;
    return equipment.find((eq) => eq.equipment_id === numericId);
  }, [selectedEquipmentId, equipment]);

  const autoFillTeam = useMemo(() => {
    if (!selectedEquipment) return "—";
    return (
      teams.find(
        (team) => team.team_id === selectedEquipment.maintenance_team_id
      )?.team_name ?? "Unassigned"
    );
  }, [selectedEquipment, teams]);

  const autoFillTechnician = useMemo(() => {
    if (!selectedEquipment?.default_technician_id) return "—";
    return (
      users.find(
        (user) => user.user_id === selectedEquipment.default_technician_id
      )?.full_name ?? "Unassigned"
    );
  }, [selectedEquipment, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!subject.trim() || !selectedEquipmentId || !scheduledDate) {
      setError("Please complete all required fields");
      return;
    }

    const userId = getStoredUserId();
    if (!userId) {
      setError("Please sign in again to create requests");
      return;
    }

    setSubmitting(true);

    try {
      await createMaintenanceRequest({
        request_number: `REQ-${Date.now()}`,
        subject: subject.trim(),
        description: notes.trim() || subject.trim(),
        equipment_id: Number(selectedEquipmentId),
        request_type_id: type === "preventive" ? 2 : 1,
        requested_by: userId,
        scheduled_date: scheduledDate,
      });

      setSuccessMessage("Request created successfully");
      setSubject("");
      setSelectedEquipmentId("");
      setType("preventive");
      setScheduledDate("");
      setNotes("");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to create maintenance request";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Create Maintenance Request
        </h1>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-600">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing equipment...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Oil change and filter replacement"
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Equipment
              </label>
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select equipment...</option>
                {equipment.map((eq) => (
                  <option key={eq.equipment_id} value={eq.equipment_id}>
                    {eq.equipment_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedEquipment && (
              <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  Auto-filled from equipment record
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Assigned Team</p>
                    <p className="font-medium text-foreground">
                      {autoFillTeam}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Default Technician</p>
                    <p className="font-medium text-foreground">
                      {autoFillTechnician}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "preventive" | "corrective")
                  }
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Scheduled Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Technician (optional)
              </label>
              <select
                value={
                  selectedEquipment?.default_technician_id
                    ? String(selectedEquipment.default_technician_id)
                    : ""
                }
                onChange={() => {}}
                disabled
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
              >
                <option value="">
                  {technicianOptions.length === 0
                    ? "No technicians found"
                    : autoFillTechnician}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional details about the maintenance request..."
                rows={4}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Create Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const getStoredUserId = (): number | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { user_id?: number };
    return typeof parsed.user_id === "number" ? parsed.user_id : null;
  } catch {
    return null;
  }
};
