export interface ReportField {
  name: string;
  type: 'number' | 'text';
  unit?: string;
  label?: string;
  min?: number;
  max?: number;
  required?: boolean;
}

export interface ReportSchema {
  reportType: string;
  fields: ReportField[];
}

export interface Report {
  id: string;
  elderId: string;
  reportType: string;
  reportData: Record<string, string | number>;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
}

export interface UploadReportRequest {
  elderId: string;
  reportType: string;
  reportData: Record<string, string | number>;
  file: any; // File or Blob for multipart
}
