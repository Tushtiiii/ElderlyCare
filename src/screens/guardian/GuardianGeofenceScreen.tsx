import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Circle, MapPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { geofenceApi } from '../../api/geofences';
import GeofenceRadiusSlider from '../../components/common/GeofenceRadiusSlider';

interface GuardianGeofenceScreenProps {
  route: {
    params: {
      elderId: number;
      guardianId: number;
    };
  };
}

const GuardianGeofenceScreen: React.FC<GuardianGeofenceScreenProps> = ({ route }) => {
  const { elderId, guardianId } = route.params;

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [radius, setRadius] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExistingGeofence();
  }, [elderId]);

  const fetchExistingGeofence = async () => {
    try {
      const existingGeofence = await geofenceApi.getGeofenceByElderId(elderId);
      if (existingGeofence) {
        setMarkerPosition({
          latitude: existingGeofence.centerLatitude,
          longitude: existingGeofence.centerLongitude,
        });
        setRadius(existingGeofence.radiusMeters);
        setRegion({
          ...region,
          latitude: existingGeofence.centerLatitude,
          longitude: existingGeofence.centerLongitude,
        });
      }
    } catch (error) {
      console.log('No existing geofence or error:', error);
    }
  };

  const onMapPress = (e: MapPressEvent) => {
    setMarkerPosition(e.nativeEvent.coordinate);
  };

  const saveGeofence = async () => {
    if (!markerPosition) {
      Alert.alert('Error', 'Please tap on the map to set a geofence center.');
      return;
    }

    setLoading(true);
    try {
      await geofenceApi.createGeofence({
        elderId,
        guardianId,
        centerLatitude: markerPosition.latitude,
        centerLongitude: markerPosition.longitude,
        radiusMeters: radius,
      });
      Alert.alert('Success', 'Geofence saved successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save geofence.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onPress={onMapPress}
      >
        {markerPosition && (
          <>
            <Marker coordinate={markerPosition} />
            <Circle
              center={markerPosition}
              radius={radius}
              strokeColor="rgba(0, 122, 255, 0.5)"
              fillColor="rgba(0, 122, 255, 0.2)"
            />
          </>
        )}
      </MapView>

      <View style={styles.controls}>
        <GeofenceRadiusSlider
          radius={radius}
          onRadiusChange={setRadius}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={saveGeofence}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : 'Save Geofence'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A2A2A2',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GuardianGeofenceScreen;
