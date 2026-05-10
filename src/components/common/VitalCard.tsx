import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { VitalRecordResponse } from '../../types';

const VITAL_ICONS: Record<string, string> = {
  BLOOD_SUGAR: '🩸',
  BLOOD_PRESSURE: '💉',
  HEART_RATE: '❤️',
  OXYGEN_SATURATION: '🫁',
  TEMPERATURE: '🌡️',
};

interface Props {
  vital: VitalRecordResponse;
  compact?: boolean;
  onEdit?: (vital: VitalRecordResponse) => void;
}

export default function VitalCard({ vital, compact = false, onEdit }: Props) {
  const icon = VITAL_ICONS[vital.vitalType] ?? '📊';
  const displayValue =
    vital.vitalType === 'BLOOD_PRESSURE' && vital.secondaryValue
      ? `${vital.value}/${vital.secondaryValue}`
      : `${vital.value}`;

  return (
    <View
      style={[
        styles.card,
        SHADOW.small,
        vital.isAbnormal && styles.abnormal,
      ]}>
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.info}>
            <Text style={styles.typeName}>
              {vital.vitalTypeDisplayName}
            </Text>
            {!compact && (
              <Text style={styles.time}>
                {new Date(vital.recordedAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>
          <View style={styles.valueCol}>
            <Text
              style={[
                styles.value,
                vital.isAbnormal && styles.abnormalText,
              ]}>
              {displayValue}
            </Text>
            <Text style={styles.unit}>{vital.unit}</Text>
          </View>
        </View>
        {vital.isAbnormal && (
          <View style={styles.abnormalBadge}>
            <Text style={styles.abnormalBadgeText}>⚠ Abnormal</Text>
          </View>
        )}
        {!compact && vital.notes ? (
          <Text style={styles.notes}>📝 {vital.notes}</Text>
        ) : null}
      </View>

      {onEdit && !compact && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(vital)}
          activeOpacity={0.7}>
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  abnormal: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  cardContent: {
    flex: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 28, marginRight: SPACING.sm },
  info: { flex: 1 },
  typeName: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  time: { fontSize: FONT_SIZE.xs, color: COLORS.subtext, marginTop: 2 },
  valueCol: { alignItems: 'flex-end' },
  value: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.primary },
  abnormalText: { color: COLORS.danger },
  unit: { fontSize: FONT_SIZE.xs, color: COLORS.subtext },
  abnormalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEBEE',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: SPACING.xs,
  },
  abnormalBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.danger,
  },
  notes: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  editButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
