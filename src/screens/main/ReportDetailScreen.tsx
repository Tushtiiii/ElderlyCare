import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { theme } from '../../constants/theme';
import { Report } from '../../types/reports';

const ReportDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { report }: { report: Report } = route.params;

  const handleOpenFile = async () => {
    try {
      const supported = await Linking.canOpenURL(report.fileUrl);
      if (supported) {
        await Linking.openURL(report.fileUrl);
      } else {
        Alert.alert('Error', "Don't know how to open URI: " + report.fileUrl);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open the file.');
    }
  };

  const isImage = report.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Report Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{report.reportType.replace('_', ' ')}</Text>
        </View>

        <Text style={styles.sectionTitle}>Structured Medical Data</Text>
        <View style={styles.dataCard}>
          {Object.entries(report.reportData).map(([key, value]) => (
            <View key={key} style={styles.dataRow}>
              <Text style={styles.dataKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
              <Text style={styles.dataValue}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Uploaded Document</Text>
        <View style={styles.fileCard}>
          {isImage ? (
            <Image 
              source={{ uri: report.fileUrl }} 
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.pdfPreview}>
              <Ionicons name="document-text" size={64} color={theme.colors.primary} />
              <Text style={styles.fileName}>{report.fileName}</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.openButton} onPress={handleOpenFile}>
            <Ionicons name="open-outline" size={20} color="#fff" />
            <Text style={styles.openText}>Open Full File</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Uploaded by: {report.uploadedBy}</Text>
          <Text style={styles.footerText}>Date: {new Date(report.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    padding: 20,
  },
  typeBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 10,
  },
  dataCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dataKey: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  fileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
  },
  pdfPreview: {
    alignItems: 'center',
    marginBottom: 15,
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  openText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 15,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
});

export default ReportDetailScreen;
