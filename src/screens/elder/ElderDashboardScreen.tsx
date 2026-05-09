import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { acknowledgeAlert, getActiveAlerts } from '../../api/alerts';
import { getLabReports } from '../../api/labReports';
import { getActiveMedicationsForElder } from '../../api/medications';
import { getElderNetwork } from '../../api/relationships';
import { getLatestVitals } from '../../api/vitals';
import {
    AlertBanner,
    EmptyState,
    LabReportCard,
    LoadingState,
    MedicationCard,
    SummaryCard,
    VitalCard,
} from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import {
    HealthAlertResponse,
    LabReportResponse,
    MainStackParamList,
    MedicationResponse,
    RelationshipResponse,
    VitalRecordResponse,
} from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export default function ElderDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  const [vitals, setVitals] = useState<VitalRecordResponse[]>([]);
  const [alerts, setAlerts] = useState<HealthAlertResponse[]>([]);
  const [medications, setMedications] = useState<MedicationResponse[]>([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState<LabReportResponse[]>([]);
  const [careTeam, setCareTeam] = useState<RelationshipResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [v, a, m, network, reportsPage] = await Promise.all([
        getLatestVitals(user.id),
        getActiveAlerts(user.id),
        getActiveMedicationsForElder(user.id),
        getElderNetwork(user.id),
        getLabReports(user.id, 0, 30),
      ]);
      setVitals(v);
      setAlerts(a);
      setMedications(m);
      setCareTeam(network);
      setPrescriptionHistory(
        reportsPage.content.filter(
          report => !!report.prescription && report.prescription.trim().length > 0,
        ),
      );
    } catch {}
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    })();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      await fetchData();
    } catch {}
  };

  const copyCareCode = async () => {
    if (!user?.id) return;
    await Clipboard.setStringAsync(user.id);
    Alert.alert('Copied!', 'Your Care Code has been copied to clipboard.');
  };

  if (loading) return <LoadingState message="Loading your health data…" />;

  const abnormalCount = vitals.filter(v => v.isAbnormal).length;
  // Use the full ID as the care code for linking, but show it clearly
  const careCode = user?.id ?? '';

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }>
      {/* Welcome */}
      <View style={[styles.banner, SHADOW.medium]}>
        <Text style={styles.welcome}>Good day,</Text>
        <Text style={styles.name}>{user?.name} 👴</Text>
        <Text style={styles.bannerSub}>Here's your health overview</Text>
      </View>

      {/* Shareable care code & care team */}
      {user && (
        <View style={[styles.careCard, SHADOW.small]}>
          <View style={styles.careCodeHeader}>
            <Text style={styles.careCodeLabel}>Your care code</Text>
            <TouchableOpacity onPress={copyCareCode} style={styles.copyBadge}>
              <Text style={styles.copyBadgeText}>Copy Code</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.careCodeValue} selectable>
            {careCode}
          </Text>
          <Text style={styles.careCodeHint}>
            Share this code with guardians, doctors, and pathologists so they
            can connect and access your health monitoring dashboard.
          </Text>

          {careTeam.length > 0 && (
            <View style={styles.careTeamSection}>
              <Text style={styles.careTeamTitle}>Care Team</Text>
              {careTeam.map(rel => (
                <Text key={rel.id} style={styles.careTeamItem}>
                  {rel.child.name} — {rel.child.role}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Active Alerts</Text>
          <AlertBanner alerts={alerts} onAcknowledge={handleAcknowledge} />
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <SummaryCard
          icon="📊"
          title="Vitals Tracked"
          value={vitals.length}
        />
        <SummaryCard
          icon="⚠️"
          title="Abnormal"
          value={abnormalCount}
          valueColor={abnormalCount > 0 ? COLORS.danger : COLORS.accent}
        />
        <SummaryCard
          icon="💊"
          title="Active Meds"
          value={medications.length}
        />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionBtn, SHADOW.small]}
          onPress={() => navigation.navigate('AddVital')}
          activeOpacity={0.8}>
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionLabel}>Add Vital</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, SHADOW.small]}
          onPress={() => navigation.navigate('VitalHistory', {})}
          activeOpacity={0.8}>
          <Text style={styles.actionIcon}>📈</Text>
          <Text style={styles.actionLabel}>Vital History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, SHADOW.small]}
          onPress={() => navigation.navigate('AddLabReport', { elderId: user?.id ?? '' })}
          activeOpacity={0.8}>
          <Text style={styles.actionIcon}>🧪</Text>
          <Text style={styles.actionLabel}>Add Lab Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, SHADOW.small]}
          onPress={() => navigation.navigate('AddMedication', {})}
          activeOpacity={0.8}>
          <Text style={styles.actionIcon}>💊</Text>
          <Text style={styles.actionLabel}>Add Medication</Text>
        </TouchableOpacity>
      </View>

      {/* Latest Vitals */}
      <Text style={styles.sectionTitle}>Latest Vitals</Text>
      {vitals.length === 0 ? (
        <EmptyState
          icon="📊"
          message="No vitals recorded yet"
          hint="Tap 'Add Vital' to record your first reading"
        />
      ) : (
        vitals.map(v => <VitalCard key={v.id} vital={v} compact />)
      )}

      {/* Active Medications */}
      <Text style={styles.sectionTitle}>Active Medications</Text>
      {medications.length === 0 ? (
        <EmptyState
          icon="💊"
          message="No active medications"
          hint="Tap 'Add Medication' to add one"
        />
      ) : (
        medications.slice(0, 3).map(m => (
          <MedicationCard key={m.id} medication={m} />
        ))
      )}

      {/* Prescription History */}
      <Text style={styles.sectionTitle}>Doctor Prescription History</Text>
      {prescriptionHistory.length === 0 ? (
        <EmptyState
          icon="💊"
          message="No prescriptions yet"
          hint="Prescriptions added by doctors/pathologists will appear here"
        />
      ) : (
        prescriptionHistory.slice(0, 5).map(report => (
          <LabReportCard key={report.id} report={report} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl },
  banner: {
    backgroundColor: '#7B1FA2',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  welcome: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.8)' },
  name: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: '#fff', marginTop: 2 },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: FONT_SIZE.sm, marginTop: SPACING.xs },
  careCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  careCodeLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
  },
  careCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  copyBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  copyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  careCodeValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  careCodeHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    marginBottom: SPACING.sm,
  },
  careTeamSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: SPACING.sm,
  },
  careTeamTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  careTeamItem: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    marginBottom: 2,
  },
  section: { marginBottom: SPACING.md },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  actionBtn: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  actionIcon: { fontSize: 26, marginBottom: 4 },
  actionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  // Pending request notifications
  requestNotification: {
    backgroundColor: '#FFF8E1',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },
  sentNotification: {
    backgroundColor: '#FFF3E0',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
  },
  requestNotifIcon: { fontSize: 28, marginRight: SPACING.sm },
  requestNotifContent: { flex: 1 },
  requestNotifTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#E65100',
  },
  sentNotifTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#F57C00',
  },
  requestNotifHint: {
    fontSize: FONT_SIZE.xs,
    color: '#795548',
    marginTop: 2,
  },
  requestBadge: {
    backgroundColor: '#FF6F00',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  requestBadgeText: {
    color: '#fff',
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
});
