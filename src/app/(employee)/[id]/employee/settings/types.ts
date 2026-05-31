export interface EmployeeProfileSettingsData {
  fullName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  roleLabel: string;
  employeeId: string;
}

export interface EmployeeOperationalSettingsData {
  terminal: string;
  defaultView: string;
  autoLogoff: string;
  quickPin: string;
  soundQueue: boolean;
  soundScan: boolean;
  soundStock: boolean;
  notifyEmail: boolean;
  notifyPush: boolean;
  weeklySchedule: Array<{
    day: string;
    enabled: boolean;
    start: string;
    end: string;
  }>;
}

export interface EmployeeSettingsPageData {
  profile: EmployeeProfileSettingsData;
  operational: EmployeeOperationalSettingsData;
}

export interface SettingsActionState {
  error: string;
  success: string;
  fieldErrors: Record<string, string>;
}

export const emptySettingsActionState: SettingsActionState = {
  error: "",
  success: "",
  fieldErrors: {},
};
