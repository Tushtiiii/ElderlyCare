import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/theme';

interface FileUploadComponentProps {
  onFileSelect: (file: DocumentPicker.DocumentPickerResult | null) => void;
  selectedFile: DocumentPicker.DocumentPickerResult | null;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ 
  onFileSelect, 
  selectedFile 
}) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        onFileSelect(result);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const clearSelection = () => {
    onFileSelect(null);
  };

  const getFileName = () => {
    if (selectedFile && !selectedFile.canceled) {
      return selectedFile.assets[0].name;
    }
    return 'No file selected';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Report Document (PDF or Image)</Text>
      <View style={styles.uploadArea}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.buttonText}>
            {selectedFile && !selectedFile.canceled ? 'Change File' : 'Choose File'}
          </Text>
        </TouchableOpacity>
        
        {selectedFile && !selectedFile.canceled && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{getFileName()}</Text>
            <TouchableOpacity onPress={clearSelection}>
              <Ionicons name="close-circle" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  uploadArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    marginLeft: 8,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default FileUploadComponent;
