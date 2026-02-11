/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const DeviceLocation = ({route}: any) => {
  const {device} = route.params;

  // Estimation de distance avec RSSI
  const getDistanceEstimate = (rssi: number) => {
    if (rssi >= -50) {
      return 'Très proche (~1-2m)';
    } else if (rssi >= -70) {
      return 'Moyennement proche (~3-5m)';
    } else {
      return 'Loin (~6m+)';
    }
  };

  const calculateDistance = (rssi: number, txPower: number = -59) => {
    if (rssi === 0) {
      return -1.0; // Distance inconnue
    }

    const ratio = rssi / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      return 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    }
  };

  // Conversion d'une distance en mètres -> Offset Latitude & Longitude
  const moveCoords = (
    latitude: number,
    longitude: number,
    distance: number,
  ) => {
    const earthRadius = 6371000; // rayon Terre en mètre
    const offsetLat = (distance / earthRadius) * (180 / Math.PI);
    const offsetLng =
      (distance / (earthRadius * Math.cos((Math.PI * latitude) / 180))) *
      (180 / Math.PI);

    return {
      latitude: latitude + offsetLat,
      longitude: longitude + offsetLng,
    };
  };

  const userCoords = {latitude: device.latitude, longitude: device.longitude};
  const distanceMeters = calculateDistance(device.extra.rssi);
  const deviceCoords = moveCoords(
    device.latitude,
    device.longitude,
    distanceMeters,
  );

  return (
    <View style={{flex: 1}}>
      {/* <Text style={{textAlign: 'center', fontSize: 16, marginVertical: 10}}>
        Appareil: {device.name || 'Inconnu'} ({device.address}) {'\n'}
        Signal: {device.extra.rssi} dBm - {getDistanceEstimate(device.rssi)}
      </Text> */}
      <Text style={{textAlign: 'center', fontSize: 16, marginVertical: 10}}>
        Appareil : {device.name || 'Inconnu'} ({device.address}) {'\n'}
        Signal RSSI : {device.extra?.rssi || device.rssi} dBm -{' '}
        {getDistanceEstimate(device.extra?.rssi || device.rssi)} {'\n'}
        Distance estimée :{' '}
        {calculateDistance(device.extra?.rssi || device.rssi).toFixed(2)} mètres
      </Text>

      <MapView
        style={{flex: 1}}
        initialRegion={{
          ...userCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {/* Position de l'utilisateur */}
        <Marker
          coordinate={userCoords}
          title="Votre Position"
          pinColor="blue"
        />

        {/* Position estimée du device */}
        <Marker
          coordinate={deviceCoords}
          title={device.name || 'Appareil'}
          pinColor="red"
        />
      </MapView>
    </View>
  );
};

export default DeviceLocation;
