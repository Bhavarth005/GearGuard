"use client"

import type React from "react"
import { useState } from "react"
import { Users, Plus, Edit2, Trash2, X } from "lucide-react"

interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  members: string[]
}

const mockTeams: Team[] = [
  {
    id: "t1",
    name: "Mechanics",
    description: "Handles mechanical equipment maintenance",
    memberCount: 5,
    members: ["John Smith", "Sarah Lee", "Robert Wilson"],
  },
  {
    id: "t2",
    name: "Electricians",
    description: "Handles electrical and control systems",
    memberCount: 3,
    members: ["Emily Davis", "Michael Brown"],
  },
  {
    id: "t3",
    name: "IT Support",
    description: "Handles IT infrastructure maintenance",
    memberCount: 2,
    members: ["Mike Johnson", "Lisa Anderson"],
  },
]

export function TeamsList() {
  const [teams, setTeams] = useState(mockTeams)
  const [showForm, setShowForm] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDesc, setNewTeamDesc] = useState("")
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [newMemberName, setNewMemberName] = useState("")

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTeamName.trim()) {
      const newTeam: Team = {
        id: `t${teams.length + 1}`,
        name: newTeamName,
        description: newTeamDesc,
        memberCount: 0,
        members: [],
      }
      setTeams([...teams, newTeam])
      setNewTeamName("")
      setNewTeamDesc("")
      setShowForm(false)
    }
  }

  const handleAddMember = (teamId: string) => {
    if (newMemberName.trim()) {
      setTeams(
        teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                members: [...team.members, newMemberName],
                memberCount: team.memberCount + 1,
              }
            : team,
        ),
      )
      setNewMemberName("")
    }
  }

  const handleRemoveMember = (teamId: string, memberName: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.filter((m) => m !== memberName),
              memberCount: team.memberCount - 1,
            }
          : team,
      ),
    )
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Maintenance Teams</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Team</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <form onSubmit={handleAddTeam} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Team Name</label>
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
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
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
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                Create Team
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
        {teams.map((team) => (
          <div key={team.id} className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground break-words">{team.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{team.description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditingTeamId(editingTeamId === team.id ? null : team.id)}
                  className="p-2 hover:bg-input rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="p-2 hover:bg-input rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">{team.memberCount} team members</p>

              {editingTeamId === team.id && (
                <div className="bg-background rounded-lg p-3 sm:p-4 mb-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Enter member name"
                      className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button
                      onClick={() => handleAddMember(team.id)}
                      className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm whitespace-nowrap w-full sm:w-auto"
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {team.members.map((member) => (
                  <div
                    key={member}
                    className="px-3 py-1 bg-background text-foreground rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 group"
                  >
                    <span>{member}</span>
                    {editingTeamId === team.id && (
                      <button
                        onClick={() => handleRemoveMember(team.id, member)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
