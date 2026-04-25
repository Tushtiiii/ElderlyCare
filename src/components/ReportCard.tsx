import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/theme';
import { Report } from '../types/reports';

interface ReportCardProps {
  report: Report;
  onPress: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(report)}>
      <View style={styles.iconContainer}>
        <Ionicons name="document-text-outline" size={32} color={theme.colors.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.reportType}>{report.reportType.replace('_', ' ')}</Text>
          <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
        </View>
        <Text style={styles.info}>Uploaded by: {report.uploadedBy}</Text>
        <Text style={styles.fileName} numberOfLines={1}>{report.fileName}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.border} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  info: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  fileName: {
    fontSize: 13,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },
});

export default ReportCard;
