import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as labReportApi from '../../api/labReports';
import * as relationshipApi from '../../api/relationships';
import ErrorState from '../../components/common/ErrorState';
import LabReportCard from '../../components/common/LabReportCard';
import LoadingState from '../../components/common/LoadingState';
import SummaryCard from '../../components/common/SummaryCard';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../theme';
import { LabReportResponse, MainStackParamList, RelationshipResponse, UserResponse } from '../../types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function PathologistDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [patients, setPatients] = useState<UserResponse[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserResponse | null>(null);
  const [labReports, setLabReports] = useState<LabReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      const relationships: RelationshipResponse[] = await relationshipApi.getMyElders();
      const patientList = relationships.map(rel => rel.elder);
      setPatients(patientList);
      
      if (patientList.length > 0 && !selectedPatient) {
        setSelectedPatient(patientList[0]);
      }
    } catch (err) {
      console.error('Fetch patients error:', err);
      setError('Failed to load linked patients.');
    }
  }, [selectedPatient]);

  const fetchReports = useCallback(async (patientId: string) => {
    try {
      const reports = await labReportApi.getLatestLabReports(patientId);
      setLabReports(reports);
    } catch (err) {
      console.error('Fetch reports error:', err);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetchPatients();
    setLoading(false);
  }, [fetchPatients]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchReports(selectedPatient.id);
    }
  }, [selectedPatient, fetchReports]);

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
      if (selectedPatient) {
        fetchReports(selectedPatient.id);
      }
    }, [fetchPatients, fetchReports, selectedPatient]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatients();
    if (selectedPatient) {
      await fetchReports(selectedPatient.id);
    }
    setRefreshing(false);
  };

  const handleAddReport = () => {
    if (!selectedPatient) {
      Alert.alert('Selection Required', 'Please select a patient first.');
      return;
    }
    navigation.navigate('AddLabReport', { elderId: selectedPatient.id });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Pathologist Dashboard</Text>
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('RequestConnection')}
        >
          <Text style={styles.linkButtonText}>+ Link New Patient</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.patientSelector}>
        <Text style={styles.sectionTitle}>Select Patient</Text>
        <FlatList
          horizontal
          data={patients}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.patientList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.patientCard}
              onPress={() => setSelectedPatient(item)}
            >
              <View style={[
                styles.avatar,
                { backgroundColor: selectedPatient?.id === item.id ? COLORS.primary : COLORS.border }
              ]}>
                <Text style={styles.avatarText}>{item.name ? item.name.charAt(0) : '?'}</Text>
              </View>
              <Text 
                 numberOfLines={1} 
                 style={[
                   styles.patientName,
                   selectedPatient?.id === item.id && styles.patientNameActive
                 ]}
              >
                {item.name ? item.name.split(' ')[0] : 'Unknown'}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No patients linked yet.</Text>
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {selectedPatient ? (
          <>
            <View style={styles.statsRow}>
              <SummaryCard
                icon="📄"
                title="Total Reports"
                value={labReports.length}
                style={styles.statCard}
              />
              <SummaryCard
                icon="🔬"
                title="Tests Tracked"
                value={new Set(labReports.map(r => r.testName)).size}
                style={styles.statCard}
              />
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Submit report for:</Text>
                <Text style={styles.selectedPatientText}>{selectedPatient.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddReport}
              >
                <Text style={styles.addButtonText}>Upload Report</Text>
              </TouchableOpacity>
            </View>

            {labReports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyResultsText}>No lab reports found for this patient.</Text>
                <TouchableOpacity style={styles.outlineButton} onPress={handleAddReport}>
                  <Text style={styles.outlineButtonText}>Upload First Report</Text>
                </TouchableOpacity>
              </View>
            ) : (
              labReports.map(report => (
                <LabReportCard
                  key={report.id}
                  report={report}
                />
              ))
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Welcome back!</Text>
            <Text style={styles.emptySub}>Select a patient from the list above to view or upload lab reports.</Text>
            <TouchableOpacity 
              style={styles.bigLinkButton}
              onPress={() => navigation.navigate('RequestConnection')}
            >
              <Text style={styles.bigLinkButtonText}>Link a Patient with Care Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: 60,
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  welcomeText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  linkButton: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  linkButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZE.sm,
  },
  patientSelector: {
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  selectedPatientText: {
    paddingHorizontal: SPACING.lg,
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  patientList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  patientCard: {
    alignItems: 'center',
    width: 70,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: {
    color: COLORS.card,
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
  patientName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    textAlign: 'center',
  },
  patientNameActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    backgroundColor: COLORS.card,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  addButtonText: {
    color: COLORS.card,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.subtext,
    fontStyle: 'italic',
    paddingLeft: SPACING.lg,
  },
  emptyResultsText: {
    color: COLORS.subtext,
    marginBottom: SPACING.md,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
  },
  emptySub: {
    fontSize: FONT_SIZE.md,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  bigLinkButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  bigLinkButtonText: {
    color: COLORS.card,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
});