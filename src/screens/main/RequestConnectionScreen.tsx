import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { getMyElders, requestRelationship, requestRelationshipByCode } from '../../api/relationships';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from '../../theme';
import { RelationshipResponse } from '../../types';

export default function RequestConnectionScreen() {
  const { user } = useAuth();
  const isElder = user?.role === 'ELDER';

  const [targetEmail, setTargetEmail] = useState('');
  const [careCode, setCareCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RelationshipResponse | null>(null);

  const handleConnectByEmail = async () => {
    if (!targetEmail.trim()) {
      Alert.alert('Missing Email', 'Please enter the email address to connect with.');
      return;
    }
    if (targetEmail.trim().toLowerCase() === user?.email) {
      Alert.alert('Invalid', 'You cannot send a request to yourself.');
      return;
    }

    setLoading(true);
    try {
      if (!isElder) {
        const linked = await getMyElders();
        const alreadyLinked = linked.some(
          rel => rel.elder.email.toLowerCase() === targetEmail.trim().toLowerCase(),
        );
        if (alreadyLinked) {
          Alert.alert('Already Connected', 'This elder is already linked to your account.');
          return;
        }
      }

      const res = await requestRelationship({
        targetEmail: targetEmail.trim().toLowerCase(),
      });
      setResult(res);
      setTargetEmail('');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        Alert.alert('Already Connected', 'This relationship already exists.');
        return;
      }

      const msg =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        'Failed to connect. Make sure the email is registered and has the correct role.';
      Alert.alert('Connection Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectByCode = async () => {
    const normalizedCode = careCode.trim();

    if (!normalizedCode) {
      Alert.alert('Missing Care Code', 'Please enter the elder care code.');
      return;
    }

    setLoading(true);
    try {
      const linked = await getMyElders();
      const alreadyLinked = linked.some(
        rel => rel.elder.id.toLowerCase() === normalizedCode.toLowerCase(),
      );
      if (alreadyLinked) {
        setCareCode('');
        Alert.alert('Already Connected', 'This elder is already linked to your account.');
        return;
      }

      const res = await requestRelationshipByCode(normalizedCode);
      setResult(res);
      setCareCode('');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        Alert.alert('Already Connected', 'This elder is already linked to your account.');
        return;
      }

      const msg =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        'Failed to connect. Make sure the code is correct and belongs to an elder.';
      Alert.alert('Connection Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setResult(null);
    setTargetEmail('');
    setCareCode('');
  };

  const targetRoleLabel = isElder ? 'Guardian (CHILD account)' : 'Elder (ELDER account)';
  const targetRoleEmoji = isElder ? '👨‍👩‍👦' : '👴';

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">

      {/* Info Banner */}
      <View style={[styles.infoBanner, SHADOW.small]}>
        <Text style={styles.infoBannerIcon}>{targetRoleEmoji}</Text>
        <View style={styles.infoBannerText}>
          <Text style={styles.infoBannerTitle}>
            {isElder ? 'Add a Guardian' : 'Add an Elder to Monitor'}
          </Text>
          <Text style={styles.infoBannerDesc}>
            {isElder
              ? 'Enter the email of a Guardian (CHILD account) to connect immediately.'
              : 'Enter the email of an Elder to connect immediately.'}
          </Text>
        </View>
      </View>

      {result === null ? (
        /* ── Send Form ───────────────────────────────────────────────────── */
        <View style={[styles.card, SHADOW.medium]}>
          <Text style={styles.cardTitle}>Create Connection</Text>

          <Text style={styles.label}>
            {targetRoleEmoji} Email of {targetRoleLabel}
          </Text>
          <TextInput
            style={styles.input}
            value={targetEmail}
            onChangeText={setTargetEmail}
            placeholder="their@email.com"
            placeholderTextColor={COLORS.disabled}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={handleConnectByEmail}
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleConnectByEmail}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Connect Now</Text>
            )}
          </TouchableOpacity>

          {!isElder && (
            <>
              <View style={styles.divider} />
              <Text style={styles.label}>Or use elder care code</Text>
              <TextInput
                style={styles.input}
                value={careCode}
                onChangeText={setCareCode}
                placeholder="Paste elder care code (UUID)"
                placeholderTextColor={COLORS.disabled}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={handleConnectByCode}
              />
              <TouchableOpacity
                style={[styles.btnSecondary, loading && styles.btnDisabled]}
                onPress={handleConnectByCode}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <Text style={styles.btnSecondaryText}>Connect via Care Code</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              ℹ️ Connections are created immediately. The elder shares their
              care code from their dashboard; guardians, doctors, and
              pathologists can use that code here for direct access.
            </Text>
          </View>
        </View>
      ) : (
        /* ── Success State ─────────────────────────────────────────────── */
        <View style={[styles.card, SHADOW.medium]}>
          <View style={styles.successHeader}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>Connected!</Text>
          </View>

          <Text style={styles.successDesc}>
            You are now linked with{' '}
            <Text style={styles.pendingBold}>
              {isElder ? result.child.name : result.elder.name}
            </Text>
            . Access is active immediately.
          </Text>

          {/* Relationship ID display */}
          <View style={styles.idBox}>
            <Text style={styles.idLabel}>Relationship ID (long-press to copy)</Text>
            <Text selectable style={styles.idValue}>{result.id}</Text>
          </View>

          {/* Summary */}
          <View style={styles.summaryBox}>
            <Row label="Elder" value={result.elder.name} sub={result.elder.email} />
            <Row label="Guardian" value={result.child.name} sub={result.child.email} />
            <Row
              label="Status"
              value={result.status}
              valueStyle={{ color: COLORS.accent, fontWeight: '700' }}
            />
          </View>

          <TouchableOpacity
            style={styles.newBtn}
            onPress={handleNewRequest}
            activeOpacity={0.8}>
            <Text style={styles.newBtnText}>Create Another Connection</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function Row({
  label,
  value,
  sub,
  valueStyle,
}: {
  label: string;
  value: string;
  sub?: string;
  valueStyle?: object;
}) {
  return (
    <View style={rowStyles.container}>
      <Text style={rowStyles.label}>{label}</Text>
      <View>
        <Text style={[rowStyles.value, valueStyle]}>{value}</Text>
        {sub && <Text style={rowStyles.sub}>{sub}</Text>}
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: { fontSize: FONT_SIZE.sm, color: COLORS.subtext, fontWeight: '600' },
  value: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '600', textAlign: 'right' },
  sub: { fontSize: FONT_SIZE.xs, color: COLORS.subtext, textAlign: 'right' },
});

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.md, paddingBottom: SPACING.xl },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoBannerIcon: { fontSize: 28, marginRight: SPACING.sm },
  infoBannerText: { flex: 1 },
  infoBannerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  infoBannerDesc: { fontSize: FONT_SIZE.sm, color: COLORS.text, lineHeight: 20 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
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
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: FONT_SIZE.md, fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  btnSecondary: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnSecondaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },

  noteBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  noteText: { fontSize: FONT_SIZE.xs, color: '#5D4037', lineHeight: 18 },

  // ─ Success ─
  successHeader: { alignItems: 'center', marginBottom: SPACING.md },
  successIcon: { fontSize: 48, marginBottom: SPACING.xs },
  successTitle: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.accent },
  successDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  pendingBold: { fontWeight: '700', color: COLORS.text },

  idBox: {
    backgroundColor: '#F3E5F5',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CE93D8',
  },
  idLabel: { fontSize: FONT_SIZE.xs, color: '#6A1B9A', fontWeight: '700', marginBottom: 6 },
  idValue: {
    fontSize: FONT_SIZE.sm,
    color: '#4A148C',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    textAlign: 'center',
  },

  summaryBox: {
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },

  newBtn: {
    backgroundColor: '#E8F5E9',
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  newBtnText: { color: COLORS.accent, fontSize: FONT_SIZE.md, fontWeight: '700' },
});


