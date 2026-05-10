import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../types';
import { COLORS, FONT_SIZE, RADIUS, SPACING, SHADOW } from '../../theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      // Navigation handled automatically by AppNavigator (token becomes non-null)
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        'Invalid email or password. Please try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
      // Navigation handled automatically by AppNavigator (token becomes non-null)
    } catch (err: any) {
      console.error('[LoginScreen] Google login error:', err);
      const msg = 'Google Sign-in failed. Please try again.';
      Alert.alert('Sign-in Failed', msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>🏥 Elderly Care</Text>
          <Text style={styles.subtitle}>
            Connecting families for safer living
          </Text>
        </View>

        {/* Card */}
        <View style={[styles.card, SHADOW.medium]}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.hint}>Sign in to your account</Text>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.disabled}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.disabled}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(v => !v)}>
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
            onPress={handleGoogleLogin}
            disabled={googleLoading}
            activeOpacity={0.8}>
            {googleLoading ? (
              <ActivityIndicator color="#1F2937" />
            ) : (
              <>
                <Text style={styles.googleBtnIcon}>🔐</Text>
                <Text style={styles.googleBtnText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.linkRow}>
            <Text style={styles.linkText}>
              Don't have an account?{' '}
              <Text style={styles.linkAccent}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  appTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.primary },
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
    marginBottom: SPACING.lg,
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
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: Platform.OS === 'ios' ? 12 : 10,
  },
  eyeText: { fontSize: 18 },

  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    fontWeight: '600',
  },

  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  googleBtnIcon: {
    fontSize: 18,
  },
  googleBtnText: {
    color: '#1F2937',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },

  linkRow: { alignItems: 'center', marginTop: SPACING.md },
  linkText: { fontSize: FONT_SIZE.sm, color: COLORS.subtext },
  linkAccent: { color: COLORS.primary, fontWeight: '700' },
});
