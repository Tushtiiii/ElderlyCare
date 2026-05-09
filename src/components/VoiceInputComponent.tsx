import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import speechService, {
    SpeechErrorPayload,
    SpeechResultPayload,
} from '../services/speechService';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../theme';

export interface VoiceInputComponentProps {
  language?: string;
  onSpeechResult?: (text: string) => void;
}

export default function VoiceInputComponent({
  language = 'en-US',
  onSpeechResult,
}: VoiceInputComponentProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleSpeechResult = useCallback(
    (payload: SpeechResultPayload) => {
      setTranscript(payload.text);
      setError(null);
      onSpeechResult?.(payload.text);
    },
    [onSpeechResult],
  );

  const handleSpeechError = useCallback((payload: SpeechErrorPayload) => {
    setError(payload.message);
    setIsListening(false);
  }, []);

  useEffect(() => {
    speechService.initialize({
      onStart: () => {
        setIsListening(true);
        setError(null);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onResult: handleSpeechResult,
      onError: handleSpeechError,
    });

    return () => {
      speechService.destroy().catch(() => {});
    };
  }, [handleSpeechError, handleSpeechResult]);

  const handleMicPress = async () => {
    setIsBusy(true);

    try {
      if (isListening) {
        await speechService.stopListening();
        return;
      }

      await speechService.startListening({ locale: language });
    } catch (err: any) {
      setIsListening(false);
      setError(err?.message ?? 'Failed to start voice recognition.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <View style={[styles.container, SHADOW.small]}>
      <TouchableOpacity
        style={[styles.micButton, isListening && styles.micButtonActive]}
        onPress={handleMicPress}
        activeOpacity={0.8}
        disabled={isBusy}>
        {isBusy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.micButtonText}>{isListening ? 'Stop' : 'Start Mic'}</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.statusText}>{isListening ? 'Listening...' : 'Tap mic to speak'}</Text>

      <View style={styles.outputCard}>
        <Text style={styles.outputLabel}>Recognized Text</Text>
        <Text style={styles.outputValue}>{transcript || 'Your speech will appear here.'}</Text>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  micButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: COLORS.danger,
  },
  micButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  statusText: {
    color: COLORS.subtext,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  outputCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    backgroundColor: '#F8FAFC',
  },
  outputLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  outputValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
