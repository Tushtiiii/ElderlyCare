import {
    Page,
    VitalRecordRequest,
    VitalRecordResponse,
    VitalType,
} from '../types';
import apiClient from './client';

/** POST /api/vitals — record a new vital reading */
export const recordVital = (data: VitalRecordRequest): Promise<VitalRecordResponse> =>
  apiClient.post<VitalRecordResponse>('/api/vitals', data).then(r => r.data);

/** PUT /api/vitals/:vitalId — update an existing vital reading */
export const updateVital = (
  vitalId: string,
  data: VitalRecordRequest,
): Promise<VitalRecordResponse> =>
  apiClient.put<VitalRecordResponse>(`/api/vitals/${vitalId}`, data).then(r => r.data);

/** GET /api/vitals/elder/:id — paginated history for an elder */
export const getVitalsByElder = (
  elderId: string,
  page = 0,
  size = 20,
): Promise<Page<VitalRecordResponse>> =>
  apiClient
    .get<Page<VitalRecordResponse>>(`/api/vitals/elder/${elderId}`, {
      params: { page, size },
    })
    .then(r => r.data);

/** GET /api/vitals/elder/:id/type/:type — filtered by vital type */
export const getVitalsByType = (
  elderId: string,
  vitalType: VitalType,
  page = 0,
  size = 20,
): Promise<Page<VitalRecordResponse>> =>
  apiClient
    .get<Page<VitalRecordResponse>>(
      `/api/vitals/elder/${elderId}/type/${vitalType}`,
      { params: { page, size } },
    )
    .then(r => r.data);

/** GET /api/vitals/elder/:id/latest — latest reading per vital type */
export const getLatestVitals = (
  elderId: string,
): Promise<VitalRecordResponse[]> =>
  apiClient
    .get<VitalRecordResponse[]>(`/api/vitals/elder/${elderId}/latest`)
    .then(r => r.data);
/** GET /api/vitals/elder/:elderId/history — paginated history for an elder */
export const getVitalHistory = (
  elderId: string,
  page = 0,
  size = 20,
): Promise<Page<VitalRecordResponse>> =>
  apiClient
    .get<Page<VitalRecordResponse>>(`/api/vitals/elder/${elderId}/history`, {
      params: { page, size },
    })
    .then(r => r.data);
/** GET /api/vitals/elder/:id/trend — date-range trend */
export const getVitalTrend = (
  elderId: string,
  vitalType: VitalType,
  from: string,
  to: string,
): Promise<VitalRecordResponse[]> =>
  apiClient
    .get<VitalRecordResponse[]>(`/api/vitals/elder/${elderId}/trend`, {
      params: { type: vitalType, from, to },
    })
    .then(r => r.data);

/** GET /api/vitals/elder/:elderId/latest-by-type — latest individual vitals */
export const getVitalsLatestByType = (
  elderId: string,
): Promise<VitalRecordResponse[]> =>
  apiClient
    .get<VitalRecordResponse[]>(`/api/vitals/elder/${elderId}/latest`)
    .then(r => r.data);
