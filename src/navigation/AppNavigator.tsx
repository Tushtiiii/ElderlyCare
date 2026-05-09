import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { enableScreens } from 'react-native-screens';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';
import {
  AuthStackParamList,
  DoctorTabParamList,
  ElderTabParamList,
  GuardianTabParamList,
  MainStackParamList,
  PathologistTabParamList,
} from '../types';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Shared screens
import ProfileScreen from '../screens/main/ProfileScreen';
import RelationshipsScreen from '../screens/main/RelationshipsScreen';
import ReportDetailScreen from '../screens/main/ReportDetailScreen';
import RequestConnectionScreen from '../screens/main/RequestConnectionScreen';

// Elder screens
import AddLabReportScreen from '../screens/elder/AddLabReportScreen';
import AddMedicationScreen from '../screens/elder/AddMedicationScreen';
import AddVitalScreen from '../screens/elder/AddVitalScreen';
import AlertsScreen from '../screens/elder/AlertsScreen';
import ElderDashboardScreen from '../screens/elder/ElderDashboardScreen';
import MedicationsScreen from '../screens/elder/MedicationsScreen';
import VitalHistoryScreen from '../screens/elder/VitalHistoryScreen';

// Guardian screens
import ElderDetailScreen from '../screens/guardian/ElderDetailScreen';
import ElderVitalHistoryScreen from '../screens/guardian/ElderVitalHistoryScreen';
import GuardianAlertsScreen from '../screens/guardian/GuardianAlertsScreen';
import GuardianDashboardScreen from '../screens/guardian/GuardianDashboardScreen';

// Doctor screens
import DoctorDashboardScreen from '../screens/doctor/DoctorDashboardScreen';

// Pathologist screens
import PathologistDashboardScreen from '../screens/pathologist/PathologistDashboardScreen';

enableScreens();

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const ElderTab = createBottomTabNavigator<ElderTabParamList>();
const GuardianTab = createBottomTabNavigator<GuardianTabParamList>();
const DoctorTab = createBottomTabNavigator<DoctorTabParamList>();
const PathologistTab = createBottomTabNavigator<PathologistTabParamList>();

// ── Tab icon helper ───────────────────────────────────────────────────────────
function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

// ── Auth Navigator ────────────────────────────────────────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// ── Elder Bottom Tabs ─────────────────────────────────────────────────────────
function ElderTabNavigator() {
  return (
    <ElderTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7B1FA2',
        tabBarInactiveTintColor: COLORS.subtext,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <ElderTab.Screen
        name="ElderHome"
        component={ElderDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <ElderTab.Screen
        name="Vitals"
        component={VitalHistoryScreen}
        options={{
          tabBarLabel: 'Vitals',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
      <ElderTab.Screen
        name="Medications"
        component={MedicationsScreen}
        options={{
          tabBarLabel: 'Meds',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💊" focused={focused} />,
        }}
      />
      <ElderTab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" focused={focused} />,
        }}
      />
      <ElderTab.Screen
        name="ElderProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </ElderTab.Navigator>
  );
}

// ── Guardian Bottom Tabs ──────────────────────────────────────────────────────
function GuardianTabNavigator() {
  return (
    <GuardianTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.subtext,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <GuardianTab.Screen
        name="GuardianHome"
        component={GuardianDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <GuardianTab.Screen
        name="Elders"
        component={RelationshipsScreen}
        options={{
          tabBarLabel: 'Connections',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔗" focused={focused} />,
        }}
      />
      <GuardianTab.Screen
        name="GuardianAlerts"
        component={GuardianAlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" focused={focused} />,
        }}
      />
      <GuardianTab.Screen
        name="GuardianProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </GuardianTab.Navigator>
  );
}

// ── Doctor Bottom Tabs ────────────────────────────────────────────────────────
function DoctorTabNavigator() {
  return (
    <DoctorTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.subtext,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <DoctorTab.Screen
        name="DoctorHome"
        component={DoctorDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏥" focused={focused} />,
        }}
      />
      <DoctorTab.Screen
        name="Patients"
        component={RelationshipsScreen}
        options={{
          tabBarLabel: 'Connections',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} />,
        }}
      />
      <DoctorTab.Screen
        name="DoctorUploadReport"
        component={AddLabReportScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🧪" focused={focused} />,
        }}
      />
      <DoctorTab.Screen
        name="DoctorProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </DoctorTab.Navigator>
  );
}

// ── Pathologist Bottom Tabs ───────────────────────────────────────────────────
function PathologistTabNavigator() {
  return (
    <PathologistTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.subtext,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <PathologistTab.Screen
        name="PathologistHome"
        component={PathologistDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔬" focused={focused} />,
        }}
      />
      <PathologistTab.Screen
        name="UploadReport"
        component={AddLabReportScreen}
        options={{
          tabBarLabel: 'Upload',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📤" focused={focused} />,
        }}
      />
      <PathologistTab.Screen
        name="PathologistProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </PathologistTab.Navigator>
  );
}

// ── Main Stack Navigator ──────────────────────────────────────────────────────
function MainNavigator() {
  const { user } = useAuth();
  const themeColor = user?.role === 'ELDER' ? '#7B1FA2' : COLORS.primary;

  return (
    <MainStack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: themeColor },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('VoiceInput' as any)} style={{ marginRight: 12 }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>🎤</Text>
          </TouchableOpacity>
        ),
      })}>
      {/* Tab root based on role */}
      {user?.role === 'ELDER' && (
        <MainStack.Screen
          name="ElderTabs"
          component={ElderTabNavigator}
          options={{ title: 'Elderly Care', headerBackVisible: false }}
        />
      )}
      {user?.role === 'CHILD' && (
        <MainStack.Screen
          name="GuardianTabs"
          component={GuardianTabNavigator}
          options={{ title: 'Guardian Panel', headerBackVisible: false }}
        />
      )}
      {user?.role === 'DOCTOR' && (
        <MainStack.Screen
          name="DoctorTabs"
          component={DoctorTabNavigator}
          options={{ title: 'Doctor Dashboard', headerBackVisible: false }}
        />
      )}
      {user?.role === 'PATHOLOGIST' && (
        <MainStack.Screen
          name="PathologistTabs"
          component={PathologistTabNavigator}
          options={{ title: 'Pathologist Panel', headerBackVisible: false }}
        />
      )}
      {!user?.role && (
        <MainStack.Screen
          name="Dashboard"
          component={View} // Temporary placeholder if role is missing
          options={{ title: 'Loading...' }}
        />
      )}

      {/* Shared stack screens */}
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <MainStack.Screen
        name="Relationships"
        component={RelationshipsScreen}
        options={{ title: 'My Connections' }}
      />
      <MainStack.Screen
        name="RequestConnection"
        component={RequestConnectionScreen}
        options={{ title: user?.role === 'ELDER' ? 'Add Guardian' : 'Add Connection' }}
      />
      <MainStack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: 'Report Details' }}
      />

      <MainStack.Screen
        name="VoiceInput"
        component={require('../screens/main/VoiceInputScreen').default}
        options={{ title: 'Voice Input' }}
      />

      {/* Elder-only stack screens */}
      <MainStack.Screen
        name="AddVital"
        component={AddVitalScreen}
        options={{ title: 'Record Vital' }}
      />
      <MainStack.Screen
        name="VitalHistory"
        component={VitalHistoryScreen}
        options={{ title: 'Vital History' }}
      />
      <MainStack.Screen
        name="AddMedication"
        component={AddMedicationScreen}
        options={({ route }) => ({
          title: route.params?.medication ? 'Edit Medication' : 'Add Medication',
        })}
      />
      <MainStack.Screen
        name="AddLabReport"
        component={AddLabReportScreen}
        options={{ title: 'Upload Lab Report' }}
      />

      {/* Guardian-only stack screens */}
      <MainStack.Screen
        name="ElderDetail"
        component={ElderDetailScreen}
        options={({ route }) => ({
          title: route.params?.elderName ?? 'Elder Details',
        })}
      />
      <MainStack.Screen
        name="ElderVitalHistory"
        component={ElderVitalHistoryScreen}
        options={({ route }) => ({
          title: `${route.params?.elderName}'s Vitals`,
        })}
      />
    </MainStack.Navigator>
  );
}

// ── Root Navigator ────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
