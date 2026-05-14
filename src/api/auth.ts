import apiClient from './client';
import {
  AuthResponse,
  GoogleAuthRequest,
  GoogleRegisterRequest,
  LoginRequest,
  RegisterRequest,
} from '../types';

/** POST /api/auth/login */
export const login = (data: LoginRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/login', data).then(r => r.data);

/** POST /api/auth/register */
export const register = (data: RegisterRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/register', data).then(r => r.data);

/** POST /api/auth/google */
export const googleLogin = (data: GoogleAuthRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/google', data).then(r => r.data);

/** POST /api/auth/google/register */
export const googleRegister = (data: GoogleRegisterRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/google/register', data).then(r => r.data);
