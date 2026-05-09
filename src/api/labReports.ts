import { LabReportRequest, LabReportResponse, Page } from '../types';
import apiClient from './client';

/** POST /api/lab-reports — create a new lab report */
export const createLabReport = (
  data: LabReportRequest,
): Promise<LabReportResponse> =>
  apiClient
    .post<LabReportResponse>('/api/lab-reports', data)
    .then(r => r.data);

/** GET /api/lab-reports/elder/:elderId — paginated lab reports */
export const getLabReports = (
  elderId: string,
  page = 0,
  size = 20,
): Promise<Page<LabReportResponse>> =>
  apiClient
    .get<Page<LabReportResponse>>(`/api/lab-reports/elder/${elderId}`, {
      params: { page, size },
    })
    .then(r => r.data);

/** GET /api/lab-reports/elder/:elderId/search — search by test name */
export const searchLabReports = (
  elderId: string,
  testName: string,
  page = 0,
  size = 20,
): Promise<Page<LabReportResponse>> =>
  apiClient
    .get<Page<LabReportResponse>>(
      `/api/lab-reports/elder/${elderId}/search`,
      { params: { testName, page, size } },
    )
    .then(r => r.data);

/** GET /api/lab-reports/:id */
export const getLabReportById = (
  id: string,
): Promise<LabReportResponse> =>
  apiClient.get<LabReportResponse>(`/api/lab-reports/${id}`).then(r => r.data);

/** DELETE /api/lab-reports/:id */
export const deleteLabReport = (id: string): Promise<void> =>
  apiClient.delete(`/api/lab-reports/${id}`);

/** PATCH /api/lab-reports/:id/prescription */
export const updateLabReportPrescription = (
  id: string,
  prescription?: string,
): Promise<LabReportResponse> =>
  apiClient
    .patch<LabReportResponse>(`/api/lab-reports/${id}/prescription`, {
      prescription,
    })
    .then(r => r.data);

/** GET /api/lab-reports/elder/:elderId/latest — latest reports for dashboard */
export const getLatestLabReports = (
  elderId: string,
): Promise<LabReportResponse[]> =>
  getLabReports(elderId, 0, 20).then(r => r.content);

/** GET /api/lab-reports/schema/:type — get schema for a report type */
export const getReportSchema = (type: string): Promise<any> =>
  apiClient.get(`/api/report-schemas/${type}`).then(r => r.data);

/** POST /api/lab-reports/upload — upload report with file */
export const uploadReport = (data: any): Promise<LabReportResponse> => {
  return createLabReport({
    elderId: data.elderId,
    testName: data.testName ?? data.reportType ?? 'Lab Report',
    result: data.result ?? 'Report uploaded',
    testDate: data.testDate ?? new Date().toISOString().slice(0, 10),
    dynamicData: data.reportData,
    fileUrl: data.file?.uri,
    notes: data.notes,
    prescription: data.prescription,
  });
};

