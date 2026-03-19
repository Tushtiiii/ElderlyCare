import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { geofenceApi } from '../api/geofences';

// Native module reference (Assumes a native module 'GeofencingModule' exists)
const { GeofencingModule } = NativeModules;

export interface GeofenceConfig {
  requestId: string;
  latitude: number;
  longitude: number;
  radius: number;
  transitionTypes: 'EXIT';
}

class ElderGeofenceService {
  private ELDER_SAFE_ZONE_ID = 'ELDER_SAFE_ZONE';

  /**
   * Request necessary location permissions for Android.
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;

    try {
      const fineLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Fine Location Permission',
          message: 'This app needs access to your location to monitor geofences.',
          buttonPositive: 'OK',
        }
      );

      if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Fine location permission denied');
        return false;
      }

      // Android 10+ requires background location for background geofencing
      if (Platform.Version >= 29) {
        const backgroundLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Permission',
            message: 'To keep you safe, we need background location access to monitor when you leave your safe zone.',
            buttonPositive: 'Allow',
          }
        );

        if (backgroundLocation !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Background location permission denied');
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  }

  /**
   * Fetch geofence from backend and register with Android native API.
   */
  async syncGeofence(elderId: number): Promise<void> {
    try {
      if (!(await this.requestPermissions())) {
        console.warn('Insufficient permissions to sync geofence');
        return;
      }

      const geofence = await geofenceApi.getGeofenceByElderId(elderId);

      if (geofence) {
        const config: GeofenceConfig = {
          requestId: this.ELDER_SAFE_ZONE_ID,
          latitude: geofence.centerLatitude,
          longitude: geofence.centerLongitude,
          radius: geofence.radiusMeters,
          transitionTypes: 'EXIT',
        };

        // Call native module to register geofence
        if (GeofencingModule) {
          await GeofencingModule.addGeofence(config);
          console.log('Geofence registered successfully via Native Module');
        } else {
          console.error('GeofencingModule not available in native side');
        }
      }
    } catch (error) {
      console.error('Error syncing geofence:', error);
    }
  }

  /**
   * Remove local geofence registration.
   */
  async removeGeofence(): Promise<void> {
    try {
      if (GeofencingModule) {
        await GeofencingModule.removeGeofences([this.ELDER_SAFE_ZONE_ID]);
        console.log('Geofence removed successfully');
      }
    } catch (error) {
      console.error('Error removing geofence:', error);
    }
  }
}

export default new ElderGeofenceService();
