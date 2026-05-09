import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { LabReportResponse } from '../../types';

interface Props {
  report: LabReportResponse;
}

export default function LabReportCard({ report }: Props) {
  const handleOpenFile = () => {
    if (report.fileUrl) {
      Linking.openURL(report.fileUrl).catch(() => {});
    }
  };

  return (
    <View style={[styles.card, SHADOW.small]}>
      <View style={styles.row}>
        <Text style={styles.icon}>🧪</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{report.testName}</Text>
          <Text style={styles.result}>Result: {report.result}</Text>
          <Text style={styles.date}>
            📅 {new Date(report.testDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          {report.notes && (
            <Text style={styles.notes}>📝 {report.notes}</Text>
          )}
          {report.prescription && (
            <Text style={styles.prescription}>💊 Prescription: {report.prescription}</Text>
          )}
        </View>
      </View>
      {report.fileUrl && (
        <TouchableOpacity
          style={styles.fileBtn}
          onPress={handleOpenFile}
          activeOpacity={0.7}>
          <Text style={styles.fileBtnText}>📄 View Report File</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { fontSize: 28, marginRight: SPACING.sm, marginTop: 2 },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  result: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  date: { fontSize: FONT_SIZE.xs, color: COLORS.subtext, marginTop: 2 },
  notes: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    fontStyle: 'italic',
    marginTop: 4,
  },
  prescription: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    marginTop: 4,
    fontWeight: '600',
  },
  fileBtn: {
    backgroundColor: '#E3F2FD',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  fileBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
