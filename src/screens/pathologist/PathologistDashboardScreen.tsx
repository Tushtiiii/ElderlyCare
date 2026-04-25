import { DocumentPickerResult } from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { getMyElders } from '../../api/relationships';
import { reportApi } from '../../api/reports';
import DynamicForm from '../../components/DynamicForm';
import FileUploadComponent from '../../components/FileUploadComponent';
import { theme } from '../../constants/theme';
import { RelationshipResponse } from '../../types';
import { Report, ReportSchema } from '../../types/reports';

const PathologistDashboardScreen = () => {
  const [elders, setElders] = useState<{ label: string; value: string }[]>([]);
  const [selectedElder, setSelectedElder] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string | null>(null);
  const [schema, setSchema] = useState<ReportSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  const reportTypes = [
    { label: 'Blood Test', value: 'BLOOD_TEST' },
    { label: 'ECG', value: 'ECG' },
    { label: 'X-Ray', value: 'X_RAY' },
    { label: 'Urine Test', value: 'URINE_TEST' },
  ];

  useEffect(() => {
    fetchElders();
  }, []);

  const fetchElders = async () => {
    setLoading(true);
    try {
      const data = await getMyElders();
      const formattedElders = data.map((rel: RelationshipResponse) => ({
        label: rel.elder.name,
        value: rel.elder.id,
      }));
      setElders(formattedElders);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch elders');
    } finally {
      setLoading(false);
    }
  };

  const handleReportTypeChange = async (value: string, initialData?: Record<string, string | number>) => {
    setReportType(value);
    if (!value) {
      setSchema(null);
      setFormData({});
      return;
    }

    setLoading(true);
    try {
      const reportSchema = await reportApi.getReportSchema(value);
      setSchema(reportSchema);
      setFormData(initialData ?? {});
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch report schema');
      setSchema(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadReportHistory = async (elderId: string) => {
    setHistoryLoading(true);
    try {
      const data = await reportApi.getReportsForElder(elderId);
      setReports(data);
    } catch {
      Alert.alert('Error', 'Failed to load report history');
      setReports([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedElder || !reportType || !selectedFile || selectedFile.canceled) {
      Alert.alert('Error', 'Please fill all fields and select a file');
      return;
    }

    // Basic client-side validation based on schema (if provided)
    if (schema) {
      for (const field of schema.fields) {
        const raw = formData[field.name];
        const label = field.label || field.name;

        if (field.required && (raw === undefined || raw === null || raw === '')) {
          Alert.alert('Validation Error', `Please enter ${label}.`);
          return;
        }

        if (field.type === 'number') {
          const num = typeof raw === 'number' ? raw : parseFloat(String(raw ?? ''));
          if (isNaN(num)) {
            Alert.alert('Validation Error', `${label} must be a number.`);
            return;
          }
          if (field.min !== undefined && num < field.min) {
            Alert.alert('Validation Error', `${label} should be at least ${field.min}.`);
            return;
          }
          if (field.max !== undefined && num > field.max) {
            Alert.alert('Validation Error', `${label} should be at most ${field.max}.`);
            return;
          }
        }
      }
    }

    setUploading(true);
    try {
      await reportApi.uploadReport({
        elderId: selectedElder,
        reportType,
        reportData: formData,
        file: selectedFile.assets[0],
      });
      Alert.alert('Success', 'Report uploaded successfully');
      // Reset form
      setReportType(null);
      setSchema(null);
      setFormData({});
      setSelectedFile(null);
      await loadReportHistory(selectedElder);
    } catch (error: any) {
      Alert.alert('Upload Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !elders.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pathologist Dashboard</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Select Elder</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            setSelectedElder(value);
            if (value) {
              loadReportHistory(value);
            } else {
              setReports([]);
            }
          }}
          items={elders}
          placeholder={{ label: 'Select an elder...', value: null }}
          style={pickerStyles}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Report Type</Text>
        <RNPickerSelect
          onValueChange={value => handleReportTypeChange(value)}
          items={reportTypes}
          placeholder={{ label: 'Select report type...', value: null }}
          style={pickerStyles}
        />
      </View>

      {loading && reportType && (
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
      )}

      {schema && (
        <DynamicForm 
          schema={schema} 
          formData={formData} 
          onFormChange={handleFormChange} 
        />
      )}

      <FileUploadComponent 
        onFileSelect={setSelectedFile} 
        selectedFile={selectedFile} 
      />

      <TouchableOpacity 
        style={[styles.submitButton, (!selectedElder || !reportType || uploading) && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Upload Report</Text>
        )}
      </TouchableOpacity>

      {/* Report History */}
      <View style={[styles.section, { marginTop: 32 }] }>
        <Text style={styles.label}>Report History</Text>
        {!selectedElder && (
          <Text style={styles.historyHint}>Select an elder to view their reports.</Text>
        )}
        {selectedElder && historyLoading && (
          <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 16 }} />
        )}
        {selectedElder && !historyLoading && reports.length === 0 && (
          <Text style={styles.historyHint}>No reports uploaded yet for this elder.</Text>
        )}
        {selectedElder && !historyLoading && reports.map(report => (
          <TouchableOpacity
            key={report.id}
            style={styles.historyItem}
            activeOpacity={0.8}
            onPress={() => handleReportTypeChange(report.reportType, report.reportData)}>
            <Text style={styles.historyTitle}>{report.reportType}</Text>
            <Text style={styles.historyMeta}>
              Uploaded by {report.uploadedBy} on {new Date(report.createdAt).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    color: theme.colors.text,
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    color: theme.colors.text,
    paddingRight: 30,
    backgroundColor: '#fff',
  },
};

export default PathologistDashboardScreen;
