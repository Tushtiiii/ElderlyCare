import Voice from '@react-native-voice/voice';
import { PermissionsAndroid, Platform } from 'react-native';

export interface SpeechResultPayload {
  text: string;
  allMatches: string[];
}

export interface SpeechErrorPayload {
  code: string;
  message: string;
}

export interface SpeechServiceCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onResult?: (payload: SpeechResultPayload) => void;
  onError?: (error: SpeechErrorPayload) => void;
}

export interface SpeechStartOptions {
  locale?: string;
}

interface VoiceResultsEvent {
  value?: string[];
}

interface VoiceErrorEvent {
  error?: {
    code?: string;
    message?: string;
  };
}

class SpeechServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

class SpeechService {
  private callbacks: SpeechServiceCallbacks = {};
  private initialized = false;
  private recognition: any | undefined;
  private isWeb = Platform.OS === 'web' || (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));

  initialize(callbacks: SpeechServiceCallbacks): void {
    this.callbacks = callbacks;
    // If running on web and browser provides SpeechRecognition, wire it up.
    if (this.isWeb) {
      const WebSpeech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!WebSpeech) {
        this.initialized = false;
        this.callbacks.onError?.({
          code: 'UNSUPPORTED_PLATFORM',
          message: 'Browser does not support the Web Speech API.',
        });
        return;
      }

      try {
        this.recognition = new WebSpeech();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => this.callbacks.onStart?.();
        this.recognition.onend = () => this.callbacks.onEnd?.();
        this.recognition.onresult = (event: any) => {
          const matches: string[] = [];
          for (let i = 0; i < event.results.length; i++) {
            matches.push(event.results[i][0].transcript);
          }
          const text = matches[0]?.trim() ?? '';

          if (!text) {
            this.callbacks.onError?.({ code: 'NO_SPEECH', message: 'No speech detected. Please try again.' });
            return;
          }

          this.callbacks.onResult?.({ text, allMatches: matches });
        };

        this.recognition.onerror = (ev: any) => {
          const code = ev.error ?? 'RECOGNITION_ERROR';
          const message = this.normalizeErrorMessage(ev.message || String(ev.error || 'Speech recognition error'));
          this.callbacks.onError?.({ code, message });
        };

        this.initialized = true;
        return;
      } catch (e: any) {
        this.initialized = false;
        this.callbacks.onError?.({ code: 'INIT_ERROR', message: e?.message ?? 'Failed to initialize web speech.' });
        return;
      }
    }

    // Native mobile path
    const voiceAvailable = !!Voice && typeof (Voice as any).start === 'function';

    if (!voiceAvailable) {
      this.initialized = false;
      this.callbacks.onError?.({ code: 'UNSUPPORTED_PLATFORM', message: 'Voice recognition is not available on this platform.' });
      return;
    }

    try {
      Voice.onSpeechStart = () => {
        this.callbacks.onStart?.();
      };

      Voice.onSpeechEnd = () => {
        this.callbacks.onEnd?.();
      };

      Voice.onSpeechResults = (event: VoiceResultsEvent) => {
        const matches = event.value ?? [];
        const text = matches[0]?.trim() ?? '';

        if (!text) {
          this.callbacks.onError?.({ code: 'NO_SPEECH', message: 'No speech detected. Please try again.' });
          return;
        }

        this.callbacks.onResult?.({ text, allMatches: matches });
      };

      Voice.onSpeechError = (event: VoiceErrorEvent) => {
        const code = event.error?.code ?? 'RECOGNITION_ERROR';
        const rawMessage = event.error?.message ?? 'Speech recognition failed.';
        const normalizedMessage = this.normalizeErrorMessage(rawMessage);

        this.callbacks.onError?.({ code, message: normalizedMessage });
      };

      this.initialized = true;
    } catch (e: any) {
      this.initialized = false;
      this.callbacks.onError?.({ code: 'INIT_ERROR', message: e?.message ?? 'Failed to initialize voice module.' });
    }
  }

  async startListening(options?: SpeechStartOptions): Promise<void> {
    if (!this.initialized) {
      throw new SpeechServiceError('NOT_INITIALIZED', 'Speech service is not initialized.');
    }

    if (this.isWeb) {
      if (!this.recognition) {
        throw new SpeechServiceError('NOT_INITIALIZED', 'Web speech recognition not initialized.');
      }

      try {
        this.recognition.lang = options?.locale ?? 'en-US';
        this.recognition.start();
      } catch (e: any) {
        throw new SpeechServiceError('START_FAILED', e?.message ?? 'Failed to start web speech recognition.');
      }

      return;
    }

    await this.requestMicrophonePermission();

    const locale = options?.locale ?? 'en-US';
    await Voice.start(locale);
  }

  async stopListening(): Promise<void> {
    if (this.isWeb) {
      try {
        this.recognition?.stop();
      } catch (e) {
        // ignore
      }
      return;
    }

    await Voice.stop();
  }

  async cancelListening(): Promise<void> {
    if (this.isWeb) {
      try {
        this.recognition?.abort?.();
      } catch (e) {
        // ignore
      }
      return;
    }

    await Voice.cancel();
  }

  async destroy(): Promise<void> {
    if (this.isWeb) {
      try {
        if (this.recognition) {
          this.recognition.onstart = null;
          this.recognition.onend = null;
          this.recognition.onresult = null;
          this.recognition.onerror = null;
          this.recognition = undefined;
        }
      } catch (e) {
        // ignore
      }
      this.initialized = false;
      return;
    }

    await Voice.destroy();
    Voice.removeAllListeners();
    this.initialized = false;
  }

  private async requestMicrophonePermission(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );

    if (hasPermission) {
      return;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message:
          'We need microphone access so you can speak and convert voice to text.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new SpeechServiceError(
        'PERMISSION_DENIED',
        'Microphone permission denied. Enable it in settings to use voice input.',
      );
    }
  }

  private normalizeErrorMessage(message: string): string {
    const lower = message.toLowerCase();

    if (
      lower.includes('no match') ||
      lower.includes('no speech') ||
      lower.includes('didn\'t catch')
    ) {
      return 'No speech detected. Please try again.';
    }

    if (lower.includes('permission')) {
      return 'Microphone permission denied. Enable it in settings to use voice input.';
    }

    return message;
  }
}

export default new SpeechService();
