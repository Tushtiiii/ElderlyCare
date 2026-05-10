import { AuthResponse, LoginRequest, RegisterRequest } from '../types';
import apiClient from './client';

/** POST /api/auth/login */
export const login = (data: LoginRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/login', data).then(r => r.data);

/** POST /api/auth/register */
export const register = (data: RegisterRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/register', data).then(r => r.data);

interface GoogleAuthRequest {
  idToken: string;
}

interface GoogleAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

/** POST /api/auth/google */
export const googleLogin = (data: GoogleAuthRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/google', data).then(r => r.data);

/** POST /api/auth/google/register */
export const googleRegister = (data: GoogleAuthRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/google/register', data).then(r => r.data);

interface SendOtpRequest {
  email: string;
}

interface SendOtpResponse {
  message: string;
  success: boolean;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  message: string;
  success: boolean;
}

/** POST /api/auth/send-otp */
export const sendOtp = (data: SendOtpRequest): Promise<SendOtpResponse> =>
  apiClient.post<SendOtpResponse>('/api/auth/send-otp', data).then(r => r.data);

/** POST /api/auth/verify-otp */
export const verifyOtp = (data: VerifyOtpRequest): Promise<VerifyOtpResponse> =>
  apiClient.post<VerifyOtpResponse>('/api/auth/verify-otp', data).then(r => r.data);
