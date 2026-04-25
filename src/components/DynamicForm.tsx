import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';
import { ReportField, ReportSchema } from '../types/reports';

interface DynamicFormProps {
  schema: ReportSchema;
  formData: Record<string, string | number>;
  onFormChange: (name: string, value: string | number) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, formData, onFormChange }) => {
  const renderField = (field: ReportField) => {
    return (
      <View key={field.name} style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Text>
          {field.unit && <Text style={styles.unit}>{field.unit}</Text>}
        </View>
        <TextInput
          style={styles.input}
          value={formData[field.name]?.toString() || ''}
          onChangeText={(text) => {
            const val = field.type === 'number' ? (text === '' ? '' : parseFloat(text)) : text;
            onFormChange(field.name, val as any);
          }}
          keyboardType={field.type === 'number' ? 'numeric' : 'default'}
          placeholder={`Enter ${field.name}...`}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report Details: {schema.reportType}</Text>
      {schema.fields.map(renderField)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.colors.text,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  unit: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: '#fff',
  },
});

export default DynamicForm;
