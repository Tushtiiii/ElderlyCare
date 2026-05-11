import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
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
// import { sendOtp, verifyOtp } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { AuthStackParamList, Role } from '../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  
  const navigation = useNavigation<Nav>();
  const { register, googleRegister } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  // OTP States
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const otpTimerRef = useRef<NodeJS.Timeout>();
  const [otpError, setOtpError] = useState('');

  // Debounce timers
  const nameTimer = useRef<NodeJS.Timeout>();
  const emailTimer = useRef<NodeJS.Timeout>();
  const phoneTimer = useRef<NodeJS.Timeout>();
  const passwordTimer = useRef<NodeJS.Timeout>();

  // Debounced validation for name
  useEffect(() => {
    if (nameTimer.current) clearTimeout(nameTimer.current);
    
    nameTimer.current = setTimeout(() => {
      if (name.trim()) {
        const error = validateName(name);
        setErrors(prev => ({...prev, name: error}));
      }
    }, 500);

    return () => {
      if (nameTimer.current) clearTimeout(nameTimer.current);
    };
  }, [name]);

  // Debounced validation for email
  useEffect(() => {
    if (emailTimer.current) clearTimeout(emailTimer.current);
    
    emailTimer.current = setTimeout(() => {
      if (email.trim()) {
        const error = validateEmail(email);
        setErrors(prev => ({...prev, email: error}));
      }
    }, 500);

    return () => {
      if (emailTimer.current) clearTimeout(emailTimer.current);
    };
  }, [email]);

  // Debounced validation for phone
  useEffect(() => {
    if (phoneTimer.current) clearTimeout(phoneTimer.current);
    
    phoneTimer.current = setTimeout(() => {
      if (phone.trim()) {
        const error = validatePhone(phone);
        setErrors(prev => ({...prev, phone: error}));
      }
    }, 500);

    return () => {
      if (phoneTimer.current) clearTimeout(phoneTimer.current);
    };
  }, [phone]);

  // Debounced validation for password
  useEffect(() => {
    if (passwordTimer.current) clearTimeout(passwordTimer.current);
    
    passwordTimer.current = setTimeout(() => {
      if (password) {
        const error = validatePassword(password);
        setErrors(prev => ({...prev, password: error}));
      }
    }, 500);

    return () => {
      if (passwordTimer.current) clearTimeout(passwordTimer.current);
    };
  }, [password]);

  const onDobChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDobPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      setDateOfBirth(`${y}-${m}-${d}`);
    }
  };

  // Validation functions
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 3) {
      return 'Name must be at least 3 letters';
    }
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    if (!value.trim()) {
      return undefined; // Phone is optional
    }
    const phoneRegex = /^\d{10}$/;
    const digitsOnly = value.replace(/\D/g, '');
    if (!phoneRegex.test(digitsOnly)) {
      return 'Phone number must be exactly 10 digits';
    }
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    newErrors.name = validateName(name);
    newErrors.email = validateEmail(email);
    newErrors.phone = validatePhone(phone);
    newErrors.password = validatePassword(password);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleRegister = async () => {
    // TODO: OTP verification commented out for now
    // if (!emailVerified) {
    //   Alert.alert('Email Not Verified', 'Please verify your email with OTP first.');
    //   return;
    // }

    if (!validateForm()) {
      return;
    }
    
    if (!role) {
      Alert.alert('Missing Role', 'Please select a role.');
      return;
    }

    if (
      dateOfBirth &&
      !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
    ) {
      Alert.alert(
        'Invalid date',
        'Date of birth must be in YYYY-MM-DD format.',
      );
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
        role,
        dateOfBirth: dateOfBirth || undefined,
      });
      // AppNavigator picks up the new token automatically
    } catch (err: any) {
      console.error('[RegisterScreen] registration error:', err);
      if (err?.response) {
        console.error('[RegisterScreen] response status:', err.response.status);
        console.error('[RegisterScreen] response data:', JSON.stringify(err.response.data));
      }
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

  const handleGoogleRegister = async () => {
    if (!role) {
      Alert.alert('Missing Role', 'Please select a role first.');
      return;
    }

    setGoogleLoading(true);
    try {
      await googleRegister();
      // AppNavigator picks up the new token automatically
    } catch (err: any) {
      console.error('[RegisterScreen] Google registration error:', err);
      const msg = 'Google Sign-up failed. Please try again.';
      Alert.alert('Sign-up Failed', msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      Alert.alert('Invalid Email', emailError);
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    try {
      await sendOtp({ email: email.trim().toLowerCase() });
      setShowOtpInput(true);
      setOtpTimer(300); // 5 minutes
      
      // Start countdown timer
      otpTimerRef.current = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            if (otpTimerRef.current) clearInterval(otpTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert('OTP Sent', 'Check your email for the verification code');
    } catch (err: any) {
      console.error('[RegisterScreen] send OTP error:', err);
      const msg = err?.response?.data?.message || 'Failed to send OTP. Please try again.';
      setOtpError(msg);
      Alert.alert('Error', msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    try {
      await verifyOtp({ email: email.trim().toLowerCase(), otp: otp.trim() });
      setEmailVerified(true);
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
      Alert.alert('Success', 'Email verified successfully!');
    } catch (err: any) {
      console.error('[RegisterScreen] verify OTP error:', err);
      const msg = err?.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(msg);
      Alert.alert('Error', msg);
    } finally {
      setOtpLoading(false);
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
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, SHADOW.medium]}>
          <Text style={styles.title}>Register</Text>

          {/* Role Selector */}
          <Text style={styles.label}>I am a…</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === 'ELDER' && styles.roleBtnActive,
              ]}
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
              style={[
                styles.roleBtn,
                role === 'CHILD' && styles.roleBtnActive,
              ]}
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

            {/* Doctor */}
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === 'DOCTOR' && styles.roleBtnActive,
              ]}
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

            {/* Pathologist */}
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

          {/* Name */}
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Jane Smith"
            placeholderTextColor={COLORS.disabled}
            autoCapitalize="words"
            returnKeyType="next"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          {/* Email */}
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.disabled}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          {/* OTP Send button commented out for now */}
          {/* {!emailVerified && (
            <TouchableOpacity
              style={[styles.otpBtn, otpLoading && styles.btnDisabled]}
              onPress={handleSendOtp}
              disabled={otpLoading || !email.trim() || !!errors.email}
              activeOpacity={0.8}>
              <Text style={styles.otpBtnText}>{otpLoading ? '...' : 'Send OTP'}</Text>
            </TouchableOpacity>
          )} */}
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* OTP Input - Commented out for now */}
          {/* {showOtpInput && !emailVerified && (
            <>
              <Text style={styles.label}>Verification Code</Text>
              <View style={styles.otpContainer}>
                <TextInput
                  style={[styles.input, styles.otpInput, otpError && styles.inputError]}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="000000"
                  placeholderTextColor={COLORS.disabled}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.verifyBtn, otpLoading && styles.btnDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={otpLoading || !otp.trim()}
                  activeOpacity={0.8}>
                  <Text style={styles.verifyBtnText}>{otpLoading ? 'Verifying...' : 'Verify'}</Text>
                </TouchableOpacity>
              </View>
              {otpError && <Text style={styles.errorText}>{otpError}</Text>}
              {otpTimer > 0 && (
                <Text style={styles.timerText}>Expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</Text>
              )}
              {otpTimer === 0 && showOtpInput && !emailVerified && (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </>
          )} */}

          {/* Password */}
          <Text style={styles.label}>Password * (min 8 chars)</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.disabled}
              secureTextEntry={!showPassword}
              returnKeyType="next"
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(v => !v)}>
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Phone */}
          <Text style={styles.label}>Phone Number (optional)</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={phone}
            onChangeText={setPhone}
            placeholder="+1234567890"
            placeholderTextColor={COLORS.disabled}
            keyboardType="phone-pad"
            returnKeyType="next"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Date of Birth */}
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

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-Up Button */}
          <TouchableOpacity
            style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
            onPress={handleGoogleRegister}
            disabled={googleLoading}
            activeOpacity={0.8}>
            {googleLoading ? (
              <ActivityIndicator color="#1F2937" />
            ) : (
              <>
                <Text style={styles.googleBtnIcon}>🔐</Text>
                <Text style={styles.googleBtnText}>Sign up with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.linkRow}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
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
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  inputSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  errorText: {
    color: '#EF4444',
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  emailRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  emailInput: {
    flex: 1,
  },
  otpBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBtnText: {
    color: '#fff',
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  otpInput: {
    flex: 1,
    letterSpacing: 8,
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  verifyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  timerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.subtext,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  resendText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeBtn: { position: 'absolute', right: 12, top: Platform.OS === 'ios' ? 12 : 10 },
  eyeText: { fontSize: 18 },

  // Role selector
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
    justifyContent: 'space-between',
  },
  roleBtn: {
    width: '46.5%',
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
  inputText: { fontSize: FONT_SIZE.md, color: COLORS.text },
  placeholderText: { fontSize: FONT_SIZE.md, color: COLORS.disabled },
});
