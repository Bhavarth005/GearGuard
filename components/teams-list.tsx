"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react";
import { Users, Plus } from "lucide-react";
import { fetchTeams, createTeam, type MaintenanceTeamRecord } from "@/lib/api";
import { ApiError } from "@/lib/api-client";

export function TeamsList() {
  const [teams, setTeams] = useState<MaintenanceTeamRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTeams();
      setTeams(data);
      setError("");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to load teams";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    setError("");
    setSuccessMessage("");

    try {
      await createTeam({
        team_name: newTeamName.trim(),
        description: newTeamDesc.trim(),
      });
      setSuccessMessage("Team created");
      setNewTeamName("");
      setNewTeamDesc("");
      setShowForm(false);
      await loadTeams();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to create team";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Maintenance Teams
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Team</span>
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/40 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/40 text-green-600 rounded-lg p-3 text-sm">
          {successMessage}
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <form onSubmit={handleAddTeam} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g., Mechanics"
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={newTeamDesc}
                onChange={(e) => setNewTeamDesc(e.target.value)}
                placeholder="Team responsibilities and focus..."
                rows={2}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base w-full sm:w-auto disabled:opacity-70"
              >
                {creating ? "Creating..." : "Create Team"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-input text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4">
        {loading ? (
          <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
            Loading teams...
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.team_id}
              className="bg-card border border-border rounded-lg p-4 sm:p-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground break-words">
                    {team.team_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {team.description || "No description provided"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Team ID: {team.team_id}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                Member management will be available once user assignments sync
                with the API.
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
