import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GeofenceRadiusSliderProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  min?: number;
  max?: number;
}

const GeofenceRadiusSlider: React.FC<GeofenceRadiusSliderProps> = ({
  radius,
  onRadiusChange,
  min = 50,
  max = 5000,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Safe Zone Radius: {radius}m</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={50}
        value={radius}
        onValueChange={onRadiusChange}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#D1D1D6"
        thumbTintColor="#007AFF"
      />
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>{min}m</Text>
        <Text style={styles.rangeText}>{max}m</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  rangeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default GeofenceRadiusSlider;
