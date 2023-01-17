/* env */
export type EmployeeRegistryConfig = {
  PORT: number,
  ROUTES_DIR: string
};


export const Config: EmployeeRegistryConfig = {
  PORT: 4000,
  ROUTES_DIR: "/src/routes/",
};

/* Common */

export enum UserRole {
  ADMIN = "Admin",
  SUPER = "Super",
}

export type UserResponse = {
  first_name: string,
  last_name?: string,
  role?: UserRole | null,
  address?: string,
  job_title?: string,
  department: { _id: string, name: string } | null,
  _id: string,
}

export type DepartmentResponse = {
  name: string,
  _id: string,
}

export enum ActionLogType {
  DEPARTMENT_CHANGE = "DEPARTMENT_CHANGE",
}

export type ActionLogResponse = {
  type: ActionLogType,
  _id: string,
  data: {
    user: string,
    changed_from: string,
    changed_to: string,
    changed_by: string,
  },
  created_at: string
}

export type UserUpdateRequest = {
  first_name?: string,
  last_name?: string,
  address?: string,
  job_title?: string,
  department?: string | null,
  isAdmin?: boolean,
}

export type DepartmentUpdateRequest = {
  name: string,
}

export type UserSaveRequest = {
  first_name: string,
  last_name?: string,
  role?: string,
  address?: string,
  job_title?: string,
  department?: string | null,
}


export default Config;
