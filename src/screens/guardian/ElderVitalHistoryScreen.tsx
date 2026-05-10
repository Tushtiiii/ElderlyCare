import { RouteProp, useRoute } from '@react-navigation/native';
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

import EditVitalModal from '@/src/components/EditVitalModal';
import { getVitalsByElder, getVitalsByType, getVitalTrend } from '../../api/vitals';
import { EmptyState, LoadingState, VitalCard } from '../../components/common';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import {
    MainStackParamList,
    Page,
    VitalRecordResponse,
    VitalType,
} from '../../types';

const FILTER_OPTIONS: { type: VitalType | 'ALL'; label: string }[] = [
  { type: 'ALL', label: 'All' },
  { type: 'BLOOD_SUGAR', label: '🩸 Sugar' },
  { type: 'BLOOD_PRESSURE', label: '💉 BP' },
  { type: 'HEART_RATE', label: '❤️ HR' },
  { type: 'OXYGEN_SATURATION', label: '🫁 O₂' },
  { type: 'TEMPERATURE', label: '🌡️ Temp' },
];

const TIME_PERIODS = [
  { label: '1W', days: 7, days_label: '1 Week' },
  { label: '1M', days: 30, days_label: '1 Month' },
  { label: '3M', days: 90, days_label: '3 Months' },
  { label: '6M', days: 180, days_label: '6 Months' },
  { label: '1Y', days: 365, days_label: '1 Year' },
];

type RouteParams = RouteProp<MainStackParamList, 'ElderVitalHistory'>;

export default function ElderVitalHistoryScreen() {
  const route = useRoute<RouteParams>();
  const { elderId, elderName } = route.params;
  const initialType = route.params?.vitalType;

  const [filter, setFilter] = useState<VitalType | 'ALL'>(initialType ?? 'ALL');
  const [records, setRecords] = useState<VitalRecordResponse[]>([]);
  const [trendData, setTrendData] = useState<VitalRecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(1); // default to 1 month (index 1)
  const [editingVital, setEditingVital] = useState<VitalRecordResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPage = useCallback(
    async (pageNum: number, append = false) => {
      try {
        let result: Page<VitalRecordResponse>;
        if (filter === 'ALL') {
          result = await getVitalsByElder(elderId, pageNum, 20);
        } else {
          result = await getVitalsByType(elderId, filter, pageNum, 20);
        }
        setRecords(prev =>
          append ? [...prev, ...result.content] : result.content,
        );
        setHasMore(!result.last);
        setPage(pageNum);
      } catch {}
    },
    [elderId, filter],
  );

  // Fetch trend when filter is a specific type
  const fetchTrend = useCallback(async () => {
    if (filter === 'ALL') {
      setTrendData([]);
      return;
    }
    try {
      const to = new Date().toISOString();
      const days = TIME_PERIODS[selectedPeriod].days;
      const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const data = await getVitalTrend(elderId, filter, from, to);
      setTrendData(data);
    } catch {
      setTrendData([]);
    }
  }, [elderId, filter, selectedPeriod]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchPage(0), fetchTrend()]);
      setLoading(false);
    })();
  }, [fetchPage, fetchTrend]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchPage(0), fetchTrend()]);
    setRefreshing(false);
  }, [fetchPage, fetchTrend]);

  const onEndReached = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    await fetchPage(page + 1, true);
    setLoadingMore(false);
  }, [hasMore, loadingMore, page, fetchPage]);

  const handleFilterChange = (type: VitalType | 'ALL') => {
    setFilter(type);
    setRecords([]);
    setTrendData([]);
  };

  const handlePeriodChange = (periodIndex: number) => {
    setSelectedPeriod(periodIndex);
  };

  const handleEditVital = (vital: VitalRecordResponse) => {
    setEditingVital(vital);
    setModalVisible(true);
  };

  const handleEditSuccess = (updatedVital: VitalRecordResponse) => {
    // Update the records list with the updated vital
    setRecords(prev =>
      prev.map(record =>
        record.id === updatedVital.id ? updatedVital : record,
      ),
    );
    // Also update trend data if applicable
    setTrendData(prev =>
      prev.map(record =>
        record.id === updatedVital.id ? updatedVital : record,
      ),
    );
    setModalVisible(false);
    setEditingVital(null);
  };

  if (loading) return <LoadingState message={`Loading ${elderName}'s vitals…`} />;

  // Advanced chart visualization
  const renderAdvancedChart = () => {
    if (trendData.length < 2) return null;

    const values = trendData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // Limit to 7 data points for better chart visibility
    const chartData = trendData.slice(-7);
    const chartLabels = chartData.map(d =>
      new Date(d.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const chartValues = chartData.map(d => d.value);

    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - SPACING.lg * 2;

    return (
      <View style={[styles.chartContainer, SHADOW.small]}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>📊 Vital Trend</Text>
          <Text style={styles.periodLabel}>{TIME_PERIODS[selectedPeriod].days_label}</Text>
        </View>

        {/* Time Period Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
          contentContainerStyle={styles.periodSelectorContent}>
          {TIME_PERIODS.map((period, index) => (
            <TouchableOpacity
              key={period.label}
              style={[
                styles.periodButton,
                selectedPeriod === index && styles.periodButtonActive,
              ]}
              onPress={() => handlePeriodChange(index)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === index && styles.periodButtonTextActive,
                ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Chart */}
        <View style={styles.chartContent}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [
                {
                  data: chartValues,
                  color: () => COLORS.primary,
                  strokeWidth: 2,
                },
              ],
            }}
            width={chartWidth}
            height={280}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: COLORS.card,
              backgroundGradientFrom: COLORS.card,
              backgroundGradientTo: COLORS.card,
              decimalPlaces: 1,
              color: () => COLORS.subtext,
              labelColor: () => COLORS.subtext,
              style: {
                borderRadius: RADIUS.md,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: COLORS.primary,
                fill: COLORS.card,
              },
              propsForBackgroundLines: {
                strokeDasharray: '5, 5',
                stroke: COLORS.border,
                strokeWidth: 1,
              },
            }}
            bezier
            style={{
              borderRadius: RADIUS.md,
              marginVertical: SPACING.md,
            }}
          />
        </View>

        {/* Statistics */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Min</Text>
            <Text style={styles.statValue}>{min.toFixed(1)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Max</Text>
            <Text style={styles.statValue}>{max.toFixed(1)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{avg.toFixed(1)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Readings</Text>
            <Text style={styles.statValue}>{trendData.length}</Text>
          </View>
        </View>

        {/* Abnormal readings count */}
        {trendData.filter(d => d.isAbnormal).length > 0 && (
          <View style={styles.abnormalAlert}>
            <Text style={styles.abnormalText}>
              ⚠️ {trendData.filter(d => d.isAbnormal).length} abnormal reading(s) detected
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      {/* Filter chips */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_OPTIONS}
          keyExtractor={item => item.type}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                filter === item.type && styles.chipActive,
              ]}
              onPress={() => handleFilterChange(item.type)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.chipText,
                  filter === item.type && styles.chipTextActive,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={records}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderAdvancedChart}
        renderItem={({ item }) => <VitalCard vital={item} onEdit={handleEditVital} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <EmptyState
            icon="📊"
            message="No vital readings found"
            hint={`No readings for ${elderName}`}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <Text style={styles.loadingMore}>Loading more…</Text>
          ) : null
        }
      />

      <EditVitalModal
        visible={modalVisible}
        vital={editingVital}
        onClose={() => {
          setModalVisible(false);
          setEditingVital(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  filterRow: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: '#ECEFF1',
  },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.subtext },
  chipTextActive: { color: '#fff' },
  list: { padding: SPACING.md, paddingBottom: SPACING.xl },
  loadingMore: {
    textAlign: 'center',
    color: COLORS.subtext,
    fontSize: FONT_SIZE.sm,
    paddingVertical: SPACING.md,
  },
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  chartTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  periodLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  periodSelector: {
    marginBottom: SPACING.md,
  },
  periodSelectorContent: {
    gap: SPACING.xs,
    paddingRight: SPACING.md,
  },
  periodButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    minWidth: 45,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.subtext,
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  chartContent: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  abnormalAlert: {
    backgroundColor: '#FFE8E8',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  abnormalText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.danger,
    fontWeight: '600',
  },
});
