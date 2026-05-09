import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { parseAndExecuteVoiceCommand } from '../../api/voice';
import VoiceInputComponent from '../../components/VoiceInputComponent';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { CommandResponseDTO } from '../../types';

export default function VoiceInputScreen() {
  const { user } = useAuth();
  const [lastTranscript, setLastTranscript] = useState('');
  const [result, setResult] = useState<CommandResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const elderId = useMemo(() => user?.role === 'ELDER' ? user.id : undefined, [user]);

  const handleResult = useCallback(async (text: string) => {
    setLastTranscript(text);
    setLoading(true);
    setError(null);

    try {
      const response = await parseAndExecuteVoiceCommand({
        text,
        elderId,
      });
      setResult(response);
    } catch (err: any) {
      setResult(null);
      setError(
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        'Unable to process the voice command right now.',
      );
    } finally {
      setLoading(false);
    }
  }, [elderId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.headerCard, SHADOW.medium]}>
          <Text style={styles.title}>Voice Commands</Text>
          <Text style={styles.subtitle}>
            Speak a medicine command and we will parse, execute, and show the result here.
          </Text>
        </View>

        <VoiceInputComponent onSpeechResult={handleResult} />

        <View style={[styles.panel, SHADOW.small]}>
          <Text style={styles.panelLabel}>Recognized Text</Text>
          <Text style={styles.panelText}>{lastTranscript || 'Your speech will appear here.'}</Text>
        </View>

        {loading && (
          <View style={[styles.panel, SHADOW.small]}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Processing command...</Text>
          </View>
        )}

        {result && (
          <View style={[styles.panel, SHADOW.small, result.success ? styles.successPanel : styles.errorPanel]}>
            <Text style={styles.panelLabel}>Command Result</Text>
            <Text style={styles.messageText}>{result.message}</Text>
            {renderData(result.data)}
          </View>
        )}

        {error && (
          <View style={[styles.panel, SHADOW.small, styles.errorPanel]}>
            <Text style={styles.panelLabel}>Error</Text>
            <Text style={styles.messageText}>{error}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function renderData(data: unknown) {
  if (!data) {
    return null;
  }

  if (Array.isArray(data)) {
    return (
      <View style={styles.listWrap}>
        {data.map((item: any, index: number) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemTitle}>
              {item.medicineName ?? item.name ?? `Item ${index + 1}`}
            </Text>
            <Text style={styles.listItemText}>
              {item.time ? `Time: ${item.time}` : ''}
              {item.time && item.frequency ? ' · ' : ''}
              {item.frequency ? `Frequency: ${item.frequency}` : ''}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (typeof data === 'object') {
    const item = data as Record<string, unknown>;
    return (
      <View style={styles.listWrap}>
        {Object.entries(item).map(([key, value]) => (
          <Text key={key} style={styles.listItemText}>
            {key}: {String(value)}
          </Text>
        ))}
      </View>
    );
  }

  return <Text style={styles.listItemText}>{String(data)}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.subtext,
    fontSize: FONT_SIZE.sm,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  panelLabel: {
    color: COLORS.subtext,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  panelText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 8,
    textAlign: 'center',
    color: COLORS.subtext,
    fontSize: FONT_SIZE.sm,
  },
  successPanel: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent,
  },
  errorPanel: {
    borderLeftWidth: 5,
    borderLeftColor: COLORS.danger,
  },
  messageText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 24,
    fontWeight: '600',
  },
  listWrap: {
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  listItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listItemTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  listItemText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    lineHeight: 20,
  },
});
