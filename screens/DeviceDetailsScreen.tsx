import React, {useRef, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const DeviceDetailsScreen = ({route}: any) => {
  const {device} = route.params;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

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
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...userCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {/* <Marker
          coordinate={{latitude, longitude}}
          title={device.name || 'Inconnu'}
          description={`Distance estimée : ${calculateDistance(
            device.extra?.rssi || device.rssi,
          ).toFixed(2)} m`}
        /> */}
        <Marker
          coordinate={userCoords}
          title="Votre Position"
          pinColor="blue"
        />
        <Marker
          coordinate={deviceCoords}
          title={device.name || 'Appareil'}
          pinColor="red"
        />
      </MapView>

      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <BottomSheetView style={styles.bottomsheet}>
          <View style={styles.sheetContent}>
            <Text style={styles.title}>
              Appareil : {device.name || 'Inconnu'}
            </Text>
            <Text style={styles.text}>Adresse : {device.address}</Text>
            <Text style={styles.text}>
              Signal RSSI : {device.extra?.rssi || device.rssi} dBm
              {'\n'}Estimation :{' '}
              {getDistanceEstimate(device.extra?.rssi || device.rssi)}
              {'\n'}Distance :{' '}
              {calculateDistance(device.extra?.rssi || device.rssi).toFixed(2)}{' '}
              mètres
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  sheetContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
  },
  bottomsheet: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
});

export default DeviceDetailsScreen;
