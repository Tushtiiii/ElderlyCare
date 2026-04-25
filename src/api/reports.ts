import { Report, ReportSchema, UploadReportRequest } from '../types/reports';
import apiClient from './client';

export const reportApi = {
  getReportSchema: async (reportType: string): Promise<ReportSchema> => {
    const response = await apiClient.get(`/api/report-schemas/${reportType}`);
    return response.data;
  },

  getReportsForElder: async (elderId: string): Promise<Report[]> => {
    const response = await apiClient.get(`/api/reports/${elderId}`);
    return response.data;
  },

  uploadReport: async (data: UploadReportRequest): Promise<Report> => {
    const formData = new FormData();
    formData.append('elderId', data.elderId);
    formData.append('reportType', data.reportType);
    formData.append('reportData', JSON.stringify(data.reportData));
    
    if (data.file) {
      // In React Native, FormData needs an object for file uploads
      formData.append('file', {
        uri: data.file.uri,
        name: data.file.name || 'report.pdf',
        type: data.file.type || 'application/pdf',
      } as any);
    }

    const response = await apiClient.post('/api/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Helper to fetch list of elders for dropdown
  getElders: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/users/elders');
    return response.data;
  }
};
