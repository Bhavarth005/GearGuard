"use client"

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react";
import { AddEquipmentModal } from "./add-equipment-modal";
import {
  fetchEquipment,
  fetchDepartments,
  fetchTeams,
  type EquipmentRecord,
  type DepartmentRecord,
  type MaintenanceTeamRecord,
} from "@/lib/api";
import { ApiError } from "@/lib/api-client";

interface EquipmentCard {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  status: "operational" | "warning" | "maintenance";
  hoursOfOperation: number;
  nextMaintenanceDate: string;
  lastMaintenanceDate: string;
  assignedTeam: string;
  location: string;
}

interface EquipmentDashboardProps {
  onSelectEquipment: (id: string) => void;
}

export function EquipmentDashboard({
  onSelectEquipment,
}: EquipmentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [equipment, setEquipment] = useState<EquipmentCard[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadEquipment = async () => {
      try {
        setLoading(true);
        const [equipmentRecords, departmentRecords, teamRecords] =
          await Promise.all([
            fetchEquipment(),
            fetchDepartments(),
            fetchTeams(),
          ]);

        if (!active) return;

        const departmentMap = new Map<number, DepartmentRecord>(
          departmentRecords.map((dept) => [dept.department_id, dept])
        );
        const teamMap = new Map<number, MaintenanceTeamRecord>(
          teamRecords.map((team) => [team.team_id, team])
        );

        setEquipment(
          equipmentRecords.map((record) =>
            mapEquipmentRecord(record, departmentMap, teamMap)
          )
        );
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

    loadEquipment();
    return () => {
      active = false;
    };
  }, []);

  const departments = useMemo(() => {
    return ["all", ...new Set(equipment.map((e) => e.department))];
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch =
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === "all" || eq.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, departmentFilter, equipment]);

  const handleAddEquipment = (newEquip: any) => {
    const newEquipment: EquipmentCard = {
      id: Date.now().toString(),
      name: newEquip.name,
      serialNumber: newEquip.serialNumber,
      department: newEquip.department,
      status: "operational",
      hoursOfOperation: 0,
      nextMaintenanceDate:
        newEquip.warrantyExpiration || new Date().toISOString().split("T")[0],
      lastMaintenanceDate:
        newEquip.purchaseDate || new Date().toISOString().split("T")[0],
      assignedTeam: newEquip.assignedTeam,
      location: newEquip.location,
    };
    setEquipment((prev) => [...prev, newEquipment]);
    setShowAddModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "maintenance":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 flex items-center gap-2 bg-input rounded-lg px-3 sm:px-4 py-2 border border-border">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-input text-foreground px-3 sm:px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#714B67] to-[#017E84] text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Equipment</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                departmentFilter === dept
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-input"
              }`}
            >
              {dept === "all" ? "All" : dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1">
        {loading && (
          <div className="bg-card border border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
            Syncing equipment with GearGuard API...
          </div>
        )}
        {error && !loading && (
          <div className="bg-destructive/10 border border-destructive/40 text-destructive rounded-lg p-4 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && filteredEquipment.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
            No equipment matched your filters.
          </div>
        )}
        {filteredEquipment.map((equipment) => (
          <div
            key={equipment.id}
            onClick={() => onSelectEquipment(equipment.id)}
            className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:border-primary/50 cursor-pointer transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(equipment.status)}
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                    {equipment.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 truncate">
                  S/N: {equipment.serialNumber}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Department</p>
                    <p className="font-medium text-foreground truncate">
                      {equipment.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Team</p>
                    <p className="font-medium text-foreground truncate">
                      {equipment.assignedTeam}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Hours Op.</p>
                    <p className="font-medium text-foreground">
                      {equipment.hoursOfOperation.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Next Maint.</p>
                    <p className="font-medium text-foreground whitespace-nowrap">
                      {equipment.nextMaintenanceDate}
                    </p>
                  </div>
                </div>
              </div>

              <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0 w-full sm:w-auto">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEquipment}
      />
    </div>
  );
}

const mapEquipmentRecord = (
  record: EquipmentRecord,
  departmentMap: Map<number, DepartmentRecord>,
  teamMap: Map<number, MaintenanceTeamRecord>
): EquipmentCard => {
  const status = deriveStatus(record);
  return {
    id: record.equipment_id.toString(),
    name: record.equipment_name,
    serialNumber: record.serial_number,
    department:
      departmentMap.get(record.department_id ?? -1)?.department_name ??
      "Unassigned",
    status,
    hoursOfOperation: 0,
    nextMaintenanceDate: record.warranty_end_date ?? "N/A",
    lastMaintenanceDate: record.purchase_date ?? "N/A",
    assignedTeam:
      teamMap.get(record.maintenance_team_id)?.team_name ?? "Unassigned",
    location: record.location ?? "Unspecified",
  };
};

const deriveStatus = (record: EquipmentRecord): EquipmentCard["status"] => {
  if (record.is_scrapped) {
    return "maintenance";
  }

  if (record.warranty_end_date) {
    const warrantyDate = new Date(record.warranty_end_date);
    const today = new Date();
    if (warrantyDate.getTime() < today.getTime()) {
      return "warning";
    }
    const daysUntilExpiry =
      (warrantyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntilExpiry < 30) {
      return "warning";
    }
  }

  return "operational";
};
