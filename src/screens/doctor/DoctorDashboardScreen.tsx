import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { getMyElders } from '../../api/relationships';
import { theme } from '../../constants/theme';
import { MainStackParamList, RelationshipResponse } from '../../types';

type Nav = NativeStackNavigationProp<MainStackParamList>;

const DoctorDashboardScreen = () => {
  const [elders, setElders] = useState<{ label: string; value: string }[]>([]);
  const [selectedElder, setSelectedElder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<Nav>();

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
      Alert.alert('Error', 'Failed to load linked elders');
    } finally {
      setLoading(false);
    }
  };

  const handleElderChange = (value: string) => {
    setSelectedElder(value);
  };

  const handleOpenOverview = () => {
    if (!selectedElder) {
      Alert.alert('Select elder', 'Please select an elder first.');
      return;
    }

    const match = elders.find(e => e.value === selectedElder);
    const elderName = match?.label ?? 'Elder';

    navigation.navigate('ElderDetail', {
      elderId: selectedElder,
      elderName,
    });
  };

  if (loading && !elders.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Doctor Dashboard</Text>
        <Text style={styles.subtitle}>Select an elder to view their reports</Text>
      </View>

      <View style={styles.selectionView}>
        <Text style={styles.label}>Patient Selection</Text>
        <RNPickerSelect
          onValueChange={handleElderChange}
          items={elders}
          placeholder={{ label: 'Select patient...', value: null }}
          style={pickerStyles}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.helperText}>
          Once you select a linked elder, you can open their full health
          overview (vitals, medications, alerts, and lab reports).
        </Text>

        <TouchableOpacity
          style={styles.openButton}
          onPress={handleOpenOverview}
          activeOpacity={0.8}
        >
          <Text style={styles.openButtonText}>Open Elder Overview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  selectionView: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  helperText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  openButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

export default DoctorDashboardScreen;
