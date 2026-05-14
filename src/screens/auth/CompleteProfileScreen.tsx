import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { AuthStackParamList, Role } from '../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'CompleteProfile'>;

export default function CompleteProfileScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const { idToken } = (route.params ?? {}) as AuthStackParamList['CompleteProfile'];
  const { googleRegister } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const onDobChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDobPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      setDateOfBirth(`${y}-${m}-${d}`);
    }
  };

  const handleCompleteProfile = async () => {
    if (!idToken) {
      Alert.alert('Missing session', 'Please try Google Sign-In again.');
      navigation.navigate('Login');
      return;
    }
    if (!role) {
      Alert.alert('Missing role', 'Please choose a role to continue.');
      return;
    }
    if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      Alert.alert('Invalid date', 'Date of birth must be in YYYY-MM-DD format.');
      return;
    }

    setLoading(true);
    try {
      await googleRegister({
        idToken,
        role,
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
      });
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const msgs = Object.values(errors).join('\n');
        Alert.alert('Validation Error', msgs);
      } else {
        const msg =
          err?.response?.data?.detail ??
          err?.response?.data?.message ??
          'Registration failed. Please try again.';
        Alert.alert('Registration Failed', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.appTitle}>🏥 Elderly Care</Text>
          <Text style={styles.subtitle}>Complete your profile</Text>
        </View>

        <View style={[styles.card, SHADOW.medium]}>
          <Text style={styles.title}>Almost there</Text>
          <Text style={styles.hint}>
            Choose your role and add any optional details.
          </Text>

          <Text style={styles.label}>I am a…</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'ELDER' && styles.roleBtnActive]}
              onPress={() => setRole('ELDER')}
              activeOpacity={0.8}>
              <Text style={styles.roleIcon}>👴</Text>
              <Text
                style={[
                  styles.roleLabel,
                  role === 'ELDER' && styles.roleLabelActive,
                ]}>
                Elder
              </Text>
              <Text
                style={[
                  styles.roleDesc,
                  role === 'ELDER' && styles.roleDescActive,
                ]}>
                Being monitored
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'CHILD' && styles.roleBtnActive]}
              onPress={() => setRole('CHILD')}
              activeOpacity={0.8}>
              <Text style={styles.roleIcon}>👨‍👩‍👦</Text>
              <Text
                style={[
                  styles.roleLabel,
                  role === 'CHILD' && styles.roleLabelActive,
                ]}>
                Guardian
              </Text>
              <Text
                style={[
                  styles.roleDesc,
                  role === 'CHILD' && styles.roleDescActive,
                ]}>
                Monitoring an elder
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'DOCTOR' && styles.roleBtnActive]}
              onPress={() => setRole('DOCTOR')}
              activeOpacity={0.8}>
              <Text style={styles.roleIcon}>👨‍⚕️</Text>
              <Text
                style={[
                  styles.roleLabel,
                  role === 'DOCTOR' && styles.roleLabelActive,
                ]}>
                Doctor
              </Text>
              <Text
                style={[
                  styles.roleDesc,
                  role === 'DOCTOR' && styles.roleDescActive,
                ]}>
                Reviewing reports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === 'PATHOLOGIST' && styles.roleBtnActive,
              ]}
              onPress={() => setRole('PATHOLOGIST')}
              activeOpacity={0.8}>
              <Text style={styles.roleIcon}>🔬</Text>
              <Text
                style={[
                  styles.roleLabel,
                  role === 'PATHOLOGIST' && styles.roleLabelActive,
                ]}>
                Pathologist
              </Text>
              <Text
                style={[
                  styles.roleDesc,
                  role === 'PATHOLOGIST' && styles.roleDescActive,
                ]}>
                Uploading tests
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Name (optional)</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Jane Smith"
            placeholderTextColor={COLORS.disabled}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>Phone Number (optional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+1234567890"
            placeholderTextColor={COLORS.disabled}
            keyboardType="phone-pad"
            returnKeyType="next"
          />

          <Text style={styles.label}>Date of Birth (optional)</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDobPicker(true)}
            activeOpacity={0.8}>
            <Text style={dateOfBirth ? styles.inputText : styles.placeholderText}>
              {dateOfBirth || 'Select date'}
            </Text>
          </TouchableOpacity>
          {showDobPicker && (
            <DateTimePicker
              value={dateOfBirth ? new Date(dateOfBirth + 'T00:00:00') : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDobChange}
              maximumDate={new Date()}
            />
          )}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleCompleteProfile}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Finish Google Sign-Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Back to{' '}
              <Text style={styles.linkAccent}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: SPACING.lg, paddingBottom: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.lg, marginTop: SPACING.md },
  appTitle: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.subtext, marginTop: SPACING.xs },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  hint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.subtext,
    marginBottom: SPACING.md,
  },

  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : 10,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    backgroundColor: '#F8FAFC',
  },

  // Role selector
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  roleBtn: {
    width: '47%',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  roleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E3F2FD',
  },
  roleIcon: { fontSize: 28, marginBottom: 4 },
  roleLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.subtext,
  },
  roleLabelActive: { color: COLORS.primary },
  roleDesc: { fontSize: FONT_SIZE.xs, color: COLORS.disabled, textAlign: 'center', marginTop: 2 },
  roleDescActive: { color: COLORS.primaryLight },

  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },

  linkRow: { alignItems: 'center', marginTop: SPACING.md },
  linkText: { fontSize: FONT_SIZE.sm, color: COLORS.subtext },
  linkAccent: { color: COLORS.primary, fontWeight: '700' },
  inputText: { fontSize: FONT_SIZE.md, color: COLORS.text },
  placeholderText: { fontSize: FONT_SIZE.md, color: COLORS.disabled },
});
