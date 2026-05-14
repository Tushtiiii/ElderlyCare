// ── Domain enums ──────────────────────────────────────────────────────────────
export type Role = 'ELDER' | 'CHILD' | 'DOCTOR' | 'PATHOLOGIST';
export type RelationshipStatus = 'PENDING' | 'ACTIVE' | 'REVOKED';
export type VitalType =
  | 'BLOOD_SUGAR'
  | 'BLOOD_PRESSURE'
  | 'HEART_RATE'
  | 'OXYGEN_SATURATION'
  | 'TEMPERATURE';
export type AlertSeverity = 'WARNING' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

// ── Response DTOs (mirrors Java backend) ──────────────────────────────────────
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  dateOfBirth?: string;
  profilePictureUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  expiresIn: number;
}

export interface GoogleAuthRequest {
  idToken: string;
  pushToken?: string;
}

export interface GoogleRegisterRequest {
  idToken: string;
  role: Role;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  pushToken?: string;
}

export interface RelationshipResponse {
  id: string;
  elder: UserResponse;
  child: UserResponse;
  status: RelationshipStatus;
  requestedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface VitalRecordResponse {
  id: string;
  elderId: string;
  elderName: string;
  vitalType: VitalType;
  vitalTypeDisplayName: string;
  value: number;
  secondaryValue?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
  isAbnormal: boolean;
  createdAt: string;
}

export interface MedicationResponse {
  id: string;
  elderId: string;
  elderName: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  reminderTime?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

export interface LabReportResponse {
  id: string;
  elderId: string;
  elderName: string;
  testName: string;
  result: string;
  testDate: string;
  fileUrl?: string;
  notes?: string;
  prescription?: string;
  createdAt: string;
}

export interface HealthAlertResponse {
  id: string;
  elderId: string;
  elderName: string;
  vitalRecordId?: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  acknowledgedById?: string;
  acknowledgedByName?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface RelationshipRequest {
  targetEmail?: string;
  elderCode?: string;
}

export interface LabReportRequest {
  elderId: string;
  testName: string;
  result: string;
  testDate: string;
  fileUrl?: string;
  dynamicData?: Record<string, unknown>;
  notes?: string;
  prescription?: string;
}

export interface CommandResponseDTO {
  message: string;
  success: boolean;
  data?: unknown;
}

// ── Paginated response wrapper ────────────────────────────────────────────────
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ── Navigation param lists ────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  CompleteProfile: { idToken: string };
};

export type ElderTabParamList = {
  ElderHome: undefined;
  Vitals: undefined;
  Medications: undefined;
  Alerts: undefined;
  ElderProfile: undefined;
};

export type GuardianTabParamList = {
  GuardianHome: undefined;
  Elders: undefined;
  GuardianAlerts: undefined;
  GuardianProfile: undefined;
};

export type DoctorTabParamList = {
  DoctorHome: undefined;
  Patients: undefined;
  DoctorUploadReport: undefined;
  DoctorProfile: undefined;
};

export type PathologistTabParamList = {
  PathologistHome: undefined;
  UploadReport: undefined;
  PathologistProfile: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Relationships: undefined;
  RequestConnection: undefined;
  // Elder screens
  ElderTabs: undefined;
  AddVital: undefined;
  VitalHistory: { vitalType?: VitalType };
  AddMedication: { medication?: MedicationResponse };
  AddLabReport: { elderId: string };
  // Guardian screens
  GuardianTabs: undefined;
  ElderDetail: { elderId: string; elderName: string };
  ElderVitalHistory: { elderId: string; elderName: string; vitalType?: VitalType };
  // Doctor screens
  DoctorTabs: undefined;
  // Pathologist screens
  PathologistTabs: undefined;
  // Common
  ReportDetail: { reportId: string };
};
