import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { getLabReports } from '../../api/labReports';
import { getMyElders } from '../../api/relationships';
import { getVitalTrend } from '../../api/vitals';
import { EmptyState, LabReportCard, LoadingState, SummaryCard } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { LabReportResponse, MainStackParamList, RelationshipResponse, VitalRecordResponse, VitalType } from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const VITAL_FILTERS: { label: string; value: VitalType }[] = [
  { label: '💉 BP', value: 'BLOOD_PRESSURE' },
  { label: '🩸 Sugar', value: 'BLOOD_SUGAR' },
  { label: '❤️ HR', value: 'HEART_RATE' },
  { label: '🫁 O₂', value: 'OXYGEN_SATURATION' },
  { label: '🌡️ Temp', value: 'TEMPERATURE' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function GuardianDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();

  const [elders, setElders] = useState<RelationshipResponse[]>([]);
  const [prescriptionHistory, setPrescriptionHistory] = useState<LabReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedElderId, setSelectedElderId] = useState<string | null>(null);
  const [graphType, setGraphType] = useState<VitalType>('BLOOD_PRESSURE');
  const [trendData, setTrendData] = useState<VitalRecordResponse[]>([]);

  const fetchElders = useCallback(async () => {
    try {
      const data = await getMyElders();
      setElders(data);
      if (data.length > 0) {
        setSelectedElderId(prev => prev ?? data[0].elder.id);
      }
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

  // Fetch trend whenever selected elder or graphType changes
  useEffect(() => {
    if (!selectedElderId) return;
    const to = new Date().toISOString();
    const from30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    getVitalTrend(selectedElderId, graphType, from30d, to)
      .then(setTrendData)
      .catch(() => setTrendData([]));
  }, [selectedElderId, graphType]);

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
          <View key={rel.id} style={[styles.elderCard, SHADOW.small]}>
            <TouchableOpacity
              style={styles.elderCardMain}
              onPress={() => {
                setSelectedElderId(rel.elder.id);
                navigation.navigate('ElderDetail', {
                  elderId: rel.elder.id,
                  elderName: rel.elder.name,
                });
              }}
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
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewVitalsBtn, selectedElderId === rel.elder.id && styles.viewVitalsBtnActive]}
              onPress={() => {
                setSelectedElderId(rel.elder.id);
                navigation.navigate('ElderVitalHistory', {
                  elderId: rel.elder.id,
                  elderName: rel.elder.name,
                });
              }}>
              <Text style={[styles.viewVitalsBtnText, selectedElderId === rel.elder.id && styles.viewVitalsBtnTextActive]}>
                📈 View Vitals
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Vitals Trend Graph for Selected Elder */}
      {selectedElderId && (() => {
        const sel = elders.find(r => r.elder.id === selectedElderId);
        return (
          <>
            <Text style={styles.sectionTitle}>
              📈 {sel?.elder.name ?? 'Elder'}'s Vitals Trend
            </Text>
            <View style={[styles.graphCard, SHADOW.small]}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={VITAL_FILTERS}
                keyExtractor={item => item.value}
                contentContainerStyle={styles.filterRow}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.filterChip, graphType === item.value && styles.filterChipActive]}
                    onPress={() => setGraphType(item.value)}
                    activeOpacity={0.7}>
                    <Text style={[styles.filterChipText, graphType === item.value && styles.filterChipTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {trendData.length < 2 ? (
                <EmptyState icon="📊" message="No trend data" hint="Select an elder and vital type" />
              ) : (() => {
                const chartData = trendData.slice(-10);
                const values = chartData.map(d => d.value);
                const labels = chartData.map(d =>
                  new Date(d.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                );
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                return (
                  <>
                    <LineChart
                      data={{ labels, datasets: [{ data: values, color: () => COLORS.primary, strokeWidth: 2 }] }}
                      width={SCREEN_WIDTH - SPACING.md * 4}
                      height={200}
                      yAxisLabel="" yAxisSuffix=""
                      chartConfig={{
                        backgroundColor: COLORS.card,
                        backgroundGradientFrom: COLORS.card,
                        backgroundGradientTo: COLORS.card,
                        decimalPlaces: 1,
                        color: () => COLORS.primary,
                        labelColor: () => COLORS.subtext,
                        propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary, fill: COLORS.card },
                        propsForBackgroundLines: { strokeDasharray: '4,4', stroke: COLORS.border },
                      }}
                      bezier
                      style={{ borderRadius: RADIUS.md, marginVertical: SPACING.sm }}
                    />
                    <View style={styles.graphStats}>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Min</Text>
                        <Text style={styles.statValue}>{Math.min(...values).toFixed(1)}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Avg</Text>
                        <Text style={styles.statValue}>{avg.toFixed(1)}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Max</Text>
                        <Text style={styles.statValue}>{Math.max(...values).toFixed(1)}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Readings</Text>
                        <Text style={styles.statValue}>{trendData.length}</Text>
                      </View>
                    </View>
                  </>
                );
              })()}
              <TouchableOpacity
                style={styles.fullHistoryBtn}
                onPress={() => navigation.navigate('ElderVitalHistory', {
                  elderId: selectedElderId!,
                  elderName: sel?.elder.name ?? 'Elder',
                })}>
                <Text style={styles.fullHistoryBtnText}>View Full Vital History →</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      })()}

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
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  elderCardMain: {
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewVitalsBtn: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  viewVitalsBtnActive: {
    backgroundColor: COLORS.primary + '15',
  },
  viewVitalsBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.subtext,
  },
  viewVitalsBtnTextActive: {
    color: COLORS.primary,
  },
  graphCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  filterRow: {
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
    paddingRight: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: '#ECEFF1',
  },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterChipText: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.subtext },
  filterChipTextActive: { color: '#fff' },
  graphStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    marginHorizontal: 2,
  },
  statLabel: { fontSize: 10, color: COLORS.subtext, fontWeight: '500', marginBottom: 2 },
  statValue: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  fullHistoryBtn: {
    marginTop: SPACING.sm,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  fullHistoryBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
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
