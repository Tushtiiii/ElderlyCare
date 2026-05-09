import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { getLabReports } from '../../api/labReports';
import { getMyElders } from '../../api/relationships';
import { EmptyState, LabReportCard, LoadingState, SummaryCard } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { LabReportResponse, MainStackParamList, RelationshipResponse } from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

export default function GuardianDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  const [elders, setElders] = useState<RelationshipResponse[]>([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState<LabReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchElders = useCallback(async () => {
    try {
      const data = await getMyElders();
      setElders(data);

      const reportsByElder = await Promise.all(
        data.map(rel => getLabReports(rel.elder.id, 0, 20)),
      );
      const allReports = reportsByElder.flatMap(page => page.content);
      const withPrescription = allReports.filter(
        report => !!report.prescription && report.prescription.trim().length > 0,
      );

      withPrescription.sort(
        (a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime(),
      );
      setPrescriptionHistory(withPrescription);
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchElders();
      setLoading(false);
    })();
  }, [fetchElders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchElders();
    setRefreshing(false);
  }, [fetchElders]);

  if (loading) return <LoadingState message="Loading your elders…" />;

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
        <Text style={styles.welcome}>Guardian Dashboard</Text>
        <Text style={styles.name}>{user?.name} 👨‍👩‍👦</Text>
        <Text style={styles.bannerSub}>
          Monitor your loved ones' health
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <SummaryCard
          icon="👴"
          title="Linked Elders"
          value={elders.length}
        />
        <SummaryCard
          icon="🔗"
          title="Add Elder"
          onPress={() => navigation.navigate('RequestConnection')}
        />
      </View>

      {/* Elders List */}
      <Text style={styles.sectionTitle}>Your Elders</Text>
      {elders.length === 0 ? (
        <EmptyState
          icon="👴"
          message="No linked elders"
          hint="Use care code or email to link an elder and start monitoring"
        />
      ) : (
        elders.map(rel => (
          <TouchableOpacity
            key={rel.id}
            style={[styles.elderCard, SHADOW.small]}
            onPress={() =>
              navigation.navigate('ElderDetail', {
                elderId: rel.elder.id,
                elderName: rel.elder.name,
              })
            }
            activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {rel.elder.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.elderInfo}>
              <Text style={styles.elderName}>{rel.elder.name}</Text>
              <Text style={styles.elderEmail}>{rel.elder.email}</Text>
              {rel.elder.phone && (
                <Text style={styles.elderMeta}>📞 {rel.elder.phone}</Text>
              )}
              {rel.elder.dateOfBirth && (
                <Text style={styles.elderMeta}>🎂 {rel.elder.dateOfBirth}</Text>
              )}
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.sectionTitle}>Doctor Prescription History</Text>
      {prescriptionHistory.length === 0 ? (
        <EmptyState
          icon="💊"
          message="No prescriptions yet"
          hint="Prescriptions from linked elders will appear here"
        />
      ) : (
        prescriptionHistory.slice(0, 8).map(report => (
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
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  welcome: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.8)' },
  name: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: '#fff', marginTop: 2 },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: FONT_SIZE.sm, marginTop: SPACING.xs },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  elderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7B1FA2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '700' },
  elderInfo: { flex: 1 },
  elderName: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  elderEmail: { fontSize: FONT_SIZE.sm, color: COLORS.subtext, marginTop: 2 },
  elderMeta: { fontSize: FONT_SIZE.xs, color: COLORS.subtext, marginTop: 2 },
  chevron: { fontSize: 28, color: COLORS.disabled, marginLeft: SPACING.sm },
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
