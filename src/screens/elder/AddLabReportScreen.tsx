import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { createLabReport, getLabReports } from '../../api/labReports';
import { getMyElders } from '../../api/relationships';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { LabReportResponse, MainStackParamList, RelationshipResponse } from '../../types';

type AddLabReportRoute = RouteProp<MainStackParamList, 'AddLabReport'>;

export default function AddLabReportScreen() {
  const navigation = useNavigation();
  const route = useRoute<AddLabReportRoute>();
  const { user } = useAuth();
  const routeElderId = route.params?.elderId;
  const [selectedElderId, setSelectedElderId] = useState<string>(
    routeElderId ?? (user?.role === 'ELDER' ? user.id : ''),
  );
  const [linkedElders, setLinkedElders] = useState<RelationshipResponse[]>([]);

  const [testName, setTestName] = useState('');
  const [result, setResult] = useState('');
  const [testDate, setTestDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileUri, setSelectedFileUri] = useState<string | null>(null);
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<LabReportResponse[]>([]);

  useEffect(() => {
    const loadLinkedElders = async () => {
      try {
        const rels = await getMyElders();
        setLinkedElders(rels);
        if (!selectedElderId && rels.length > 0) {
          setSelectedElderId(rels[0].elder.id);
        }
      } catch {
        // Non-blocking for elder self-report flow.
      }
    };

    if (!selectedElderId || user?.role !== 'ELDER') {
      loadLinkedElders();
    }
  }, [selectedElderId, user?.role]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!selectedElderId) {
        setHistory([]);
        return;
      }

      setHistoryLoading(true);
      try {
        const page = await getLabReports(selectedElderId, 0, 50);
        setHistory(page.content);
      } catch {
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [selectedElderId]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFileName(file.name ?? 'Selected file');
        setSelectedFileUri(file.uri);
      }
    } catch {
      Alert.alert('File Error', 'Unable to select file. Please try again.');
    }
  };

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      setTestDate(`${y}-${m}-${d}`);
    }
  };

  const setDateFromObject = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setTestDate(`${y}-${m}-${d}`);
  };

  const handleSubmit = async () => {
    if (!selectedElderId) {
      Alert.alert('Missing Patient', 'Please select whose report you want to submit.');
      return;
    }
    if (!testName.trim() || !result.trim() || !testDate.trim()) {
      Alert.alert('Missing Fields', 'Test name, result and test date are required.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(testDate.trim())) {
      Alert.alert('Invalid Date', 'Test date must be in YYYY-MM-DD format.');
      return;
    }
    setLoading(true);
    try {
      await createLabReport({
        elderId: selectedElderId,
        testName: testName.trim(),
        result: result.trim(),
        testDate: testDate.trim(),
        fileUrl: selectedFileUri ?? (fileUrl.trim() || undefined),
        prescription: prescription.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      const page = await getLabReports(selectedElderId, 0, 50);
      setHistory(page.content);
      setTestName('');
      setResult('');
      setTestDate('');
      setFileUrl('');
      setSelectedFileName(null);
      setSelectedFileUri(null);
      setPrescription('');
      setNotes('');
      Alert.alert('Success', 'Lab report added successfully!');
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        'Failed to add lab report.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.card, SHADOW.medium]}>
          <Text style={styles.cardTitle}>🧪 Upload Lab Report</Text>
          <Text style={styles.subTitle}>
            {selectedElderId
              ? 'Submitting report for selected elder'
              : 'Select whose report you want to submit'}
          </Text>

          {linkedElders.length > 0 && (
            <>
              <Text style={styles.label}>Patient *</Text>
              <View style={styles.patientChipsWrap}>
                {linkedElders.map(rel => {
                  const elder = rel.elder;
                  const isActive = elder.id === selectedElderId;
                  return (
                    <TouchableOpacity
                      key={rel.id}
                      style={[styles.patientChip, isActive && styles.patientChipActive]}
                      onPress={() => setSelectedElderId(elder.id)}
                      activeOpacity={0.8}>
                      <Text
                        style={[styles.patientChipText, isActive && styles.patientChipTextActive]}>
                        {elder.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {!selectedElderId && linkedElders.length === 0 && (
            <Text style={styles.helperText}>
              No linked elder found. Link an elder first from your dashboard using care code.
            </Text>
          )}

          <Text style={styles.label}>Test Name *</Text>
          <TextInput
            style={styles.input}
            value={testName}
            onChangeText={setTestName}
            placeholder="e.g. Complete Blood Count"
            placeholderTextColor={COLORS.disabled}
            returnKeyType="next"
          />

          <Text style={styles.label}>Result *</Text>
          <TextInput
            style={styles.input}
            value={result}
            onChangeText={setResult}
            placeholder="e.g. Normal / 6.5 mmol/L"
            placeholderTextColor={COLORS.disabled}
            returnKeyType="next"
          />

          <Text style={styles.label}>Test Date *</Text>
          {Platform.OS === 'web' ? (
            <>
              <TextInput
                style={styles.input}
                value={testDate}
                onChangeText={setTestDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.disabled}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.dateQuickRow}>
                <TouchableOpacity
                  style={styles.dateQuickBtn}
                  onPress={() => setDateFromObject(new Date())}
                  activeOpacity={0.8}>
                  <Text style={styles.dateQuickText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dateQuickBtn}
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 1);
                    setDateFromObject(d);
                  }}
                  activeOpacity={0.8}>
                  <Text style={styles.dateQuickText}>Yesterday</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}>
                <Text style={testDate ? styles.inputText : styles.placeholderText}>
                  {testDate || 'Select date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={testDate ? new Date(testDate + 'T00:00:00') : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                />
              )}
            </>
          )}

          <Text style={styles.label}>File URL (optional)</Text>
          <TextInput
            style={styles.input}
            value={fileUrl}
            onChangeText={setFileUrl}
            placeholder="https://example.com/report.pdf"
            placeholderTextColor={COLORS.disabled}
            autoCapitalize="none"
            keyboardType="url"
            returnKeyType="next"
          />

          <TouchableOpacity
            style={styles.filePickBtn}
            onPress={handlePickFile}
            activeOpacity={0.8}>
            <Text style={styles.filePickBtnText}>Choose File (PDF/Image)</Text>
          </TouchableOpacity>
          {selectedFileName && (
            <Text style={styles.fileNameText}>Selected: {selectedFileName}</Text>
          )}

          <Text style={styles.label}>Prescription (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={prescription}
            onChangeText={setPrescription}
            placeholder="Medication / dosage / advice"
            placeholderTextColor={COLORS.disabled}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Doctor comments, follow-ups…"
            placeholderTextColor={COLORS.disabled}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Save Lab Report</Text>
            )}
          </TouchableOpacity>

          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Lab Reports History</Text>
            <Text style={styles.historyHint}>All uploaded reports for selected patient</Text>

            {historyLoading ? (
              <ActivityIndicator color={COLORS.primary} style={styles.historyLoader} />
            ) : history.length === 0 ? (
              <Text style={styles.emptyHistoryText}>No reports uploaded yet.</Text>
            ) : (
              history.map(report => (
                <View key={report.id} style={styles.historyCard}>
                  <View style={styles.historyHeaderRow}>
                    <Text style={styles.historyTestName}>{report.testName}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(report.testDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.historyResult}>Result: {report.result}</Text>
                  {report.prescription ? (
                    <Text style={styles.historyPrescription}>Prescription: {report.prescription}</Text>
                  ) : null}
                  {report.notes ? (
                    <Text style={styles.historyNotes}>Notes: {report.notes}</Text>
                  ) : null}
                  {report.fileUrl ? (
                    <TouchableOpacity
                      style={styles.historyFileBtn}
                      onPress={() => Linking.openURL(report.fileUrl as string).catch(() => {})}
                      activeOpacity={0.8}>
                      <Text style={styles.historyFileBtnText}>View Attached File</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  helperText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
  },
  patientChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  patientChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  patientChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  patientChipText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  patientChipTextActive: {
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : 10,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    backgroundColor: '#F8FAFC',
  },
  textArea: { minHeight: 80, paddingTop: SPACING.sm },
  filePickBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filePickBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  fileNameText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  btnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },
  inputText: { fontSize: FONT_SIZE.md, color: COLORS.text },
  placeholderText: { fontSize: FONT_SIZE.md, color: COLORS.disabled },
  dateQuickRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  dateQuickBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  dateQuickText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  historySection: {
    marginTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  historyTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  historyHint: {
    marginTop: 4,
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    marginBottom: SPACING.sm,
  },
  historyLoader: {
    marginVertical: SPACING.md,
  },
  emptyHistoryText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
    fontStyle: 'italic',
  },
  historyCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: '#F8FAFC',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTestName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  historyDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
  },
  historyResult: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  historyPrescription: {
    marginTop: 4,
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    fontWeight: '700',
  },
  historyNotes: {
    marginTop: 4,
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
  },
  historyFileBtn: {
    marginTop: SPACING.xs,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  historyFileBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
