import client from './client';

export interface Geofence {
  id?: number;
  elderId: number;
  guardianId: number;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
}

export const geofenceApi = {
  createGeofence: async (data: Geofence) => {
    const response = await client.post<Geofence>('/api/geofences', data);
    return response.data;
  },

  getGeofenceByElderId: async (elderId: number) => {
    const response = await client.get<Geofence>(`/api/geofences/elder/${elderId}`);
    return response.data;
  },

  updateGeofence: async (id: number, data: Geofence) => {
    const response = await client.put<Geofence>(`/api/geofences/${id}`, data);
    return response.data;
  },

  deleteGeofence: async (id: number) => {
    const response = await client.delete(`/api/geofences/${id}`);
    return response.data;
  },
};
