import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { getActiveAlerts } from '../../api/alerts';
import { getLabReports, updateLabReportPrescription } from '../../api/labReports';
import { getMedications } from '../../api/medications';
import { getMyElders, requestRelationshipByCode } from '../../api/relationships';
import { getVitalsByElder } from '../../api/vitals';
import {
  AlertBanner,
  EmptyState,
  LabReportCard,
  LoadingState,
  MedicationCard,
  SummaryCard,
  VitalCard,
} from '../../components/common';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import {
  HealthAlertResponse,
  LabReportResponse,
  MainStackParamList,
  MedicationResponse,
  RelationshipResponse,
  VitalRecordResponse,
  VitalType,
} from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const GRAPH_FILTERS: { label: string; value: VitalType }[] = [
  { label: 'BP', value: 'BLOOD_PRESSURE' },
  { label: 'Sugar', value: 'BLOOD_SUGAR' },
  { label: 'HR', value: 'HEART_RATE' },
  { label: 'O2', value: 'OXYGEN_SATURATION' },
  { label: 'Temp', value: 'TEMPERATURE' },
];

export default function DoctorDashboardScreen() {
  const navigation = useNavigation<Nav>();

  const [elders, setElders] = useState<{ label: string; value: string }[]>([]);
  const [selectedElderId, setSelectedElderId] = useState<string | null>(null);

  const [careCode, setCareCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [alerts, setAlerts] = useState<HealthAlertResponse[]>([]);
  const [vitalHistory, setVitalHistory] = useState<VitalRecordResponse[]>([]);
  const [medications, setMedications] = useState<MedicationResponse[]>([]);
  const [labReports, setLabReports] = useState<LabReportResponse[]>([]);
  const [editingPrescriptionReportId, setEditingPrescriptionReportId] = useState<string | null>(null);
  const [prescriptionDraft, setPrescriptionDraft] = useState('');
  const [savingPrescription, setSavingPrescription] = useState(false);

  const [graphType, setGraphType] = useState<VitalType>('BLOOD_PRESSURE');

  const selectedElderName = useMemo(
    () => elders.find(e => e.value === selectedElderId)?.label,
    [elders, selectedElderId],
  );

  const fetchElders = useCallback(async () => {
    const relationships: RelationshipResponse[] = await getMyElders();
    const formatted = relationships.map(rel => ({
      label: rel.elder.name,
      value: rel.elder.id,
    }));

    setElders(formatted);
    if (formatted.length === 0) {
      setSelectedElderId(null);
      return;
    }

    setSelectedElderId(prev => {
      if (prev && formatted.some(e => e.value === prev)) {
        return prev;
      }
      return formatted[0].value;
    });
  }, []);

  const fetchSelectedElderData = useCallback(async (elderId: string) => {
    const [alertData, vitalsPage, medsPage, reportsPage] = await Promise.all([
      getActiveAlerts(elderId),
      getVitalsByElder(elderId, 0, 100),
      getMedications(elderId, 0, 100),
      getLabReports(elderId, 0, 100),
    ]);

    setAlerts(alertData);
    setVitalHistory(vitalsPage.content);
    setMedications(medsPage.content);
    setLabReports(reportsPage.content);
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      await fetchElders();
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Failed to load linked patients.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  }, [fetchElders]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  useEffect(() => {
    (async () => {
      if (!selectedElderId) {
        setAlerts([]);
        setVitalHistory([]);
        setMedications([]);
        setLabReports([]);
        return;
      }

      try {
        await fetchSelectedElderData(selectedElderId);
      } catch {
        setAlerts([]);
        setVitalHistory([]);
        setMedications([]);
        setLabReports([]);
      }
    })();
  }, [selectedElderId, fetchSelectedElderData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchElders();
      if (selectedElderId) {
        await fetchSelectedElderData(selectedElderId);
      }
    } finally {
      setRefreshing(false);
    }
  }, [fetchElders, fetchSelectedElderData, selectedElderId]);

  const handleConnectByCode = async () => {
    const normalizedCode = careCode.trim();

    if (!normalizedCode) {
      Alert.alert('Care Code Required', 'Please enter a valid elder care code.');
      return;
    }

    const alreadyLinked = elders.some(
      elder => elder.value.toLowerCase() === normalizedCode.toLowerCase(),
    );
    if (alreadyLinked) {
      setCareCode('');
      Alert.alert('Already Connected', 'This elder is already linked to your account.');
      return;
    }

    setIsLinking(true);
    try {
      await requestRelationshipByCode(normalizedCode);
      setCareCode('');
      await fetchElders();
      Alert.alert('Connected', 'Elder connected successfully.');
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setCareCode('');
        await fetchElders();
        Alert.alert('Already Connected', 'This elder is already linked to your account.');
        return;
      }

      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Unable to connect by care code.';
      Alert.alert('Error', msg);
    } finally {
      setIsLinking(false);
    }
  };

  const openAddLabReport = () => {
    if (!selectedElderId) {
      Alert.alert('Selection Required', 'Select an elder first.');
      return;
    }
    navigation.navigate('AddLabReport', { elderId: selectedElderId });
  };

  const openElderOverview = () => {
    if (!selectedElderId) {
      Alert.alert('Selection Required', 'Select an elder first.');
      return;
    }
    navigation.navigate('ElderDetail', {
      elderId: selectedElderId,
      elderName: selectedElderName ?? 'Elder',
    });
  };

  const openVitalHistory = () => {
    if (!selectedElderId) {
      Alert.alert('Selection Required', 'Select an elder first.');
      return;
    }
    navigation.navigate('ElderVitalHistory', {
      elderId: selectedElderId,
      elderName: selectedElderName ?? 'Elder',
    });
  };

  const graphSeries = useMemo(() => {
    const filtered = vitalHistory
      .filter(v => v.vitalType === graphType)
      .sort(
        (a, b) =>
          new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
      )
      .slice(-14);

    if (filtered.length === 0) return [];

    const values = filtered.map(v => v.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return filtered.map(v => ({
      id: v.id,
      height: Math.max(10, ((v.value - min) / range) * 90),
      day: new Date(v.recordedAt).getDate(),
      abnormal: v.isAbnormal,
      value: v.value,
    }));
  }, [vitalHistory, graphType]);

  const graphStats = useMemo(() => {
    if (graphSeries.length === 0) {
      return null;
    }

    const values = graphSeries.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

    return {
      min,
      max,
      avg,
      samples: values.length,
    };
  }, [graphSeries]);

  const abnormalCount = vitalHistory.filter(v => v.isAbnormal).length;

  const startPrescriptionEdit = (report: LabReportResponse) => {
    setEditingPrescriptionReportId(report.id);
    setPrescriptionDraft(report.prescription ?? '');
  };

  const cancelPrescriptionEdit = () => {
    setEditingPrescriptionReportId(null);
    setPrescriptionDraft('');
  };

  const savePrescriptionEdit = async (reportId: string) => {
    setSavingPrescription(true);
    try {
      const updated = await updateLabReportPrescription(
        reportId,
        prescriptionDraft.trim() || undefined,
      );
      setLabReports(prev =>
        prev.map(report => (report.id === reportId ? updated : report)),
      );
      cancelPrescriptionEdit();
      Alert.alert('Updated', 'Prescription saved successfully.');
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Failed to save prescription.';
      Alert.alert('Error', msg);
    } finally {
      setSavingPrescription(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading doctor dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }>
      <View style={[styles.header, SHADOW.medium]}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Doctor Dashboard</Text>
            <Text style={styles.subtitle}>Care code connect, reports, vitals, meds, and trend history</Text>
          </View>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('RequestConnection')}>
            <Text style={styles.linkButtonText}>+ Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, SHADOW.small]}>
        <Text style={styles.sectionTitle}>1. Connect Elder By Care Code</Text>
        <View style={styles.connectRow}>
          <TextInput
            style={styles.input}
            value={careCode}
            onChangeText={setCareCode}
            placeholder="Enter care code"
            autoCapitalize="none"
            placeholderTextColor={COLORS.disabled}
          />
          <TouchableOpacity
            style={styles.connectBtn}
            onPress={handleConnectByCode}
            disabled={isLinking}>
            <Text style={styles.connectBtnText}>{isLinking ? '...' : 'Connect'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Linked Elders</Text>
        <FlatList
          horizontal
          data={elders}
          keyExtractor={item => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.elderList}
          renderItem={({ item }) => {
            const active = item.value === selectedElderId;
            return (
              <TouchableOpacity
                style={[styles.elderChip, active && styles.elderChipActive]}
                onPress={() => setSelectedElderId(item.value)}>
                <Text style={[styles.elderChipText, active && styles.elderChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyInline}>No linked elders yet.</Text>
          }
        />

        <RNPickerSelect
          onValueChange={value => setSelectedElderId(value)}
          items={elders}
          value={selectedElderId}
          placeholder={{ label: 'Select linked elder...', value: null }}
          style={pickerStyles}
        />
      </View>

      {!selectedElderId ? (
        <EmptyState
          icon="🩺"
          message="Select a patient"
          hint="Connect via care code first, then choose elder to load reports, vitals, and meds history."
        />
      ) : (
        <>
          <View style={[styles.card, SHADOW.small]}>
            <Text style={styles.sectionTitle}>Patient: {selectedElderName}</Text>
            <View style={styles.statsRow}>
              <SummaryCard icon="🧪" title="Reports" value={labReports.length} />
              <SummaryCard icon="📊" title="Vitals" value={vitalHistory.length} />
              <SummaryCard icon="💊" title="Meds" value={medications.length} />
              <SummaryCard
                icon="⚠️"
                title="Abnormal"
                value={abnormalCount}
                valueColor={abnormalCount > 0 ? COLORS.danger : COLORS.accent}
              />
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={openAddLabReport}>
                <Text style={styles.actionBtnText}>Add Report + Prescription</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnSecondary} onPress={openVitalHistory}>
                <Text style={styles.actionBtnSecondaryText}>Open Full Vitals History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnSecondary} onPress={openElderOverview}>
                <Text style={styles.actionBtnSecondaryText}>Open Elder Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {alerts.length > 0 && (
            <View style={[styles.card, SHADOW.small]}>
              <Text style={styles.sectionTitle}>Active Alerts</Text>
              <AlertBanner alerts={alerts} />
            </View>
          )}

          <View style={[styles.card, SHADOW.small]}>
            <Text style={styles.sectionTitle}>2. Vitals History Graph</Text>
            <View style={styles.filterRow}>
              {GRAPH_FILTERS.map(filter => {
                const active = filter.value === graphType;
                return (
                  <TouchableOpacity
                    key={filter.value}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setGraphType(filter.value)}>
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {graphSeries.length === 0 ? (
              <Text style={styles.emptyInline}>No data for selected vital type.</Text>
            ) : (
              <>
                {graphStats && (
                  <View style={styles.graphMetaRow}>
                    <Text style={styles.graphMetaText}>Min: {graphStats.min.toFixed(0)}</Text>
                    <Text style={styles.graphMetaText}>Avg: {graphStats.avg.toFixed(1)}</Text>
                    <Text style={styles.graphMetaText}>Max: {graphStats.max.toFixed(0)}</Text>
                    <Text style={styles.graphMetaText}>N: {graphStats.samples}</Text>
                  </View>
                )}

                <View style={styles.chartWrap}>
                  <View style={styles.chartGrid}>
                    <View style={styles.gridLine} />
                    <View style={styles.gridLine} />
                    <View style={styles.gridLine} />
                  </View>
                  {graphSeries.map(point => (
                    <View key={point.id} style={styles.barWrap}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: point.height,
                            backgroundColor: point.abnormal ? COLORS.danger : COLORS.primary,
                          },
                        ]}
                      />
                      <Text style={styles.barDay}>{point.day}</Text>
                      <Text style={styles.barValue}>{point.value.toFixed(0)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.graphLegendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                    <Text style={styles.legendText}>Normal</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
                    <Text style={styles.legendText}>Abnormal</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <View style={[styles.card, SHADOW.small]}>
            <Text style={styles.sectionTitle}>3. All Reports History</Text>
            {labReports.length === 0 ? (
              <EmptyState icon="🧪" message="No reports yet" hint="Upload the first report for this elder." />
            ) : (
              labReports.map(report => (
                <View key={report.id} style={styles.reportItemWrap}>
                  <LabReportCard report={report} />

                  {editingPrescriptionReportId === report.id ? (
                    <View style={styles.prescriptionEditorWrap}>
                      <Text style={styles.prescriptionEditorLabel}>Edit Prescription</Text>
                      <TextInput
                        style={styles.prescriptionEditorInput}
                        value={prescriptionDraft}
                        onChangeText={setPrescriptionDraft}
                        placeholder="Add medication, dosage, and instructions"
                        placeholderTextColor={COLORS.disabled}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                      />
                      <View style={styles.prescriptionActionRow}>
                        <TouchableOpacity
                          style={styles.prescriptionCancelBtn}
                          onPress={cancelPrescriptionEdit}
                          disabled={savingPrescription}>
                          <Text style={styles.prescriptionCancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.prescriptionSaveBtn}
                          onPress={() => savePrescriptionEdit(report.id)}
                          disabled={savingPrescription}>
                          <Text style={styles.prescriptionSaveBtnText}>
                            {savingPrescription ? 'Saving...' : 'Save Prescription'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.inlinePrescriptionBtn}
                      onPress={() => startPrescriptionEdit(report)}>
                      <Text style={styles.inlinePrescriptionBtnText}>
                        {report.prescription ? 'Update Prescription' : 'Add Prescription'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>

          <View style={[styles.card, SHADOW.small]}>
            <Text style={styles.sectionTitle}>4. All Vitals History</Text>
            {vitalHistory.length === 0 ? (
              <EmptyState icon="📊" message="No vitals found" />
            ) : (
              vitalHistory.map(vital => <VitalCard key={vital.id} vital={vital} compact />)
            )}
          </View>

          <View style={[styles.card, SHADOW.small]}>
            <Text style={styles.sectionTitle}>5. Medications History</Text>
            {medications.length === 0 ? (
              <EmptyState icon="💊" message="No medications found" />
            ) : (
              medications.map(med => <MedicationCard key={med.id} medication={med} />)
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  title: {
    color: '#fff',
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  headerTextWrap: {
    flex: 1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
  },
  linkButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  connectRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: '#F8FAFC',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONT_SIZE.sm,
  },
  connectBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  connectBtnText: {
    color: '#fff',
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  label: {
    color: COLORS.subtext,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  elderList: {
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  elderChip: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
  },
  elderChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  elderChipText: {
    color: COLORS.subtext,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  elderChipTextActive: {
    color: COLORS.primary,
  },
  emptyInline: {
    color: COLORS.subtext,
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
    marginVertical: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  actionRow: {
    gap: SPACING.xs,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  actionBtnSecondary: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnSecondaryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  filterChip: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    backgroundColor: COLORS.card,
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  filterChipText: {
    color: COLORS.subtext,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: COLORS.primary,
  },
  chartWrap: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 130,
    paddingVertical: SPACING.xs,
    gap: 2,
  },
  chartGrid: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  gridLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    opacity: 0.6,
  },
  barWrap: {
    zIndex: 1,
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 10,
    borderRadius: 4,
    minHeight: 8,
  },
  barDay: {
    marginTop: 2,
    fontSize: 9,
    color: COLORS.subtext,
  },
  barValue: {
    fontSize: 9,
    color: COLORS.text,
    fontWeight: '700',
  },
  graphMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  graphMetaText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    fontWeight: '600',
  },
  graphLegendRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  legendText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
  },
  reportItemWrap: {
    marginBottom: SPACING.sm,
  },
  inlinePrescriptionBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: -SPACING.xs,
  },
  inlinePrescriptionBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
  },
  prescriptionEditorWrap: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: -SPACING.xs,
    backgroundColor: '#F8FAFC',
  },
  prescriptionEditorLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.subtext,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  prescriptionEditorInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: '#fff',
    color: COLORS.text,
    minHeight: 84,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    fontSize: FONT_SIZE.sm,
  },
  prescriptionActionRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    justifyContent: 'flex-end',
    marginTop: SPACING.xs,
  },
  prescriptionCancelBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  prescriptionCancelBtnText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    fontWeight: '700',
  },
  prescriptionSaveBtn: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  prescriptionSaveBtnText: {
    fontSize: FONT_SIZE.xs,
    color: '#fff',
    fontWeight: '700',
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: FONT_SIZE.sm,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    color: COLORS.text,
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: FONT_SIZE.sm,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    color: COLORS.text,
    paddingRight: 30,
    backgroundColor: '#fff',
  },
};
