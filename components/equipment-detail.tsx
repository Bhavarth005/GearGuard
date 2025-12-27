"use client"

import { useEffect, useState } from "react";
import { ArrowLeft, Edit2, AlertTriangle, X } from "lucide-react";
import {
  fetchEquipmentById,
  fetchDepartments,
  fetchTeams,
  fetchRequests,
  fetchUsers,
  type DepartmentRecord,
  type MaintenanceTeamRecord,
  type MaintenanceRequestRecord,
  type UserRecord,
  type EquipmentRecord,
} from "@/lib/api";
import { ApiError } from "@/lib/api-client";

interface MaintenanceRecord {
  id: string;
  date: string;
  type: "preventive" | "corrective" | "emergency";
  description: string;
  technician: string;
  hoursSpent: number;
}

interface EquipmentDetailProps {
  equipmentId: string;
  onBack: () => void;
}

interface EquipmentViewModel {
  id: number;
  name: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiration: string;
  location: string;
  department: string;
  assignedTeam: string;
  status: "operational" | "warning" | "maintenance";
  hoursOfOperation: number;
  nextMaintenanceDate: string;
  lastMaintenanceDate: string;
}

export function EquipmentDetail({ equipmentId, onBack }: EquipmentDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [equipment, setEquipment] = useState<EquipmentViewModel | null>(null);
  const [editedEquipment, setEditedEquipment] =
    useState<EquipmentViewModel | null>(null);
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      try {
        setLoading(true);
        const numericId = Number(equipmentId);
        if (Number.isNaN(numericId)) {
          setError("Invalid equipment reference");
          return;
        }
        const [record, departments, teams, requests, users] = await Promise.all(
          [
            fetchEquipmentById(numericId),
            fetchDepartments(),
            fetchTeams(),
            fetchRequests(),
            fetchUsers(),
          ]
        );

        if (!active) return;
        if (!record) {
          setError("Equipment not found");
          return;
        }

        const departmentMap = new Map<number, DepartmentRecord>(
          departments.map((dept) => [dept.department_id, dept])
        );
        const teamMap = new Map<number, MaintenanceTeamRecord>(
          teams.map((team) => [team.team_id, team])
        );
        const userMap = new Map<number, UserRecord>(
          users.map((user) => [user.user_id, user])
        );

        const viewModel = buildViewModel(record, departmentMap, teamMap);
        const maintenanceHistory = buildMaintenanceHistory(
          requests.filter((req) => req.equipment_id === record.equipment_id),
          userMap
        );

        setEquipment(viewModel);
        setEditedEquipment(viewModel);
        setHistory(maintenanceHistory);
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

    loadDetails();
    return () => {
      active = false;
    };
  }, [equipmentId]);

  const handleSaveChanges = () => {
    setIsEditing(false);
  };

  const handleEditChange = (
    field: keyof EquipmentViewModel,
    value: string | number
  ) => {
    setEditedEquipment((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">
          Loading equipment details...
        </p>
      </div>
    );
  }

  if (error || !equipment || !editedEquipment) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Equipment
        </button>
        <div className="bg-destructive/10 border border-destructive/40 text-destructive rounded-lg p-6">
          {error || "Equipment not available"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Equipment</span>
      </button>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedEquipment.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="text-3xl font-bold text-foreground bg-input border border-border rounded px-2 py-1 mb-2"
              />
            ) : (
              <h1 className="text-3xl font-bold text-foreground">
                {editedEquipment.name}
              </h1>
            )}
            <p className="text-muted-foreground mt-1">
              S/N: {editedEquipment.serialNumber}
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedEquipment(equipment);
                  }}
                  className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-input transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-border">
          {isEditing ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Purchase Date
                </p>
                <input
                  type="date"
                  value={editedEquipment.purchaseDate}
                  onChange={(e) =>
                    handleEditChange("purchaseDate", e.target.value)
                  }
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Warranty Expiration
                </p>
                <input
                  type="date"
                  value={editedEquipment.warrantyExpiration}
                  onChange={(e) =>
                    handleEditChange("warrantyExpiration", e.target.value)
                  }
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Physical Location
                </p>
                <input
                  type="text"
                  value={editedEquipment.location}
                  onChange={(e) => handleEditChange("location", e.target.value)}
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Department</p>
                <input
                  type="text"
                  value={editedEquipment.department}
                  onChange={(e) =>
                    handleEditChange("department", e.target.value)
                  }
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Assigned Team
                </p>
                <input
                  type="text"
                  value={editedEquipment.assignedTeam}
                  onChange={(e) =>
                    handleEditChange("assignedTeam", e.target.value)
                  }
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Hours of Operation
                </p>
                <input
                  type="number"
                  value={editedEquipment.hoursOfOperation}
                  onChange={(e) =>
                    handleEditChange(
                      "hoursOfOperation",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full font-medium text-foreground bg-input border border-border rounded px-2 py-1"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Purchase Date
                </p>
                <p className="font-medium text-foreground">
                  {editedEquipment.purchaseDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Warranty Expiration
                </p>
                <p className="font-medium text-foreground">
                  {editedEquipment.warrantyExpiration}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Physical Location
                </p>
                <p className="font-medium text-foreground">
                  {editedEquipment.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Department</p>
                <p className="font-medium text-foreground">
                  {editedEquipment.department}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Assigned Team
                </p>
                <p className="font-medium text-foreground">
                  {editedEquipment.assignedTeam}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Hours of Operation
                </p>
                <p className="font-medium text-foreground">
                  {editedEquipment.hoursOfOperation.toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Maintenance History
          </h2>
          <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              className="flex items-start gap-4 p-3 bg-background rounded-lg"
            >
              <div className="pt-1">
                {record.type === "emergency" ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : record.type === "corrective" ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">
                  {record.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {record.date} • {record.technician} • {record.hoursSpent}h
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground capitalize">
                  {record.type}
                </span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No maintenance history recorded for this asset.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const buildViewModel = (
  record: EquipmentRecord,
  departmentMap: Map<number, DepartmentRecord>,
  teamMap: Map<number, MaintenanceTeamRecord>
): EquipmentViewModel => {
  const status = deriveStatus(record);
  return {
    id: record.equipment_id,
    name: record.equipment_name,
    serialNumber: record.serial_number,
    purchaseDate: record.purchase_date ?? "N/A",
    warrantyExpiration: record.warranty_end_date ?? "N/A",
    location: record.location ?? "Unspecified",
    department:
      departmentMap.get(record.department_id ?? -1)?.department_name ??
      "Unassigned",
    assignedTeam:
      teamMap.get(record.maintenance_team_id)?.team_name ?? "Unassigned",
    status,
    hoursOfOperation: 0,
    nextMaintenanceDate: record.warranty_end_date ?? "N/A",
    lastMaintenanceDate: record.purchase_date ?? "N/A",
  };
};

const deriveStatus = (
  record: EquipmentRecord
): EquipmentViewModel["status"] => {
  if (record.is_scrapped) {
    return "maintenance";
  }

  if (record.warranty_end_date) {
    const expiry = new Date(record.warranty_end_date);
    if (expiry.getTime() < Date.now()) {
      return "warning";
    }
  }

  return "operational";
};

const buildMaintenanceHistory = (
  requests: MaintenanceRequestRecord[],
  userMap: Map<number, UserRecord>
): MaintenanceRecord[] => {
  return requests
    .map((req) => ({
      id: req.request_number,
      date: req.completed_at ?? req.scheduled_date ?? req.created_at,
      type: req.request_type_id === 2 ? "preventive" : "corrective",
      description: req.subject,
      technician: req.assigned_to
        ? userMap.get(req.assigned_to)?.full_name ?? "Unassigned"
        : "Unassigned",
      hoursSpent: req.duration_hours ? Number(req.duration_hours) : 0,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
