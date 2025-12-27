import { apiRequest } from "./api-client";

export interface EquipmentRecord {
  equipment_id: number;
  equipment_name: string;
  serial_number: string;
  category_id: number | null;
  department_id: number | null;
  assigned_user_id: number | null;
  maintenance_team_id: number | null;
  default_technician_id: number | null;
  purchase_date: string | null;
  warranty_end_date: string | null;
  location: string | null;
  is_scrapped: boolean;
}

export interface DepartmentRecord {
  department_id: number;
  department_name: string;
  description: string | null;
  is_active: boolean;
}

export interface MaintenanceTeamRecord {
  team_id: number;
  team_name: string;
  description: string | null;
  is_active?: boolean;
}

export interface UserRecord {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  department_id: number | null;
}

export interface MaintenanceRequestRecord {
  request_id: number;
  request_number: string;
  subject: string;
  description: string | null;
  equipment_id: number;
  request_type_id: number;
  requested_by: number;
  scheduled_date: string | null;
  status_id: number;
  assigned_to: number | null;
  duration_hours: number | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface CreateMaintenanceRequestPayload {
  request_number: string;
  subject: string;
  description: string;
  equipment_id: number;
  request_type_id: number;
  requested_by: number;
  scheduled_date: string;
}

export interface UpdateRequestStatusPayload {
  status_id: number;
  changed_by: number;
  duration_hours?: number;
  notes?: string;
}

export interface CreateTeamPayload {
  team_name: string;
  description?: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  dept: number;
  avatar: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    user_id: number;
    full_name: string;
    role: string;
  };
}

export const fetchEquipment = async (): Promise<EquipmentRecord[]> => {
  return apiRequest<EquipmentRecord[]>("/equipment");
};

export const fetchEquipmentById = async (
  id: number
): Promise<EquipmentRecord | undefined> => {
  const response = await apiRequest<EquipmentRecord[]>(`/equipment/${id}`);
  return response[0];
};

export const fetchDepartments = async (): Promise<DepartmentRecord[]> => {
  return apiRequest<DepartmentRecord[]>("/departments");
};

export const fetchTeams = async (): Promise<MaintenanceTeamRecord[]> => {
  return apiRequest<MaintenanceTeamRecord[]>("/teams");
};

export const fetchRequests = async (): Promise<MaintenanceRequestRecord[]> => {
  return apiRequest<MaintenanceRequestRecord[]>("/requests");
};

export const fetchUsers = async (): Promise<UserRecord[]> => {
  return apiRequest<UserRecord[]>("/users");
};

export const createMaintenanceRequest = async (
  payload: CreateMaintenanceRequestPayload
) => {
  return apiRequest<{ message: string }>("/requests", {
    method: "POST",
    body: payload,
  });
};

export const updateRequestStatus = async (
  requestId: number,
  payload: UpdateRequestStatusPayload
) => {
  return apiRequest<{ message: string }>(`/requests/${requestId}/status`, {
    method: "PATCH",
    body: {
      status_id: payload.status_id,
      changed_by: payload.changed_by,
      duration_hours: payload.duration_hours,
      notes: payload.notes,
    },
  });
};

export const createTeam = async (payload: CreateTeamPayload) => {
  return apiRequest<{ message: string }>("/teams", {
    method: "POST",
    body: payload,
  });
};

export const registerUser = async (payload: RegisterUserPayload) => {
  return apiRequest<{ message: string }>("/users", {
    method: "POST",
    body: payload,
    auth: false,
  });
};

export const login = async (payload: LoginPayload) => {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });
};
