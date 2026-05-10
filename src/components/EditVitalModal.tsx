import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { updateVital } from '../api/vitals';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../theme';
import { VitalRecordRequest, VitalRecordResponse, VitalType } from '../types';

interface EditVitalModalProps {
  visible: boolean;
  vital: VitalRecordResponse | null;
  onClose: () => void;
  onSuccess: (updatedVital: VitalRecordResponse) => void;
}

export default function EditVitalModal({
  visible,
  vital,
  onClose,
  onSuccess,
}: EditVitalModalProps) {
  const [value, setValue] = useState('');
  const [secondaryValue, setSecondaryValue] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vital) {
      setValue(vital.value.toString());
      setSecondaryValue(vital.secondaryValue?.toString() || '');
      setNotes(vital.notes || '');
    }
  }, [vital, visible]);

  const handleSave = async () => {
    if (!vital) return;

    // Validate inputs
    if (!value.trim()) {
      Alert.alert('Validation Error', 'Please enter a value');
      return;
    }

    if (
      vital.vitalType === 'BLOOD_PRESSURE' &&
      !secondaryValue.trim()
    ) {
      Alert.alert('Validation Error', 'Please enter diastolic pressure');
      return;
    }

    try {
      setLoading(true);

      const request: VitalRecordRequest = {
        elderId: vital.elderId,
        vitalType: vital.vitalType,
        value: parseFloat(value),
        secondaryValue:
          vital.vitalType === 'BLOOD_PRESSURE'
            ? parseFloat(secondaryValue)
            : undefined,
        unit: vital.unit,
        notes: notes.trim() || undefined,
        recordedAt: vital.recordedAt,
      };

      const updated = await updateVital(vital.id, request);
      onSuccess(updated);
      Alert.alert('Success', 'Vital record updated successfully');
      onClose();
    } catch (error: any) {
      console.error('Error updating vital:', error);
      Alert.alert('Error', error.message || 'Failed to update vital record');
    } finally {
      setLoading(false);
    }
  };

  if (!vital) return null;

  const isBP = vital.vitalType === 'BLOOD_PRESSURE';
  const displayName = vital.vitalTypeDisplayName || vital.vitalType;
  const icon = getVitalIcon(vital.vitalType);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.backdrop} />

        <View style={[styles.modalContent, SHADOW.large]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {icon} Edit {displayName}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.form}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}>
            {/* Primary Value */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {isBP ? 'Systolic Pressure' : displayName} *
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setValue}
                  placeholder="Enter value"
                  placeholderTextColor={COLORS.subtext}
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
                <Text style={styles.unit}>{vital.unit}</Text>
              </View>
            </View>

            {/* Secondary Value (Blood Pressure) */}
            {isBP && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Diastolic Pressure *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={secondaryValue}
                    onChangeText={setSecondaryValue}
                    placeholder="Enter diastolic"
                    placeholderTextColor={COLORS.subtext}
                    keyboardType="decimal-pad"
                    editable={!loading}
                  />
                  <Text style={styles.unit}>{vital.unit}</Text>
                </View>
              </View>
            )}

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes (optional)"
                placeholderTextColor={COLORS.subtext}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>

            {/* Metadata */}
            <View style={styles.metadata}>
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Recorded at:</Text>
                <Text style={styles.metadataValue}>
                  {new Date(vital.recordedAt).toLocaleString()}
                </Text>
              </View>
              {vital.isAbnormal && (
                <View style={styles.abnormalBadge}>
                  <Text style={styles.abnormalText}>⚠️ Abnormal Reading</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getVitalIcon(vitalType: VitalType): string {
  const icons: Record<VitalType, string> = {
    BLOOD_SUGAR: '🩸',
    BLOOD_PRESSURE: '💉',
    HEART_RATE: '❤️',
    OXYGEN_SATURATION: '🫁',
    TEMPERATURE: '🌡️',
  };
  return icons[vitalType] || '📊';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: '90%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.subtext,
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  notesInput: {
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },
  unit: {
    paddingRight: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  metadata: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  metadataItem: {
    marginBottom: SPACING.sm,
  },
  metadataLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
    marginBottom: SPACING.xs,
  },
  metadataValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  abnormalBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
  },
  abnormalText: {
    fontSize: FONT_SIZE.sm,
    color: '#DC2626',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
