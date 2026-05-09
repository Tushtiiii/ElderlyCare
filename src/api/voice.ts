import apiClient from './client';

export interface CommandResponseDTO {
  message: string;
  success: boolean;
  data?: unknown;
}

export interface VoiceCommandRequest {
  text: string;
  elderId?: string;
}

export const parseAndExecuteVoiceCommand = (
  request: VoiceCommandRequest,
): Promise<CommandResponseDTO> =>
  apiClient
    .post<CommandResponseDTO>('/api/voice/parse-intent', request)
    .then(response => response.data);
