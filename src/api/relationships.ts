import { RelationshipRequest, RelationshipResponse } from '../types';
import apiClient from './client';

/** POST /api/relationships/request */
export const requestRelationship = (data: RelationshipRequest): Promise<RelationshipResponse> =>
  apiClient.post<RelationshipResponse>('/api/relationships/request', data).then(r => r.data);

/** POST /api/relationships/request-by-code */
export const requestRelationshipByCode = (elderCode: string): Promise<RelationshipResponse> =>
  apiClient
    .post<RelationshipResponse>('/api/relationships/request-by-code', { elderCode })
    .then(r => r.data);

/** PATCH /api/relationships/:id/revoke — revoke a PENDING or ACTIVE relationship */
export const revokeRelationship = (id: string): Promise<RelationshipResponse> =>
  apiClient.patch<RelationshipResponse>(`/api/relationships/${id}/revoke`).then(r => r.data);

/** GET /api/relationships/my-children — [ELDER] all ACTIVE monitoring connections */
export const getMyChildren = (): Promise<RelationshipResponse[]> =>
  apiClient.get<RelationshipResponse[]>('/api/relationships/my-children').then(r => r.data);

/** GET /api/relationships/my-elders — [CHILD] all ACTIVE elders being monitored */
export const getMyElders = (): Promise<RelationshipResponse[]> =>
  apiClient.get<RelationshipResponse[]>('/api/relationships/my-elders').then(r => r.data);

/** GET /api/relationships/elder/:elderId/network — full care team for an elder */
export const getElderNetwork = (elderId: string): Promise<RelationshipResponse[]> =>
  apiClient
    .get<RelationshipResponse[]>(`/api/relationships/elder/${elderId}/network`)
    .then(r => r.data);
